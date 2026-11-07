import { test } from "node:test";
import assert from "node:assert";
import { strictEqual, deepStrictEqual } from "node:assert/strict";
import {
  initialAnswers,
  setAnswer,
  isComplete,
  areAllQuestionsComplete,
  computeResult,
  computeResultForArchetype,
} from "../assets/scoring.js";
import { QUIZ_QUESTIONS, QUESTION_COUNT } from "../assets/quiz-data.js";
import { generatePlaybook, buildNicheBriefText } from "../assets/results.js";
import { ARCHETYPES } from "../assets/personas.js";

function answers(overrides = {}) {
  return {
    motivation: "connection",
    personality: "warm",
    visualIdentity: ["luxury"],
    cameraComfort: "faceVisible",
    formats: ["photography"],
    engagement: "community",
    boundaries: [],
    strengths: "conversation",
    collaboration: "solo",
    capacity: "launchLow",
    ...overrides,
  };
}

test("quiz exposes ten questions with navigable options", () => {
  assert.strictEqual(QUESTION_COUNT, 10);
  for (const question of QUIZ_QUESTIONS) {
    assert.ok(question.id, "every question needs an id");
    assert.ok(Array.isArray(question.options) && question.options.length > 0, `question ${question.id} needs options`);
    if (question.type === "single") {
      assert.strictEqual(question.options.filter((o) => o.archetypes).length, question.options.length, `single select ${question.id} should map weights`);
    }
  }
});

test("luxury-focused answers produce an appropriate glamorous result", () => {
  const result = computeResult(
    answers({
      motivation: "income",
      personality: "glamorous",
      visualIdentity: ["luxury"],
      cameraComfort: "faceVisible",
      formats: ["prerecordedVideo", "photography"],
      strengths: "styling",
    }),
  );
  assert.strictEqual(result.top.id, "glam-luxury-muse");
  assert.ok(result.fitScore >= 5 && result.fitScore <= 98);
});

test("anonymous preferences are respected throughout the results", () => {
  const result = computeResult(
    answers({
      cameraComfort: "anonymous",
      boundaries: ["privacy", "publicVisibility"],
      visualIdentity: ["minimalist"],
      motivation: "identity",
    }),
  );
  assert.strictEqual(result.top.id, "anonymous-faceless");
  assert.strictEqual(result.anonymityBound, true);
});

test("users who reject live video are not given live-only strategies", () => {
  const result = computeResult(
    answers({
      motivation: "performance",
      personality: "commanding",
      formats: ["liveSessions"],
      engagement: "performance",
      strengths: "performance",
      boundaries: ["liveInteraction"],
      collaboration: "solo",
    }),
  );
  assert.notStrictEqual(result.top.id, "cam");
  assert.ok(!result.alternatives.some((a) => a.id === "cam"), "cam must not be an alternative when live is declined");
});

test("couple branding is not recommended without affirmative collaboration interest", () => {
  const result = computeResult(
    answers({
      collaboration: "solo",
      boundaries: ["collaboration"],
      engagement: "community",
      motivation: "connection",
      strengths: "conversation",
    }),
  );
  assert.notStrictEqual(result.top.id, "couple");
  assert.ok(!result.alternatives.some((a) => a.id === "couple"));
});

test("every archetype is reachable through an appropriate answer combination", () => {
  const cases = [
    { archetype: "soft-gfe", overrides: { motivation: "connection", personality: "warm", engagement: "community", strengths: "conversation", formats: ["writing"] } },
    { archetype: "glam-luxury-muse", overrides: { motivation: "income", personality: "glamorous", visualIdentity: ["luxury"], strengths: "styling", formats: ["prerecordedVideo"] } },
    { archetype: "alt-goth", overrides: { personality: "mysterious", visualIdentity: ["alternative"], motivation: "expression", engagement: "storytelling" } },
    { archetype: "fitness-fantasy", overrides: { strengths: "fitness", visualIdentity: ["athletic"], motivation: "income", formats: ["tutorials"] } },
    { archetype: "cosplay", overrides: { visualIdentity: ["character"], motivation: "performance", strengths: "cosplay", formats: ["prerecordedVideo"] } },
    { archetype: "dominant", overrides: { personality: "commanding", motivation: "performance", strengths: "performance", formats: ["liveSessions"] } },
    { archetype: "edu-coach", overrides: { strengths: "teaching", formats: ["tutorials"], engagement: "education", personality: "calm" } },
    { archetype: "cam", overrides: { motivation: "performance", formats: ["liveSessions"], engagement: "entertainment", personality: "playful" } },
    { archetype: "anonymous-faceless", overrides: { cameraComfort: "anonymous", boundaries: ["privacy", "publicVisibility"], motivation: "identity" } },
    { archetype: "couple", overrides: { motivation: "expression", personality: "calm", visualIdentity: ["minimalist"], cameraComfort: "faceVisible", formats: ["writing"], engagement: "storytelling", boundaries: ["collaboration"], strengths: "styling", collaboration: "collab", capacity: "exploring" } },
  ];

  for (const { archetype, overrides } of cases) {
    const result = computeResult(answers(overrides));
    assert.strictEqual(result.top.id, archetype, `expected archetype ${archetype} to be reachable`);
  }
});

