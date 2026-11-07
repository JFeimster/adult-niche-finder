/**
 * Interactive Lab toolkit: on-page creator tool generators.
 * Pure generators are exported for testability; initLab wires the DOM.
 */

import { ARCHETYPES, ARCHETYPE_IDS } from "./personas.js";
import { track } from "./analytics.js";

const TONES = ["confident", "warm", "elegant", "edgy", "mysterious", "playful"];

function shuffleNames(names, seed) {
  let s = seed % 233280;
  if (s <= 0) s += 1;
  const rnd = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  const arr = [...names];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rnd() * (i + 1));
    const tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
  }
  return arr;
}

export function buildBio(archetypeId, tone = "confident", audience = "") {
  const archetype = ARCHETYPES[archetypeId];
  if (!archetype) return "";
  const subject = archetype.name;
  const tagline = archetype.tagline;
  const baseBio = archetype.brand && archetype.brand.bio ? archetype.brand.bio : archetype.tagline;
  const audienceLine = audience ? `Created for ${audience}.` : `Built for the ${subject} lane.`;
  const toneLine = tone && tone !== "confident" ? `Voice: ${tone}.` : "";
  return `${subject} — ${tagline}. ${baseBio} ${audienceLine} ${toneLine}`.replace(/\s+/g, " ").trim();
}

export function generateNames(archetypeId) {
  const archetype = ARCHETYPES[archetypeId];
  if (!archetype) return { names: [], tagline: "", palette: [] };
  const names = shuffleNames(archetype.brand.names, archetypeId.length * 7 + 3);
  return { names, tagline: archetype.tagline, palette: archetype.brand.palette };
}

export function generatePillars(archetypeId, count = 2) {
  const archetype = ARCHETYPES[archetypeId];
  const strengths = archetype.strengths || [];
  const pillars = [];
  for (let i = 0; i < count; i += 1) {
    const strength = strengths[i % strengths.length] || archetype.name;
    const source = archetype.pillars && archetype.pillars[i % archetype.pillars.length];
    pillars.push({
      title: `${strength} ${["Stories", "Practice", "Series"][i] || "Series"}`,
      description: `A content line exploring ${strength.toLowerCase()} within the ${archetype.name} lane.`,
      ideas: source && source.ideas ? source.ideas.slice(0, 2) : [],
      format: source && source.format ? source.format : "Photography",
    });
  }
  return pillars;
}

export function buildProfileBlocks(archetypeId) {
  const archetype = ARCHETYPES[archetypeId];
  if (!archetype) return null;
  return {
    displayName: archetype.name,
    tagline: archetype.tagline,
    bio: archetype.brand ? archetype.brand.bio : archetype.tagline,
    audience: archetype.brand ? archetype.brand.audience : "",
    aesthetic: archetype.brand ? archetype.brand.aesthetic : "",
    accent: archetype.accent,
  };
}

export function generateCalendar(archetypeId, days = 30) {
  const archetype = ARCHETYPES[archetypeId];
  const pillars = archetype.pillars && archetype.pillars.length
    ? archetype.pillars
    : [{ title: archetype.name, description: archetype.tagline, ideas: [], format: "Photography" }];
  const calendar = [];
  for (let i = 1; i <= days; i += 1) {
    const pillarIndex = Math.floor((i - 1) / 7) % pillars.length;
    const pillar = pillars[pillarIndex];
    calendar.push({
      day: i,
      title: `Day ${i} — ${pillar.title}`,
      detail: `Develop: ${pillar.ideas[0] || pillar.description} (format: ${pillar.format}).`,
    });
  }
  return calendar;
}

