// scenarios.js
// ─────────────────────────────────────────────────────────────────────────────
// THIS FILE IS THE HEART OF THE TOOL. It encodes what good peer-support
// responses look like. The scenarios are SYNTHETIC (invented for practice) and
// the rubric language is written generically. No real cases, no real people,
// no internal training material.
//
// Design philosophy (what the tool grades toward):
//   - The counselor is a COMPANION, not a fixer. The goal is not to solve the
//     speaker's problem but to make a safe space and let them lead.
//   - NON-DIRECTIVE support is the spine: reflect, validate, ask open
//     questions, sit with silence. Don't prescribe, diagnose, or advise.
//   - Believe and don't judge.
//
// Audience: college students (Response-style peer counseling context).
// Edit freely: add scenarios, tune the rubric, change the focus.
// ─────────────────────────────────────────────────────────────────────────────

export const TECHNIQUES = {
  reward: [
    { name: "Reflecting / paraphrasing", desc: "Mirrors back what the speaker said so they can hear it with some distance." },
    { name: "Validating", desc: "Communicates that the speaker's feelings make sense, without judgment." },
    { name: "Open-ended questions", desc: "Invites the speaker to keep leading ('what was that like for you?') rather than yes/no or leading questions." },
    { name: "Clarifying", desc: "Asks to understand better, not to satisfy curiosity or steer." },
    { name: "Sitting with it / allowing space", desc: "Tolerates silence and heavy feeling instead of rushing to fill or fix it." },
    { name: "Check-ins", desc: "Asks how the speaker is doing or whether you're hearing them right." },
    { name: "Normalizing (carefully)", desc: "Connects the speaker's experience to what others commonly feel, without minimizing theirs." },
  ],
  flag: [
    { name: "Jumping to advice", desc: "Telling the speaker what to do ('you should...', 'have you tried...') instead of letting them find it." },
    { name: "Fixing / problem-solving for them", desc: "Taking over the problem rather than companioning them through it." },
    { name: "Minimizing", desc: "'It's not that bad', 'at least...', or anything that shrinks the feeling." },
    { name: "Judging or assuming", desc: "Filling in their story, or implying a right/wrong way to feel or act." },
    { name: "Making it about you", desc: "Sharing your own story or creating intimacy. The space is for them." },
    { name: "Interrogating", desc: "Rapid-fire or leading questions that steer rather than open." },
  ],
};

// Each scenario: an opening line from a fictional student. `escalation` flags
// scenarios that should trigger a hand-off-to-a-human message. All kept on the
// non-crisis side by design.
export const SCENARIOS = [
  { id: "roommate-drift", tag: "Loneliness", opener: "I don't know, it's stupid. My roommates all have their own friend groups now and I just kind of... eat alone a lot. I didn't think college would feel like this.", escalation: false },
  { id: "exam-spiral", tag: "Academic pressure", opener: "I bombed the midterm. Like genuinely failed it. Everyone here is so smart and I'm starting to think I just don't belong at this school.", escalation: false },
  { id: "impostor", tag: "Belonging", opener: "Everyone keeps congratulating me for getting in and I just keep waiting for someone to realize they made a mistake. Like I'm one bad grade away from them figuring it out.", escalation: false },
  { id: "homesick", tag: "Homesickness", opener: "I call home every night and my mom keeps saying it'll get better but it's been a whole semester. I feel like a little kid for missing it this much.", escalation: false },
  { id: "family-distance", tag: "Family", opener: "My mom keeps calling and I keep not picking up. I feel guilty but every time we talk she asks when I'm coming home and I can't explain why I don't want to.", escalation: false },
  { id: "family-expectations", tag: "Family expectations", opener: "My parents think I'm pre-med. I haven't told them I dropped chem. Every time they bring up med school I just go quiet and they think I'm tired.", escalation: false },
  { id: "breakup-numb", tag: "Relationship", opener: "We broke up three weeks ago and everyone keeps telling me I should be over it by now. I'm not. I don't really feel anything actually, I just feel kind of flat.", escalation: false },
  { id: "situationship", tag: "Relationship", opener: "I don't even know if we were together, that's the thing. So I can't really be sad about it 'officially.' But I check my phone like a hundred times a day.", escalation: false },
  { id: "friend-rupture", tag: "Friendship", opener: "My best friend since freshman year just kind of... stopped texting back. I keep replaying what I could've done. We were supposed to live together next year.", escalation: false },
  { id: "friend-worry", tag: "Worry for others", opener: "It's not even about me. My friend hasn't left her room in days and she's barely texting back and I don't know if I'm overreacting or if I should do something.", escalation: false },
  { id: "comparison", tag: "Comparison", opener: "Everyone on my feed has internships and I have nothing lined up. I know it's just Instagram but I feel so behind, like everyone got a manual I didn't.", escalation: false },
  { id: "burnout", tag: "Burnout", opener: "I used to care about all of this. Now I'm just going through the motions. I do the readings and nothing goes in. I don't even know why I'm tired, I just am.", escalation: false },
  { id: "identity", tag: "Identity", opener: "I came here thinking I'd finally figure out who I am and somehow I feel less sure than before. Everyone seems so certain about themselves and I'm just not.", escalation: false },
  { id: "first-gen", tag: "Belonging", opener: "Nobody in my family went to college so I can't really ask them about any of this. I feel like everyone else already knows the rules and I'm just guessing.", escalation: false },
  { id: "grief", tag: "Grief", opener: "My grandfather passed over break and I came back and everyone just... expected me to be normal. I sat in lecture yesterday and realized I hadn't thought about him in hours and felt awful.", escalation: false },
  { id: "perfectionism", tag: "Perfectionism", opener: "I got an A-minus and I've been sick about it all week. I know how that sounds. I just can't turn it off, the feeling that anything less than perfect means I'm slipping.", escalation: false },
  { id: "social-anxiety", tag: "Social anxiety", opener: "There was a thing in my dorm last night and I stood in the hallway for ten minutes and then just went back to my room. Everyone makes it look so easy and I can't even walk in.", escalation: false },
  { id: "major-doubt", tag: "Direction", opener: "I picked this major to be safe and now I'm two years in and I think I hate it. Switching feels insane this late but staying feels worse. I don't know how I got here.", escalation: false },
  { id: "conflict-roommate", tag: "Conflict", opener: "My roommate and I haven't actually spoken in like a week. It's not even about anything big, it just got tense and now the room is unbearable and I dread going back.", escalation: false },
  { id: "overcommitted", tag: "Overwhelm", opener: "I said yes to everything this semester and now it's all due at once and I can't drop any of it without letting someone down. I keep telling everyone I'm fine.", escalation: false },
];

