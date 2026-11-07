/**
 * Privacy checklist content and pure helpers.
 * No answers are persisted or transmitted - only in-memory UI state.
 */

export const CHECKLIST_ITEMS = [
  {
    id: "separate-accounts",
    title: "Separate creator and personal accounts",
    detail: "Keep personal presence out of the creator brand entirely.",
  },
  {
    id: "strong-passwords",
    title: "Strong passwords and MFA",
    detail: "Use unique, high-entropy passwords with multifactor authentication.",
  },
  {
    id: "location-metadata",
    title: "Location metadata and geotag review",
    detail: "Strip precise location data from photos, check-ins, and bios.",
  },
  {
    id: "pseudonymous-branding",
    title: "Pseudonymous branding",
    detail: "Use a consistent alternate identity across platforms.",
  },
  {
    id: "audience-boundaries",
    title: "Audience interaction boundaries",
    detail: "Set limits on messaging, requests, and personal disclosures.",
  },
  {
    id: "platform-privacy",
    title: "Platform privacy settings",
    detail: "Review each platform's visibility, blocking, and reporting controls.",
  },
  {
    id: "legal-consent",
    title: "Legal consent and age verification",
    detail: "Ensure all participants are consenting adults, verified appropriately.",
  },
  {
    id: "redistribution-risk",
    title: "Risks of permanent redistribution",
    detail: "Understand that published content can be copied, reposted, or lost.",
  },
  {
    id: "platform-policies",
    title: "Platform policies and applicable laws",
    detail: "Verify current eligibility, age verification, and content rules.",
  },
];

export function buildChecklistText(selectedIds) {
  const lines = ["BEFORE YOU BUILD AN AUDIENCE, PROTECT YOURSELF.", ""];
  const chosen = CHECKLIST_ITEMS.filter(
    (item) => Array.isArray(selectedIds) ? selectedIds.includes(item.id) : true,
  );
  if (chosen.length) {
    lines.push("SELF-PROTECTION CHECKLIST");
    for (const item of chosen) {
      lines.push(`- ${item.title}: ${item.detail}`);
    }
  } else {
    lines.push("SELF-PROTECTION CHECKLIST");
    for (const item of CHECKLIST_ITEMS) {
      lines.push(`- ${item.title}: ${item.detail}`);
    }
  }
  lines.push("");
  lines.push("This checklist is stored locally in your browser only when you choose to save results.");
  return lines.join("\n");
}