export function generatePromptPack(archetypeId) {
  const archetype = ARCHETYPES[archetypeId];
  if (!archetype) return null;
  const strengths = archetype.strengths || [];
  return {
    archetypeId,
    archetypeName: archetype.name,
    bioPrompt: `Write a creator bio for the ${archetype.name} lane that captures "${archetype.tagline}" and speaks to ${archetype.brand ? archetype.brand.audience : "the intended audience"}.`,
    launchPrompt: `Draft a launch sequence for a ${archetype.name} creator, including persona statement, first content pillar, and boundary framing.`,
    contentPrompt: `Generate five content ideas for the ${archetype.name} lane, aligned with strengths such as ${strengths.join(", ")}.`,
    boundaryPrompt: `Draft a consent and boundary communication plan for the ${archetype.name} persona.`,
  };
}

export function generateReadinessChecklist(archetypeId) {
  const archetype = ARCHETYPES[archetypeId];
  if (!archetype) return [];
  return [
    { item: "Define identity and mission for the lane", detail: `Anchor to ${archetype.name}.` },
    { item: "Confirm hard boundaries and consent needs", detail: archetype.privacyLevel === "anonymous" ? "Privacy-first lane: prioritize controlled exposure." : "Confirm audience boundaries before creating." },
    { item: "Create brand direction", detail: `Tagline: ${archetype.tagline}.` },
    { item: "Develop first content pillars", detail: archetype.pillars && archetype.pillars.length ? `Pillars: ${archetype.pillars.map((p) => p.title).join(", ")}.` : "Select initial pillars." },
    { item: "Prepare profiles and privacy controls", detail: "Set pseudonymous or anonymous profiles before publishing." },
    { item: "Produce sample content", detail: "Run a first sample set aligned with the pillars." },
    { item: "Review platform fit and compliance", detail: "Verify eligibility and policies before launch." },
    { item: "Launch or refine", detail: "Publish the initial strategy or refine before launch." },
  ];
}

