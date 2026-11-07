/**
 * The Lane Letter — local-only email capture for weekly field notes.
 * No list, no transmission, no third-party sends. Stored in localStorage only.
 */

const EMAIL_KEY = "anf_lane_letter_signups";
const MAX_SIGNUPS = 100;

export function isValidEmail(value) {
  return typeof value === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function readSignups() {
  try {
    if (typeof localStorage === "undefined") return [];
    const raw = localStorage.getItem(EMAIL_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((e) => typeof e === "string");
  } catch (err) {
    return [];
  }
}

function writeSignups(list) {
  try {
    if (typeof localStorage !== "undefined") localStorage.setItem(EMAIL_KEY, JSON.stringify(list));
  } catch (err) {
    // ignore - storage unavailable
  }
}

export function saveLaneLetterEmail(email, source) {
  const normalized = String(email || "").trim().toLowerCase();
  const list = [normalized, ...readSignups().filter((e) => e !== normalized)].slice(0, MAX_SIGNUPS);
  writeSignups(list);
  return { ok: true, saved: true, email: normalized, source: source || "lane-letter" };
}

export function hasLaneLetterSignup() {
  return readSignups().length > 0;
}

export function clearLaneLetterSignups() {
  try {
    if (typeof localStorage !== "undefined") localStorage.removeItem(EMAIL_KEY);
  } catch (err) {
    // ignore
  }
  return [];
}
