# Listening Practice — setup & deploy walkthrough

A small web tool for rehearsing peer-support listening. A fictional person opens
up; you write how you'd respond; Claude responds in character **and** coaches you
on whether you stayed non-directive (companioning, not fixing). The scenarios are
fictional and the rubric reflects real peer-support technique — that rubric, in
`scenarios.js`, is the part that's yours to own and defend.

---

## What's in here

```
peer-practice/
├── index.html       ← the interface (open this to see the design)
├── scenarios.js     ← THE HEART: scenario bank + grading rubric. Edit this.
├── api/coach.js     ← serverless function; calls Claude, keeps your key private
├── package.json
└── README.md        ← you're reading it
```

The one design decision worth understanding: your Anthropic API key lives **on
the server** (as a Vercel secret), never in the page. That's why visitors can use
the live link without a key, and why your key can't be lifted from "view source."
A small rate limit in `api/coach.js` keeps a public link from burning credits.

---

## Deploy to Vercel — step by step

You'll need a free GitHub account and a free Vercel account. ~15 minutes.

### 1. Put the code on GitHub
- Make a new repository on github.com (call it `listening-practice`, keep it Public or Private — both work).
- Upload all the files in this folder, preserving the `api/` subfolder. (GitHub's
  web uploader handles folders if you drag the whole thing in, or use `git`.)

### 2. Get an Anthropic API key
- Go to **console.anthropic.com → API Keys → Create Key**.
- Copy it somewhere safe for a moment. **Treat it like a password** — never paste
  it into the code, a chat, an email, or the page. You'll give it directly to
  Vercel in the next step and nowhere else.

### 3. Import into Vercel
- Go to **vercel.com → Add New → Project → Import** your GitHub repo.
- Before clicking Deploy, open **Environment Variables** and add:
  - **Name:** `ANTHROPIC_API_KEY`
  - **Value:** *(paste your key)*
- Click **Deploy**. Vercel detects the `api/` folder and runs `coach.js` as a
  serverless function automatically — no extra config.

### 4. Test it
- Vercel gives you a URL like `listening-practice.vercel.app`.
- Open it, pick a scenario, click **Start**, write a response, click **Send**.
- Try giving a deliberately advice-heavy response ("you should just…") and watch
  the coach flag it as fixing. That's the rubric working.

### 5. (Optional) rotate the key later
If you ever think the key leaked, go to console.anthropic.com, delete it, make a
new one, and update the Vercel env variable. Costs nothing.

---

## Making it yours (do this — it's what you'll talk about)

- **Add scenarios** in `scenarios.js` → `SCENARIOS`. Keep them fictional. Write a
  few that reflect situations you actually practiced for.
- **Tune the rubric** in `TECHNIQUES` (what to reward, what to flag) and in
  `buildGraderInstructions()`. This is where your judgment shows. If your program
  emphasizes something specific, encode it here.
- **Keep the boundary intact.** The "this is practice, not a counseling line"
  notice and the no-certification framing are the point — they show you scoped a
  sensitive tool responsibly. Don't remove them to look more impressive; they
  *are* the impressive part.

## A few honest limits (good to name in an interview)
- In-memory rate limiting resets on cold starts — fine for a demo, not for scale.
- No login; anyone with the link can use it (that's intended for the application).
- The coach is only as good as the rubric. Garbage rubric, garbage feedback —
  which is exactly why the rubric, not the chat box, is the real work.
