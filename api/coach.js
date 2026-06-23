// api/coach.js
// ─────────────────────────────────────────────────────────────────────────────
// Vercel serverless function. This runs on the SERVER, not in the browser.
// Your Anthropic API key lives in process.env.ANTHROPIC_API_KEY — set as a
// secret in the Vercel dashboard. It is NEVER sent to the browser, so visitors
// can use the tool without a key and your key stays private.
//
// A simple in-memory rate limit caps requests per IP so a public link can't
// burn through your credits. In-memory state resets when the function cold-
// starts, which is fine for a demo; for heavier use you'd use a real store.
// ─────────────────────────────────────────────────────────────────────────────

const WINDOW_MS = 60 * 1000; // 1 minute
const MAX_PER_WINDOW = 8; // per IP per minute
const hits = new Map();

function rateLimited(ip) {
  const now = Date.now();
  const rec = hits.get(ip) || { count: 0, start: now };
  if (now - rec.start > WINDOW_MS) {
    rec.count = 0;
    rec.start = now;
  }
  rec.count += 1;
  hits.set(ip, rec);
  return rec.count > MAX_PER_WINDOW;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const ip =
    (req.headers["x-forwarded-for"] || "").split(",")[0].trim() || "unknown";
  if (rateLimited(ip)) {
    return res
      .status(429)
      .json({ error: "Slow down a moment — too many requests. Try again shortly." });
  }

  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) {
    return res
      .status(500)
      .json({ error: "Server is missing its API key. (Set ANTHROPIC_API_KEY in Vercel.)" });
  }

  try {
    const { graderInstructions, debriefInstructions, scenarioOpener, history, userReply, mode } = req.body || {};

    const isDebrief = mode === "debrief";

    if (!scenarioOpener) {
      return res.status(400).json({ error: "Missing required fields." });
    }
    if (isDebrief && !debriefInstructions) {
      return res.status(400).json({ error: "Missing debrief instructions." });
    }
    if (!isDebrief && (!graderInstructions || !userReply)) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    // Build the conversation. In coaching mode we replay the dialogue and ask
    // for an in-character reply plus turn coaching. In debrief mode we hand the
    // whole transcript over and ask for a session-level summary.
    const convo = [];
    convo.push({
      role: "user",
      content: `SCENARIO (the fictional peer's opening line): "${scenarioOpener}"\n\nThe trainee will now respond. Treat each trainee message as their attempt at a supportive reply.`,
    });
    convo.push({
      role: "assistant",
      content: JSON.stringify({
        peerReply: scenarioOpener,
        coach: { worked: "", adjust: "", techniquesSpotted: [] },
      }),
    });
    if (Array.isArray(history)) {
      for (const turn of history) {
        if (turn.role === "user") convo.push({ role: "user", content: turn.content });
        if (turn.role === "assistant")
          convo.push({ role: "assistant", content: turn.content });
      }
    }

    if (isDebrief) {
      convo.push({
        role: "user",
        content:
          "The practice session is over. Looking back across this whole conversation, give me my end-of-session debrief in the required JSON shape.",
      });
    } else {
      convo.push({ role: "user", content: userReply });
    }

    const anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1000,
        system: isDebrief ? debriefInstructions : graderInstructions,
        messages: convo,
      }),
    });

    if (!anthropicRes.ok) {
      const detail = await anthropicRes.text();
      return res
        .status(502)
        .json({ error: "Upstream error from the model.", detail });
    }

    const data = await anthropicRes.json();
    const text = (data.content || [])
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("\n")
      .replace(/```json|```/g, "")
      .trim();

    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      // Fallback: if the model didn't return clean JSON, surface its text as
      // coaching rather than crashing.
      parsed = {
        peerReply: "(…)",
        coach: { worked: "", adjust: text, techniquesSpotted: [] },
      };
    }

    return res.status(200).json(parsed);
  } catch (err) {
    return res.status(500).json({ error: "Something went wrong.", detail: String(err) });
  }
}
