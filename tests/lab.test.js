import { test } from "node:test";
import assert from "node:assert/strict";
import { generateSocialPosts, buildShareCardSVG, generateComplianceChecklist } from "../assets/lab.js";

test("generateSocialPosts returns three non-empty posts for a valid archetype", () => {
  const posts = generateSocialPosts("soft-gfe", "warm", "instagram");
  assert.strictEqual(posts.length, 3);
  for (const p of posts) {
    assert.strictEqual(typeof p.text, "string");
    assert.strictEqual(p.text.length > 0, true);
  }
  assert.strictEqual(posts[0].label, "Lane launch");
});

test("generateSocialPosts returns empty for unknown archetype", () => {
  assert.deepStrictEqual(generateSocialPosts("does-not-exist"), []);
});

test("buildShareCardSVG produces an svg with archetype name and tagline", () => {
  const svg = buildShareCardSVG("cam");
  assert.strictEqual(svg.includes("<svg"), true);
  assert.strictEqual(svg.includes("Cam Personality") || svg.includes("cam"), true);
  assert.strictEqual(svg.endsWith("</svg>"), true);
});

test("buildShareCardSVG returns empty for unknown archetype", () => {
  assert.strictEqual(buildShareCardSVG("nope"), "");
});

test("generateComplianceChecklist includes age-gate item and boundary-specific item", () => {
  const result = generateComplianceChecklist({ platform: "fansly", contentType: "live", boundary: "anonymous" });
  assert.strictEqual(result.platform, "fansly");
  assert.strictEqual(result.items.length >= 5, true);
  assert.strictEqual(result.items.some((i) => /age/i.test(i.item)), true);
  assert.strictEqual(result.items.some((i) => /pseudonymous|anonymous/i.test(i.detail)), true);
  assert.strictEqual(result.items.some((i) => /live/i.test(i.item.toLowerCase())), true);
});
