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

const SOCIAL_TEMPLATES = [
  {
    id: "launch",
    label: "Lane launch",
    make: (a) => `${a.name} — ${a.tagline} In the ${a.name} lane, we lead with ${a.strengths && a.strengths[0] ? a.strengths[0].toLowerCase() : "presence"}. First pillar drops this week.`,
  },
  {
    id: "ritual",
    label: "Weekly ritual",
    make: (a) => `My ${a.name} ritual: one ${a.pillars && a.pillars[0] ? a.pillars[0].format.toLowerCase() : "daily"} post, one honest note, zero noise. ${a.tagline}`,
  },
  {
    id: "invitation",
    label: "Curious invite",
    make: (a) => `Curious about the ${a.name} lane? I share the behind-the-lane notes here — boundaries first, always. ${a.tagline}`,
  },
];

export function generateSocialPosts(archetypeId, tone = "confident", platform = "x") {
  const archetype = ARCHETYPES[archetypeId];
  if (!archetype) return [];
  const tonePrefix = tone && tone !== "confident" ? `[${tone}] ` : "";
  const platformSuffix = platform === "instagram" ? "  📸" : platform === "tiktok" ? "  #creator" : "";
  return SOCIAL_TEMPLATES.map((t) => ({
    id: t.id,
    label: t.label,
    text: `${tonePrefix}${t.make(archetype)}${platformSuffix}`.trim(),
  }));
}

export function buildShareCardSVG(archetypeId) {
  const archetype = ARCHETYPES[archetypeId];
  if (!archetype) return "";
  const name = archetype.name;
  const tagline = archetype.tagline;
  const accent = archetype.accent || "#FF2B91";
  const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1080" viewBox="0 0 1080 1080">
<rect width="1080" height="1080" fill="#09070F"/>
<circle cx="540" cy="380" r="220" fill="none" stroke="${esc(accent)}" stroke-width="6" opacity="0.9"/>
<circle cx="540" cy="380" r="130" fill="${esc(accent)}" opacity="0.85"/>
<text x="540" y="690" text-anchor="middle" fill="#F8F5FF" font-family="Arial, sans-serif" font-size="72" font-weight="800">${esc(name)}</text>
<text x="540" y="770" text-anchor="middle" fill="#AAA4BB" font-family="Arial, sans-serif" font-size="36">${esc(tagline)}</text>
<text x="540" y="980" text-anchor="middle" fill="${esc(accent)}" font-family="Arial, sans-serif" font-size="28" font-weight="700">FIND YOUR CREATOR LANE</text>
</svg>`;
}

function downloadText(filename, text) {
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

function downloadSvg(filename, svg) {
  const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

export function generateComplianceChecklist({ platform = "", contentType = "standard", boundary = "none" } = {}) {
  const normalizedPlatform = String(platform || "").trim().toLowerCase();
  const items = [];
  items.push({ item: "Verify 18+ eligibility and platform age gate", detail: "Confirm you meet the platform's age requirement and complete its age-verification step before publishing." });
  items.push({ item: "Check current Terms of Service for your content type", detail: normalizedPlatform ? `Review ${normalizedPlatform} Terms for ${contentType} content.` : `Review the platform Terms for ${contentType} content.` });
  if (boundary === "anonymous" || boundary === "pseudonymous") {
    items.push({ item: "Confirm pseudonymous/anonymous controls are enabled", detail: "Anonymous/pseudonymous lane: use a separate creator email, handle hygiene, and disable location metadata." });
  } else {
    items.push({ item: "Set privacy controls for your chosen exposure level", detail: "Use platform privacy settings and metadata hygiene before launch." });
  }
  items.push({ item: "Confirm consent for any collaborated or tagged parties", detail: "Get explicit consent from everyone appearing in or tagged in your content." });
  if (contentType === "live") {
    items.push({ item: "Review live-stream moderation and no-go topics", detail: "Set stream delays, mod tools, and hard boundaries before your first live session." });
  }
  items.push({ item: "Record a compliance snapshot before launch", detail: "Screenshot/save the policy version you reviewed (date-stamped) for your files." });
  return { platform: normalizedPlatform || "general", contentType, boundary, items };
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
    "lab-social-archetype",
    "lab-compliance-archetype",
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

  $("lab-social-generate")?.addEventListener("click", () => {
    const archetypeId = $("lab-social-archetype")?.value;
    const tone = $("lab-social-tone")?.value || "confident";
    const platform = $("lab-social-platform")?.value || "x";
    const output = $("lab-social-output");
    const posts = generateSocialPosts(archetypeId, tone, platform);
    if (!output || !posts.length) return;
    track("lab_tool_used", { tool: "social_post_generator" });
    output.innerHTML = posts
      .map((p) => `<div class="pillar-card"><h5>${p.label}</h5><p>${p.text}</p></div>`)
      .join("");
  });

  $("lab-social-copy")?.addEventListener("click", async () => {
    const archetypeId = $("lab-social-archetype")?.value;
    const tone = $("lab-social-tone")?.value || "confident";
    const platform = $("lab-social-platform")?.value || "x";
    const posts = generateSocialPosts(archetypeId, tone, platform);
    const text = posts.map((p) => `[${p.label}] ${p.text}`).join("\n\n");
    try {
      await navigator.clipboard.writeText(text);
      const status = $("lab-social-status");
      if (status) {
        status.textContent = "Social posts copied to clipboard.";
        status.hidden = false;
        status.style.color = "#00d9ff";
      }
    } catch {
      const status = $("lab-social-status");
      if (status) {
        status.textContent = "Copy failed — select the posts and copy manually.";
        status.hidden = false;
        status.style.color = "#ff6b6b";
      }
    }
    track("lab_tool_used", { tool: "social_post_copy" });
  });

  $("lab-social-download")?.addEventListener("click", () => {
    const archetypeId = $("lab-social-archetype")?.value;
    const tone = $("lab-social-tone")?.value || "confident";
    const platform = $("lab-social-platform")?.value || "x";
    const posts = generateSocialPosts(archetypeId, tone, platform);
    const header = `SOCIAL POSTS — ${archetypeId} (${tone}, ${platform})\n\n`;
    const body = posts.map((p) => `[${p.label}]\n${p.text}`).join("\n\n");
    downloadText(`social-posts-${archetypeId || "lane"}.txt`, header + body);
    track("lab_tool_used", { tool: "social_post_download" });
  });

  $("lab-sharecard-download")?.addEventListener("click", () => {
    const archetypeId = $("lab-social-archetype")?.value;
    const svg = buildShareCardSVG(archetypeId);
    if (!svg) return;
    downloadSvg(`share-card-${archetypeId || "lane"}.svg`, svg);
    track("lab_tool_used", { tool: "share_card_download" });
  });

  $("lab-compliance-generate")?.addEventListener("click", () => {
    const platform = $("lab-compliance-platform")?.value || "";
    const contentType = $("lab-compliance-type")?.value || "standard";
    const boundary = $("lab-compliance-boundary")?.value || "none";
    const output = $("lab-compliance-output");
    const result = generateComplianceChecklist({ platform, contentType, boundary });
    if (!output) return;
    track("lab_tool_used", { tool: "compliance_checker" });
    const heading = result.platform !== "general" ? `Platform: ${result.platform} · Type: ${result.contentType}` : `General · Type: ${result.contentType}`;
    output.innerHTML = `<h5>${heading}</h5>` + result.items
      .map((c) => `<div class="pillar-card"><h5>${c.item}</h5><p>${c.detail}</p></div>`)
      .join("");
  });
}

export { ARCHETYPE_IDS, TONES };