// The rubric text handed to the model. Intentionally explicit about being a
// PRACTICE tool with limits, so the feedback reinforces the boundary that this
// does not replace real training.
export function buildGraderInstructions() {
  const reward = TECHNIQUES.reward.map((t) => `- ${t.name}: ${t.desc}`).join("\n");
  const flag = TECHNIQUES.flag.map((t) => `- ${t.name}: ${t.desc}`).join("\n");

  return `You are a supportive coach helping a trainee practice PEER-SUPPORT listening skills. This is a rehearsal tool for college students who are already in or have completed real, supervised peer-counseling training. It does NOT replace that training, supervision, or any real escalation protocol.

You are playing two roles in sequence:

1) THE PEER (in-scenario): respond as the fictional student in the scenario would, briefly and realistically, reacting to how the trainee just spoke to you. Stay in character. Do not narrate.

2) THE COACH (feedback): step out and give the trainee specific, kind, concrete feedback on their listening technique.

The technique being practiced is NON-DIRECTIVE peer support. The counselor is a companion, not a fixer. The aim is to make a safe space and let the speaker lead, not to solve their problem.

REWARD and name when the trainee uses these well:
${reward}

GENTLY FLAG when the trainee does these. Explain why it pulls against non-directive support, and offer a concrete reframe they could have used instead:
${flag}

Rules for your coaching:
- Be specific. Quote the trainee's own words when praising or flagging.
- Lead with something that worked before something to adjust.
- Offer one concrete alternative phrasing, not a lecture.
- Keep it short, a few sentences. Overwhelming a learner is itself a failure mode.
- Never imply this tool certifies anyone or replaces real supervised training.

Return ONLY valid JSON, no markdown, no backticks, in this exact shape:
{
  "peerReply": "the in-character response from the fictional student (1-3 sentences)",
  "coach": {
    "worked": "what the trainee did well, quoting them (1-2 sentences)",
    "adjust": "one thing to adjust, with a concrete alternative phrasing (1-2 sentences)",
    "techniquesSpotted": ["short technique names you observed"]
  }
}`;
}

// Session-level debrief. Called when the trainee wraps up a conversation.
// Looks at the WHOLE transcript and reflects the pattern back, so the learner
// sees their habits rather than just one turn. Same non-directive philosophy.
export function buildDebriefInstructions() {
  const reward = TECHNIQUES.reward.map((t) => `- ${t.name}`).join("\n");
  const flag = TECHNIQUES.flag.map((t) => `- ${t.name}`).join("\n");

  return `You are a peer-support coach giving an END-OF-SESSION debrief to a trainee who just finished practicing a non-directive listening scenario. You are looking at the WHOLE conversation, not a single turn. Your job is to make the PATTERN visible so they learn their own habits.

This is a practice tool for people already in supervised peer-support training. It does NOT certify anyone or replace real training.

Non-directive technique means companioning, not fixing: reflecting, validating, asking open questions, sitting with feeling. The failure modes are advice-giving, fixing, minimizing, judging, making it about yourself, and interrogating.

Techniques to notice (reward):
${reward}

Patterns to notice (watch for):
${flag}

Write a short, encouraging debrief. Be specific to what they actually did across the conversation. Name a real pattern, not a generic one. Quote them once if it helps. End with ONE thing to carry into the next practice. Keep it warm and brief. Never imply this certifies them.

Return ONLY valid JSON, no markdown, no backticks, in this exact shape:
{
  "headline": "one short phrase capturing the overall session (e.g. 'You stayed with them well, but reached for fixes under pressure')",
  "leaned_on": ["techniques they used most, by name"],
  "watch_for": ["1-2 patterns to watch, by name"],
  "summary": "2-4 sentences describing the arc of how they did, specific to this conversation",
  "carry_forward": "one concrete thing to focus on next time (1 sentence)"
}`;
}
