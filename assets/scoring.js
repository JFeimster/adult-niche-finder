/**
 * Deterministic weighted scoring engine for the creator persona quiz.
 * Pure functions - no DOM access, safe to import from Node-based tests.
 */

import { QUIZ_QUESTIONS, FOLLOW_UP_QUESTIONS, ARCHETYPE_IDS } from "./quiz-data.js";
import { ARCHETYPES, PLATFORMS } from "./personas.js";

export const ANONYMITY_BOUNDARY_VALUES = ["privacy", "publicVisibility"];

export function initialAnswers() {
  return {};
}

export function setAnswer(answers, questionId, value) {
  const question = QUIZ_QUESTIONS.find((q) => q.id === questionId);
  if (!question) return { ...answers };

  const values = Array.isArray(value) ? value : [value];
  const validValues = new Set(question.options.map((o) => o.value));
  const clean = values.filter((v) => validValues.has(v));

  const next = { ...answers };
  if (question.type === "multi") {
    const current = Array.isArray(next[questionId]) ? next[questionId] : [];
    const merged = Array.from(new Set([...current, ...clean]));
    next[questionId] = merged;
  } else {
    next[questionId] = clean.length ? clean[0] : null;
  }
  return next;
}

export function isComplete(question, answers) {
  const value = answers[question.id];
  if (question.type === "multi") {
    const min = question.minSelected ?? 1;
    const values = Array.isArray(value) ? value : [];
    return values.length >= min;
  }
  if (question.type === "single") {
    return typeof value === "string" && value.length > 0;
  }
  return false;
}

export function areAllQuestionsComplete(questions, answers) {
  return questions.every((q) => isComplete(q, answers));
}

function computeScores(answers) {
  const scores = {};
  for (const id of ARCHETYPE_IDS) scores[id] = 0;

  for (const question of [...QUIZ_QUESTIONS, ...FOLLOW_UP_QUESTIONS]) {
    const value = answers[question.id];
    const values =
      question.type === "multi"
        ? Array.isArray(value)
          ? value
          : []
        : value
          ? [value]
          : [];

    for (const optionValue of values) {
      const option = question.options.find((o) => o.value === optionValue);
      if (!option) continue;
      const weightMap = option.archetypes || {};
      for (const [archetypeId, weight] of Object.entries(weightMap)) {
        if (Number.isFinite(weight)) {
          scores[archetypeId] = (scores[archetypeId] || 0) + weight;
        }
      }
    }
  }

  return scores;
}

function buildReasons(topArchetype, anonymityBound, noLive) {
  const reasons = [
    `The engine matched a ${topArchetype.name} pattern to your answers.`,
  ];
  for (const strength of topArchetype.strengths) {
    reasons.push(`Your responses reflect: ${strength.toLowerCase()}.`);
  }
  if (anonymityBound) {
    reasons.push(
      "Your privacy boundary acted as a binding constraint, so the strategy keeps your exposure controlled.",
    );
  }
  if (noLive) {
    reasons.push(
      "You declined live interaction, so the strategy avoids live-only content formats.",
    );
  }
  return reasons;
}

