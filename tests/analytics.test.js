import { test } from "node:test";
import assert from "node:assert/strict";
import { getConsentState, setOptedIn, isOptedIn, track, getAnalyticsEndpoint, setAnalyticsEndpoint, trackScoringResult } from "../assets/analytics.js";

test("analytics is opted out by default and does not deliver events", () => {
  setOptedIn(false);
  assert.strictEqual(isOptedIn(), false);
  const result = track("quiz_started");
  assert.strictEqual(result.sent, false);
  assert.strictEqual(getConsentState(), false);
});

test("opt-in enables tracking and exposes the endpoint resolver", () => {
  setOptedIn(true);
  assert.strictEqual(isOptedIn(), true);
  const result = track("quiz_completed", { archetype: "soft-gfe", fitScore: 72 });
  assert.strictEqual(result.sent, true);
  assert.strictEqual(getAnalyticsEndpoint(), "");
  setOptedIn(false);
});

test("scoring result emits a scoring_completed event only when opted in", () => {
  setOptedIn(false);
  const optedOut = trackScoringResult({ top: { id: "cam" }, fitScore: 61 });
  assert.strictEqual(optedOut.sent, false);
  assert.strictEqual(optedOut.reason, "opted-out");
  setOptedIn(true);
  const result = trackScoringResult({ top: { id: "soft-gfe" }, fitScore: 72 });
  assert.strictEqual(result.sent, true);
  assert.strictEqual(result.event, "scoring_completed");
  setOptedIn(false);
});

test("setAnalyticsEndpoint configures the delivery target", () => {
  setAnalyticsEndpoint("https://example.com/webhook");
  assert.strictEqual(getAnalyticsEndpoint(), "https://example.com/webhook");
  setAnalyticsEndpoint("");
  assert.strictEqual(getAnalyticsEndpoint(), "");
});