test("incomplete quiz answers are handled safely", () => {
  const result = computeResult({});
  assert.ok(result.top && result.top.id, "an incomplete quiz must still produce a safe result");
  assert.ok(Number.isFinite(result.fitScore));
  assert.ok(Array.isArray(result.alternatives) && result.alternatives.length > 0);
});

test("tie-breaking is deterministic", () => {
  const runA = computeResult(answers({ motivation: "expression", personality: "calm" }));
  const runB = computeResult(answers({ motivation: "expression", personality: "calm" }));
  deepStrictEqual(runA, runB);
  const sorted = [...runA.alternatives].sort((a, b) => b.score - a.score);
  assert.deepStrictEqual(runA.alternatives, sorted);
});

test("generated playbooks contain relevant, nonempty recommendations", () => {
  const result = computeResult(answers({ personality: "glamorous", visualIdentity: ["luxury"], strengths: "styling" }));
  const playbook = generatePlaybook(result);
  assert.strictEqual(playbook.brand.names.length, 3);
  assert.ok(playbook.brand.tagline.length > 0);
  assert.ok(playbook.pillars.length >= 3);
  for (const pillar of playbook.pillars) {
    assert.ok(pillar.title.length > 0);
    assert.ok(Array.isArray(pillar.ideas) && pillar.ideas.length === 2);
    assert.ok(pillar.format.length > 0);
  }
  assert.strictEqual(playbook.platforms.length, 5);
  assert.strictEqual(playbook.plan.length, 7);
  for (const phase of playbook.plan) {
    assert.ok(phase.tasks.length > 0, `day ${phase.day} needs tasks`);
  }
  const brief = buildNicheBriefText(result, result.answers);
  assert.ok(brief.includes("glam-luxury-muse") || brief.includes(result.top.name));
});

test("answer helpers manage state and validation", () => {
  let state = initialAnswers();
  assert.strictEqual(isComplete(QUIZ_QUESTIONS[0], state), false);
  state = setAnswer(state, "motivation", "connection");
  assert.strictEqual(isComplete(QUIZ_QUESTIONS[0], state), true);
  state = setAnswer(state, "visualIdentity", ["luxury"]);
  state = setAnswer(state, "visualIdentity", ["luxury", "athletic"]);
  assert.deepStrictEqual(state.visualIdentity, ["luxury", "athletic"]);
  state = setAnswer(state, "visualIdentity", ["luxury", "athletic"]);
  assert.deepStrictEqual(state.visualIdentity, ["luxury", "athletic"]);
  state = setAnswer(state, "motivation", "not-a-real-value");
  assert.strictEqual(state.motivation, null);
  assert.strictEqual(areAllQuestionsComplete(QUIZ_QUESTIONS, state), false);
});

test("shared persona links resolve to the requested archetype", () => {
  const result = computeResultForArchetype("glam-luxury-muse");
  assert.strictEqual(result.top.id, "glam-luxury-muse");
  assert.ok(result.top.tagline.length > 0);
  assert.ok(result.fitScore > 0 && result.fitScore <= 100);
});

test("shared persona links with unknown ids resolve safely", () => {
  assert.strictEqual(computeResultForArchetype("not-a-real-archetype"), null);
});

test("all ten archetypes expose required presentation fields", () => {
  for (const id of [
    "soft-gfe",
    "glam-luxury-muse",
    "alt-goth",
    "fitness-fantasy",
    "cosplay",
    "dominant",
    "edu-coach",
    "cam",
    "anonymous-faceless",
    "couple",
  ]) {
    const archetype = ARCHETYPES[id];
    assert.ok(archetype.name, `${id} needs a name`);
    assert.ok(archetype.tagline, `${id} needs a tagline`);
    assert.ok(archetype.description, `${id} needs a description`);
    assert.ok(Array.isArray(archetype.strengths) && archetype.strengths.length === 3, `${id} needs three strengths`);
    assert.ok(archetype.identityStatement, `${id} needs an identity statement`);
    assert.ok(archetype.accent, `${id} needs an accent color`);
  }
});