export function computeResult(answers) {
  const safeAnswers = answers || {};
  const scores = computeScores(safeAnswers);

  const cameraComfort = safeAnswers.cameraComfort;
  const boundaries = Array.isArray(safeAnswers.boundaries) ? safeAnswers.boundaries : [];
  const anonymityBound =
    cameraComfort === "anonymous" ||
    boundaries.some((b) => ANONYMITY_BOUNDARY_VALUES.includes(b));
  const noLive = boundaries.includes("liveInteraction");
  const collabOpen = safeAnswers.collaboration === "collab";

  // A binding privacy preference can shape the persona even when another
  // archetype scored higher on pure preferences.
  const effectiveScores = { ...scores };
  if (anonymityBound) {
    effectiveScores["anonymous-faceless"] = (effectiveScores["anonymous-faceless"] || 0) + 8;
  }

  const ranked = ARCHETYPE_IDS.map((id) => ({
    id,
    score: effectiveScores[id] ?? 0,
  }))
    .filter((entry) => Number.isFinite(entry.score))
    .filter((entry) => {
      const archetype = ARCHETYPES[entry.id];
      // Hard personal boundaries: never recommend live-only strategies
      // when the user declined live interaction.
      if (entry.id === "cam" && noLive) return false;
      if (entry.id === "dominant" && noLive) return false;
      // Collaboration branding requires explicit, affirmative interest.
      if (entry.id === "couple" && !collabOpen) return false;
      return true;
    })
    .sort((a, b) => b.score - a.score || ARCHETYPE_IDS.indexOf(a.id) - ARCHETYPE_IDS.indexOf(b.id));

  const topEntry = ranked[0];
  const topArchetype = ARCHETYPES[topEntry.id];
  const top = { ...topEntry, ...topArchetype };

  const alternatives = ranked
    .slice(1, 3)
    .map((entry) => ({ ...entry, ...ARCHETYPES[entry.id] }));

  const fitScore = top.score > 0
    ? Math.max(5, Math.min(98, Math.round((top.score / 10) * 100)))
    : 5;

  const privacyShaped =
    anonymityBound && topArchetype.id !== "anonymous-faceless";

  return {
    top,
    alternatives,
    fitScore,
    scores,
    effectiveScores,
    anonymityBound,
    noLive,
    collabOpen,
    privacyShaped,
    reasons: buildReasons(topArchetype, anonymityBound, noLive),
    answers: safeAnswers,
  };
}

export function computeResultForArchetype(archetypeId) {
  const archetype = ARCHETYPES[archetypeId];
  if (!archetype) return null;

  const alternatives = ARCHETYPE_IDS.filter((id) => id !== archetypeId)
    .slice(0, 2)
    .map((id) => ({ id, score: 0, ...ARCHETYPES[id] }));

  const anonymityBound = archetype.privacyLevel === "anonymous";

  return {
    top: { ...archetype, id: archetypeId, score: 8 },
    alternatives,
    fitScore: 80,
    scores: { [archetypeId]: 8 },
    effectiveScores: { [archetypeId]: 8 },
    anonymityBound,
    noLive: false,
    collabOpen: archetype.collabEligible !== false,
    privacyShaped: false,
    reasons: [
      `The ${archetypeId} lane was revealed directly through a shared persona link.`,
    ],
    answers: {},
  };
}

export function generateNicheBrief(result, answers) {
  const top = result.top;
  const lines = [];
  lines.push("YOUR CREATOR IDENTITY HAS BEEN REVEALED");
  lines.push(`Archetype: ${top.name}`);
  lines.push(`Exploratory fit estimate: ${result.fitScore} / 100`);
  lines.push("");
  lines.push(top.description);
  lines.push("");
  lines.push("WHY THIS LANE");
  for (const reason of result.reasons) lines.push(`- ${reason}`);
  lines.push("");
  lines.push("PERSONALITY STRENGTHS");
  for (const strength of top.strengths) lines.push(`- ${strength}`);
  lines.push("");
  lines.push(`IDENTITY STATEMENT: ${top.identityStatement}`);
  lines.push("");
  lines.push("BRAND DIRECTION");
  lines.push(`Names: ${top.brand.names.join(", ")}`);
  lines.push(`Tagline: ${top.brand.tagline}`);
  lines.push(`Personality: ${top.brand.personality}`);
  lines.push(`Palette: ${top.brand.palette.join(", ")}`);
  lines.push(`Aesthetic: ${top.brand.aesthetic}`);
  lines.push(`Audience: ${top.brand.audience}`);
  lines.push(`Bio: ${top.brand.bio}`);
  lines.push("");
  lines.push("CONTENT PILLARS");
  for (const pillar of top.pillars) {
    lines.push(`- ${pillar.title}: ${pillar.description}`);
    lines.push(`  Examples: ${pillar.ideas.join(" / ")}`);
    lines.push(`  Format: ${pillar.format}`);
  }
  lines.push("");
  lines.push("PLATFORM FIT");
  const platforms = top.platforms || PLATFORMS;
  for (const platform of platforms) {
    lines.push(`- ${platform.category} (${platform.example}): ${platform.why}`);
  }
  lines.push("");
  lines.push("DISCLAIMER");
  lines.push("Match scores are exploratory heuristic estimates, not scientific measurements or predictions of financial success.");
  return lines.join("\n");
}
