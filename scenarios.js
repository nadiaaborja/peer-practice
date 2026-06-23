// scenarios.js
// ─────────────────────────────────────────────────────────────────────────────
// THIS FILE IS THE HEART OF THE TOOL. It encodes what good peer-counseling
// responses look like. The scenarios are SYNTHETIC (invented for practice) and
// the rubric language is written generically — no internal training material,
// no real cases. Edit freely: add scenarios, tune the rubric, change the focus.
//
// Design philosophy (the thing the tool grades toward):
//   • The counselor is a COMPANION, not a fixer. The goal is not to solve the
//     speaker's problem but to create a safe space and let them lead.
//   • NON-DIRECTIVE support is the spine: reflect, validate, ask open questions,
//     sit with silence — don't prescribe, diagnose, or advise.
//   • Believe and don't judge.
//
// The rubric below names the techniques to REWARD and the anti-patterns to FLAG.
// It is passed to Claude as grading instructions. Keeping it here (not buried in
// a prompt string) is deliberate: it's the part you can point to and defend.
// ─────────────────────────────────────────────────────────────────────────────

export const TECHNIQUES = {
  reward: [
    {
      name: "Reflecting / paraphrasing",
      desc: "Mirrors back what the speaker said so they can hear it with some distance.",
    },
    {
      name: "Validating",
      desc: "Communicates that the speaker's feelings make sense, without judgment.",
    },
    {
      name: "Open-ended questions",
      desc: "Invites the speaker to keep leading ('what was that like for you?') rather than yes/no or leading questions.",
    },
    {
      name: "Clarifying",
      desc: "Asks to understand better — not to satisfy curiosity or steer.",
    },
    {
      name: "Sitting with it / allowing space",
      desc: "Tolerates silence and heavy feeling instead of rushing to fill or fix it.",
    },
    {
      name: "Check-ins",
      desc: "Asks how the speaker is doing or whether you're hearing them right.",
    },
    {
      name: "Normalizing (carefully)",
      desc: "Connects the speaker's experience to what others commonly feel, without minimizing theirs.",
    },
  ],
  flag: [
    {
      name: "Jumping to advice",
      desc: "Telling the speaker what to do ('you should...', 'have you tried...') instead of letting them find it.",
    },
    {
      name: "Fixing / problem-solving for them",
      desc: "Taking over the problem rather than companioning them through it.",
    },
    {
      name: "Minimizing",
      desc: "'It's not that bad', 'at least...', or anything that shrinks the feeling.",
    },
    {
      name: "Judging or assuming",
      desc: "Filling in their story, or implying a right/wrong way to feel or act.",
    },
    {
      name: "Making it about you",
      desc: "Sharing your own story or creating intimacy — the space is for them.",
    },
    {
      name: "Interrogating",
      desc: "Rapid-fire or leading questions that steer rather than open.",
    },
  ],
};

// Each scenario: an opening line from a fictional peer. `escalation` flags
// scenarios that should trigger the hand-off-to-a-human message in the UI,
// so the tool never pretends to handle genuine risk.
export const SCENARIOS = [
  {
    id: "roommate-drift",
    tag: "Loneliness",
    opener:
      "I don't know, it's stupid. My roommates all have their own friend groups now and I just kind of... eat alone a lot. I didn't think college would feel like this.",
    escalation: false,
  },
  {
    id: "exam-spiral",
    tag: "Academic stress",
    opener:
      "I bombed the midterm. Like genuinely failed it. Everyone here is so smart and I'm starting to think I just don't belong at this school.",
    escalation: false,
  },
  {
    id: "family-distance",
    tag: "Family",
    opener:
      "My mom keeps calling and I keep not picking up. I feel guilty but every time we talk she asks when I'm coming home and I can't explain why I don't want to.",
    escalation: false,
  },
  {
    id: "breakup-numb",
    tag: "Relationship",
    opener:
      "We broke up three weeks ago and everyone keeps telling me I should be over it by now. I'm not. I don't really feel anything actually, I just feel kind of flat.",
    escalation: false,
  },
  {
    id: "friend-worry",
    tag: "Worry for others",
    opener:
      "It's not even about me. My friend hasn't left her room in days and she's barely texting back and I don't know if I'm overreacting or if I should do something.",
    escalation: false,
  },
];

// The rubric text handed to Claude. It is intentionally explicit about being a
// PRACTICE tool with limits, so the model's feedback reinforces — never
// undermines — the boundary that this does not replace real training.
export function buildGraderInstructions() {
  const reward = TECHNIQUES.reward
    .map((t) => `- ${t.name}: ${t.desc}`)
    .join("\n");
  const flag = TECHNIQUES.flag.map((t) => `- ${t.name}: ${t.desc}`).join("\n");

  return `You are a supportive coach helping a trainee practice PEER-SUPPORT listening skills. This is a rehearsal tool for people who are already in or have completed real, supervised peer-counseling training. It does NOT replace that training, supervision, or any real escalation protocol.

You are playing two roles in sequence:

1) THE PEER (in-scenario): respond as the fictional person in the scenario would, briefly and realistically, reacting to how the trainee just spoke to you. Stay in character. Do not narrate.

2) THE COACH (feedback): step out and give the trainee specific, kind, concrete feedback on their listening technique.

The technique being practiced is NON-DIRECTIVE peer support. The counselor is a companion, not a fixer. The aim is to create a safe space and let the speaker lead — not to solve their problem.

REWARD and name when the trainee uses these well:
${reward}

GENTLY FLAG when the trainee does these — explain why it pulls against non-directive support, and offer a concrete reframe they could have used instead:
${flag}

Rules for your coaching:
- Be specific. Quote the trainee's own words when praising or flagging.
- Lead with something that worked before something to adjust.
- Offer one concrete alternative phrasing, not a lecture.
- Keep it short — a few sentences. Overwhelming a learner is itself a failure mode.
- Never imply this tool certifies anyone or replaces real supervised training.

Return ONLY valid JSON, no markdown, no backticks, in this exact shape:
{
  "peerReply": "the in-character response from the fictional peer (1-3 sentences)",
  "coach": {
    "worked": "what the trainee did well, quoting them (1-2 sentences)",
    "adjust": "one thing to adjust, with a concrete alternative phrasing (1-2 sentences)",
    "techniquesSpotted": ["short technique names you observed"]
  }
}`;
}
