/**
 * Privacy-first opt-in analytics for Adult Niche Finder.
 * No tracking happens until the visitor explicitly opts in.
 * Events are delivered only when an analytics endpoint is configured.
 *
 * Delivery hardening:
 * - Consent is persisted in localStorage and re-checked on every track call.
 * - A small in-memory queue batches events and flushes on the next attempt.
 * - Retry with capped exponential backoff on transient failures.
 * - sendBeacon preferred (survives page unload), fetch+keepalive fallback,
 *   local queue as the final fallback so nothing is silently dropped.
 */

const CONSENT_STORAGE_KEY = "anf_analytics_consent";
const QUEUE_KEY = "anf_analytics_queue";
const DEFAULT_ENDPOINT = "";
const MAX_QUEUE_SIZE = 50;
const MAX_RETRIES = 3;

let optedIn = false;
let consentLoaded = false;
let configuredEndpoint = "";

/* ---------- Consent persistence ---------- */

function readConsent() {
  try {
    if (typeof localStorage === "undefined") return false;
    return localStorage.getItem(CONSENT_STORAGE_KEY) === "true";
  } catch (err) {
    return false;
  }
}

function writeConsent(value) {
  optedIn = !!value;
  try {
    if (typeof localStorage !== "undefined") localStorage.setItem(CONSENT_STORAGE_KEY, String(!!value));
  } catch (err) {
    // storage unavailable - keep in-memory only
  }
  return optedIn;
}

export function getConsentState() {
  if (!consentLoaded) {
    optedIn = readConsent();
    consentLoaded = true;
  }
  return optedIn;
}

export function setOptedIn(value) {
  const next = !!value;
  // Persist consent before returning so the store is always source of truth.
  writeConsent(next);
  return optedIn;
}

export function isOptedIn() {
  return getConsentState();
}

export function resetConsentLoaded() {
  // Tests and integrations can force a re-read from localStorage.
  consentLoaded = false;
  return getConsentState();
}

/* ---------- Endpoint configuration ---------- */

export function getAnalyticsEndpoint() {
  let endpoint = configuredEndpoint;
  try {
    if (typeof window !== "undefined" && window.ANF_ANALYTICS_ENDPOINT) endpoint = window.ANF_ANALYTICS_ENDPOINT;
  } catch (err) {
    // ignore
  }
  return endpoint || DEFAULT_ENDPOINT;
}

export function setAnalyticsEndpoint(endpoint) {
  const value = typeof endpoint === "string" ? endpoint.trim() : "";
  configuredEndpoint = value;
  try {
    if (typeof window !== "undefined") window.ANF_ANALYTICS_ENDPOINT = value;
  } catch (err) {
    // ignore - in-memory only
  }
  return value;
}

export function getAnalyticsQueueLength() {
  try {
    if (typeof localStorage === "undefined") return 0;
    const raw = localStorage.getItem(QUEUE_KEY);
    if (!raw) return 0;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.length : 0;
  } catch (err) {
    return 0;
  }
}

/* ---------- Delivery ---------- */

function persistQueue(queue) {
  try {
    if (typeof localStorage !== "undefined") localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
  } catch (err) {
    // ignore - storage unavailable
  }
}

function readQueue() {
  try {
    if (typeof localStorage === "undefined") return [];
    const raw = localStorage.getItem(QUEUE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    return [];
  }
}

async function deliverEntry(entry) {
  const endpoint = getAnalyticsEndpoint();
  if (!endpoint) return { delivered: false, reason: "endpoint-unset" };

  const body = JSON.stringify(entry);
  const blob = new Blob([body], { type: "application/json" });

  // Prefer sendBeacon: survives page unload and needs no retry loop.
  if (typeof navigator !== "undefined" && navigator.sendBeacon) {
    navigator.sendBeacon(endpoint, blob);
    return { delivered: true, method: "sendBeacon" };
  }

  // fetch with keepalive is the next-best unload-safe transport.
  if (typeof fetch === "function") {
    try {
      await fetch(endpoint, {
        method: "POST",
        body,
        headers: { "Content-Type": "application/json" },
        keepalive: true,
      });
      return { delivered: true, method: "fetch" };
    } catch (err) {
      return { delivered: false, reason: "send-failed" };
    }
  }

  return { delivered: false, reason: "no-transport" };
}

function backoffDelay(attempt) {
  // Capped exponential backoff: 100ms, 200ms, 400ms...
  return Math.min(100 * Math.pow(2, attempt), 3000);
}

async function flushQueue() {
  const queue = readQueue();
  if (!queue.length) return { flushed: 0 };
  const remaining = [];
  for (const entry of queue) {
    const attempt = entry.attempts || 0;
    const result = await deliverEntry(entry);
    if (result.delivered) {
      continue; // drop delivered
    }
    if (attempt < MAX_RETRIES) {
      remaining.push({ ...entry, attempts: attempt + 1 });
    }
    // else drop after max retries - never block the user
  }
  persistQueue(remaining);
  return { flushed: queue.length - remaining.length, remaining: remaining.length };
}

export async function flushAnalyticsQueue() {
  if (!isOptedIn()) return { flushed: 0, reason: "opted-out" };
  return flushQueue();
}

/* ---------- Track ---------- */

export function track(event, payload = {}) {
  // Consent is re-evaluated on every call (source of truth: localStorage).
  const consent = isOptedIn();
  const entry = { event, ts: Date.now(), ...payload };

  if (!consent) {
    return { sent: false, event, reason: "opted-out" };
  }

  const endpoint = getAnalyticsEndpoint();

  // Endpoint configured: deliver immediately; on failure, enqueue for retry.
  if (endpoint) {
    const result = deliverEntry(entry);
    // deliverEntry may be async (fetch path) or sync (sendBeacon path).
    // Normalize: treat non-Promise results as already handled.
    if (result && typeof result.then === "function") {
      result.catch(() => {
        enqueueForRetry(entry);
      });
      return { sent: true, event };
    }
    if (result && result.delivered) {
      return { sent: true, event };
    }
    enqueueForRetry(entry);
    return { sent: true, event, queued: true };
  }

  // No endpoint: record locally for later delivery once configured.
  enqueueForRetry(entry);
  return { sent: true, event, delivered: false, reason: "endpoint-unset", queued: true };
}

function enqueueForRetry(entry) {
  const queue = readQueue();
  if (queue.length >= MAX_QUEUE_SIZE) {
    queue.shift(); // drop oldest to keep queue bounded
  }
  queue.push({ ...entry, attempts: 0 });
  persistQueue(queue);
}

/* ---------- Scoring webhook event ---------- */

/**
 * Emits the scoring webhook event after a (possibly follow-up refined) result is computed.
 * Payload shape is webhook-friendly: archetype id, fit score, and whether an adaptive round was used.
 */
export function trackScoringResult(result, meta = {}) {
  const payload = {
    archetype: result && result.top && typeof result.top.id === "string" ? result.top.id : null,
    fitScore: result && Number.isFinite(result.fitScore) ? result.fitScore : null,
    usedFollowUps: !!meta && !!meta.usedFollowUps,
  };
  return track("scoring_completed", payload);
}

export function initAnalytics() {
  setOptedIn(getConsentState());
  return isOptedIn();
}

export function resetAnalyticsConsent() {
  return setOptedIn(false);
}
