import { test } from "node:test";
import assert from "node:assert/strict";
import { isValidEmail, saveLaneLetterEmail, hasLaneLetterSignup, clearLaneLetterSignups } from "../assets/newsletter.js";

test("email validation accepts well-formed addresses and rejects junk", () => {
  assert.strictEqual(isValidEmail("creator@example.com"), true);
  assert.strictEqual(isValidEmail("  spaced@example.co.uk "), true);
  assert.strictEqual(isValidEmail(""), false);
  assert.strictEqual(isValidEmail("not-an-email"), false);
  assert.strictEqual(isValidEmail("missing@tld"), false);
});

test("lane letter signup saves, detects, and clears locally", () => {
  assert.strictEqual(hasLaneLetterSignup(), false);
  const saved = saveLaneLetterEmail("  Writer@example.com ", "lane-letter");
  assert.strictEqual(saved.ok, true);
  assert.strictEqual(saved.email, "writer@example.com");
  assert.strictEqual(hasLaneLetterSignup(), true);
  clearLaneLetterSignups();
  assert.strictEqual(hasLaneLetterSignup(), false);
});
