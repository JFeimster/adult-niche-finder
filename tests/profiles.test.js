import { test } from "node:test";
import assert from "node:assert/strict";
import { listProfiles, saveProfile, deleteProfile, clearProfiles } from "../assets/results.js";

test("saved profiles list starts empty when storage is unavailable", () => {
  assert.deepStrictEqual(listProfiles(), []);
});

test("saveProfile stores the computed lane as a saved profile", () => {
  const saved = saveProfile({
    top: {
      id: "soft-gfe",
      name: "The Soft GFE Creator",
      tagline: "Warmth, delivered with intention.",
      identityStatement: "I lead with warmth.",
    },
    fitScore: 72,
  });
  assert.strictEqual(saved.ok, true);
  const list = listProfiles();
  assert.strictEqual(list.length, 1);
  assert.strictEqual(list[0].archetypeId, "soft-gfe");
  assert.strictEqual(list[0].fitScore, 72);
  assert.strictEqual(typeof list[0].savedAt, "string");
  clearProfiles();
});

test("deleteProfile removes a single saved lane", () => {
  saveProfile({ top: { id: "cam", name: "The Cam Creator", tagline: "Commanding, consensual." }, fitScore: 61 });
  const list = listProfiles();
  const target = list[0];
  const updated = deleteProfile(target.id);
  assert.strictEqual(updated.length, 0);
  clearProfiles();
});

test("clearProfiles empties the saved lanes list", () => {
  saveProfile({ top: { id: "couple", name: "The Couple Lane", tagline: "Us, as a lane." }, fitScore: 55 });
  assert.strictEqual(listProfiles().length, 1);
  clearProfiles();
  assert.deepStrictEqual(listProfiles(), []);
});