function downloadJson(filename, data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

export function generateLore(archetypeId) {
  const archetype = ARCHETYPES[archetypeId];
  if (!archetype) return null;
  const lore = `${archetype.name} began as a whisper in the dark between identities — a persona assembled from ${archetype.strengths ? archetype.strengths.join(", ").toLowerCase() : "craft"} and held together by ${archetype.tagline.toLowerCase()}. The lane speaks in ${archetype.brand ? archetype.brand.aesthetic : "shadow"}; the creator listens, and the audience answers.`;
  return { archetypeId, archetypeName: archetype.name, lore };
}

export function initLab() {
  const $ = (id) => document.getElementById(id);
  const archetypeSelectIds = [
    "lab-bio-archetype",
    "lab-names-archetype",
    "lab-pillars-archetype",
    "lab-profile-archetype",
    "lab-calendar-archetype",
    "lab-prompts-archetype",
  ];
  for (const id of archetypeSelectIds) {
    const select = $(id);
    if (!select) continue;
    for (const archetypeId of ARCHETYPE_IDS) {
      const option = document.createElement("option");
      option.value = archetypeId;
      option.textContent = ARCHETYPES[archetypeId].name;
      select.appendChild(option);
    }
  }

  $("lab-bio-generate")?.addEventListener("click", () => {
    const archetypeId = $("lab-bio-archetype")?.value || ARCHETYPE_IDS[0];
    const tone = $("lab-bio-tone")?.value || "confident";
    const audience = $("lab-bio-audience")?.value || "";
    const output = $("lab-bio-output");
    if (!output) return;
    track("lab_tool_used", { tool: "bio_builder" });
    output.textContent = buildBio(archetypeId, tone, audience);
  });

  $("lab-names-generate")?.addEventListener("click", () => {
    const archetypeId = $("lab-names-archetype")?.value;
    const output = $("lab-names-output");
    const generated = generateNames(archetypeId);
    if (!output) return;
    track("lab_tool_used", { tool: "brand_name_generator" });
    output.innerHTML = generated.names.map((n) => `<div class="name-card"><h5>${n}</h5><p>${generated.tagline}</p></div>`).join("");
  });

  $("lab-pillars-generate")?.addEventListener("click", () => {
    const archetypeId = $("lab-pillars-archetype")?.value;
    const count = Number($("lab-pillars-count")?.value) || 2;
    const output = $("lab-pillars-output");
    if (!output) return;
    const pillars = generatePillars(archetypeId, count);
    track("lab_tool_used", { tool: "content_pillar_generator", count });
    output.innerHTML = pillars.map((p) => `<div class="pillar-card"><h5>${p.title}</h5><p>${p.description}</p><p class="pillar-meta">Format: ${p.format}</p></div>`).join("");
  });

  $("lab-profile-generate")?.addEventListener("click", () => {
    const archetypeId = $("lab-profile-archetype")?.value;
    const output = $("lab-profile-output");
    const blocks = buildProfileBlocks(archetypeId);
    if (!output || !blocks) return;
    track("lab_tool_used", { tool: "profile_optimizer" });
    output.innerHTML = `
      <div class="name-card"><h5>Display name</h5><p>${blocks.displayName}</p></div>
      <div class="name-card"><h5>Tagline</h5><p>${blocks.tagline}</p></div>
      <div class="name-card"><h5>Bio</h5><p>${blocks.bio}</p></div>
      <div class="name-card"><h5>Audience</h5><p>${blocks.audience}</p></div>
      <div class="name-card"><h5>Aesthetic</h5><p>${blocks.aesthetic}</p></div>
    `;
  });

  $("lab-calendar-generate")?.addEventListener("click", () => {
    const archetypeId = $("lab-calendar-archetype")?.value;
    const output = $("lab-calendar-output");
    if (!output) return;
    const days = generateCalendar(archetypeId, 30);
    track("lab_tool_used", { tool: "content_calendar_builder" });
    output.innerHTML = days.map((d) => `<div class="plan-day"><span class="day-num">DAY ${d.day}</span><h5>${d.title}</h5><p>${d.detail}</p></div>`).join("");
  });

  $("lab-calendar-export")?.addEventListener("click", () => {
    const archetypeId = $("lab-calendar-archetype")?.value;
    track("lab_tool_used", { tool: "content_calendar_export" });
    downloadJson(`creator-calendar-${archetypeId || "archetype"}.json`, { archetypeId, generatedAt: Date.now(), days: generateCalendar(archetypeId, 30) });
  });

  $("lab-prompts-generate")?.addEventListener("click", () => {
    const archetypeId = $("lab-prompts-archetype")?.value;
    const output = $("lab-prompts-output");
    const pack = generatePromptPack(archetypeId);
    if (!output || !pack) return;
    track("lab_tool_used", { tool: "prompt_pack_builder" });
    output.innerHTML = `
      <h5>${pack.archetypeName} — Prompt Pack</h5>
      <p><strong>Bio prompt:</strong> ${pack.bioPrompt}</p>
      <p><strong>Launch prompt:</strong> ${pack.launchPrompt}</p>
      <p><strong>Content prompt:</strong> ${pack.contentPrompt}</p>
      <p><strong>Boundary prompt:</strong> ${pack.boundaryPrompt}</p>
    `;
  });

  $("lab-readiness-generate")?.addEventListener("click", () => {
    const archetypeId = $("lab-readiness-archetype")?.value;
    const output = $("lab-readiness-output");
    const checklist = generateReadinessChecklist(archetypeId);
    if (!output) return;
    track("lab_tool_used", { tool: "readiness_tracker" });
    output.innerHTML = checklist
      .map((c) => `<div class="pillar-card"><h5>${c.item}</h5><p>${c.detail}</p></div>`)
      .join("");
  });

  $("lab-lore-generate")?.addEventListener("click", () => {
    const archetypeId = $("lab-lore-archetype")?.value;
    const output = $("lab-lore-output");
    const lore = generateLore(archetypeId);
    if (!output || !lore) return;
    track("lab_tool_used", { tool: "persona_lore_writer" });
    output.innerHTML = `<h5>${lore.archetypeName} — Lore</h5><p>${lore.lore}</p>`;
  });
}

export { ARCHETYPE_IDS, TONES };
