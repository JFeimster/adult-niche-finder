/**
 * Result rendering, personalized playbook generation, and copy/download helpers.
 */

import { ARCHETYPES, PLATFORMS } from "./personas.js";
import { generateNicheBrief } from "./scoring.js";

const PROFILES_KEY = "adult-niche-finder:profiles";
const MAX_PROFILES = 20;

function readProfiles() {
  try {
    if (typeof localStorage === "undefined") return [];
    const raw = localStorage.getItem(PROFILES_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((p) => p && typeof p.archetypeId === "string");
  } catch (err) {
    return [];
  }
}

function writeProfiles(list) {
  try {
    if (typeof localStorage !== "undefined") localStorage.setItem(PROFILES_KEY, JSON.stringify(list));
  } catch (err) {
    // storage unavailable - keep in-memory behavior only
  }
}

export function listProfiles() {
  return readProfiles();
}

export function saveProfile(result) {
  const top = result && result.top;
  const profile = {
    id: `${top.id}-${Date.now()}`,
    archetypeId: top ? top.id : null,
    archetypeName: top ? top.name : "Unknown lane",
    tagline: top ? top.tagline : "",
    identityStatement: top ? top.identityStatement : "",
    fitScore: result && Number.isFinite(result.fitScore) ? result.fitScore : null,
    anonymityBound: !!(result && result.anonymityBound),
    savedAt: new Date().toISOString(),
  };
  const list = [profile, ...readProfiles()].slice(0, MAX_PROFILES);
  writeProfiles(list);
  return { ok: true, profiles: list };
}

export function deleteProfile(id) {
  const list = readProfiles().filter((p) => p.id !== id);
  writeProfiles(list);
  return list;
}

export function clearProfiles() {
  try {
    if (typeof localStorage !== "undefined") localStorage.removeItem(PROFILES_KEY);
  } catch (err) {
    // ignore
  }
  return [];
}

export function archetypeInitials(archetype) {
  const words = archetype.name.replace(/^(The\s+)?/i, "").split(/\s+/);
  const initials = words
    .filter((w) => /^[A-Z]/.test(w))
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return initials || "PC";
}

export function formatFitScore(fitScore) {
  return `${fitScore} / 100`;
}

export function generatePlaybook(result) {
  const top = result.top;
  const boundaries = result.answers && Array.isArray(result.answers.boundaries)
    ? result.answers.boundaries
    : [];
  const noLive = result.noLive;
  const anonymityBound = result.anonymityBound;
  const collabOpen = result.collabOpen;

  const pillars = (top.pillars || []).map((pillar) => ({
    ...pillar,
    ideas: [...(pillar.ideas || [])],
  }));

  const platforms = (top.platforms || PLATFORMS).map((p) => ({ ...p }));

  const plan = [
    {
      day: 1,
      title: "Define identity and boundaries",
      tasks: [
        "Write your creator mission in one sentence.",
        "Confirm your hard boundaries and comfort levels.",
      ],
    },
    {
      day: 2,
      title: "Create brand direction",
      tasks: [
        `Lock the brand direction: ${top.brand.personality}.`,
        `Choose a tagline such as "${top.brand.tagline}".`,
      ],
    },
    {
      day: 3,
      title: "Prepare profiles and privacy controls",
      tasks: [
        "Set up pseudonymous or anonymous profiles.",
        "Apply platform privacy controls and metadata hygiene.",
      ],
    },
    {
      day: 4,
      title: "Develop initial content ideas",
      tasks: ["Draft content pillars and first concepts."],
    },
    {
      day: 5,
      title: "Produce sample content",
      tasks:
        top.liveRecommended && !noLive
          ? ["Produce first sample content in the recommended formats.", "Run a private test session."]
          : ["Produce first sample content in the recommended formats."],
    },
    {
      day: 6,
      title: "Review platform fit and compliance",
      tasks: [
        "Verify current platform eligibility, age verification, and policies.",
        "Confirm content formats respect stated boundaries.",
      ],
    },
    {
      day: 7,
      title: "Launch or refine the initial strategy",
      tasks: collabOpen
        ? ["Plan a consensual collaboration structure before launch."]
        : ["Plan a solo launch approach or refine before launching."],
    },
  ];

  const filteredPillars = noLive
    ? pillars.filter((p) => !/live/i.test(`${p.title} ${p.format}`))
    : pillars;

  const filteredPlan = noLive
    ? plan.map((phase) => ({
        ...phase,
        tasks: phase.tasks.filter((t) => !/live|session/i.test(t)),
      }))
    : plan;

  const palette = top.brand.palette || ["#9855FF", "#F8F5FF", "#151021", "#FFEC70"];

  return {
    archetypeId: top.id,
    archetypeName: top.name,
    brand: { ...top.brand },
    pillars: filteredPillars.length ? filteredPillars : pillars,
    platforms,
    plan: filteredPlan,
    privacyLevel: top.privacyLevel,
    noLive,
    collabOpen,
    anonymityBound,
    palette,
  };
}

export function buildNicheBriefText(result, answers) {
  const playbook = generatePlaybook(result);
  const brief = generateNicheBrief(result, answers);
  const lines = [brief, "", "PERSONALIZED PLAYBOOK", ""];
  lines.push(`Brand names: ${playbook.brand.names.join(", ")}`);
  lines.push(`Tagline: ${playbook.brand.tagline}`);
  lines.push(`Aesthetic: ${playbook.brand.aesthetic}`);
  lines.push("");
  lines.push("CONTENT PILLARS");
  for (const pillar of playbook.pillars) {
    lines.push(`- ${pillar.title}: ${pillar.description} | Examples: ${pillar.ideas.join(" / ")} | Format: ${pillar.format}`);
  }
  lines.push("");
  lines.push("SEVEN-DAY ACTION PLAN");
  for (const phase of playbook.plan) {
    lines.push(`Day ${phase.day} (${phase.title}): ${phase.tasks.join(" | ")}`);
  }
  return lines.join("\n");
}

export function downloadPlaybook(result) {
  const text = buildNicheBriefText(result, result.answers);
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `creator-playbook-${result.top.id}.txt`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

export async function copyTextToClipboard(text) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return { ok: true, method: "clipboard-api" };
    }
  } catch (err) {
    // fall through to legacy path
  }
  try {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(textarea);
    if (ok) return { ok: true, method: "exec-command" };
  } catch (err) {
    // ignore
  }
  return { ok: false, method: null };
}

export async function sharePublicSummary(result) {
  const top = result.top;
  const url = new URL(window.location.href);
  url.searchParams.set("persona", top.id);
  const publicSummary = {
    title: "My Creator Identity",
    text: `I just discovered my creator lane: ${top.name}. ${top.tagline}`,
    url: url.toString(),
  };
  if (navigator.share) {
    try {
      await navigator.share(publicSummary);
      return { ok: true, method: "web-share" };
    } catch (err) {
      if (err && err.name === "AbortError") return { ok: false, method: "cancelled" };
      // fall through to clipboard fallback
    }
  }
  const fallback = await copyTextToClipboard(`${top.name} — ${top.tagline}`);
  return { ok: fallback.ok, method: fallback.ok ? "clipboard" : null };
}
