/**
 * Adult Niche Finder — application controller.
 * Wires the age gate, quiz engine, persona reveal, playbook,
 * result actions, privacy checklist, and toolkit views.
 */

import { QUIZ_QUESTIONS, QUESTION_COUNT, ESTIMATED_MINUTES, FOLLOW_UP_QUESTIONS, FOLLOW_UP_QUESTION_COUNT } from "./quiz-data.js";
import { ARCHETYPES, ARCHETYPE_IDS } from "./personas.js";
import {
  initialAnswers,
  setAnswer,
  isComplete,
  areAllQuestionsComplete,
  computeResult,
  computeResultForArchetype,
} from "./scoring.js";
import {
  archetypeInitials,
  formatFitScore,
  generatePlaybook,
  buildNicheBriefText,
  downloadPlaybook,
  copyTextToClipboard,
  sharePublicSummary,
  listProfiles,
  saveProfile,
  deleteProfile,
  clearProfiles,
} from "./results.js";
import { CHECKLIST_ITEMS, buildChecklistText } from "./privacy.js";
import { getConsentState, setOptedIn, track, trackScoringResult } from "./analytics.js";
import { saveLaneLetterEmail, hasLaneLetterSignup, clearLaneLetterSignups, isValidEmail } from "./newsletter.js";

const state = {
  answers: initialAnswers(),
  current: -1, // -1 = intro screen, 0..9 = question index, 10..11 = follow-up questions
  inFollowUp: false,
  followUpAnswers: {},
  result: null,
  saved: false,
};

const $ = (id) => document.getElementById(id);

/* ---------------- Views ---------------- */

function showView(name) {
  for (const key of ["landing", "quiz", "result"]) {
    const el = document.querySelector(`[data-view="${key}"]`);
    if (el) el.hidden = name !== key;
  }
}

/* ---------------- Age gate ---------------- */

const ageGate = $("age-gate");
let lastFocusedTrigger = null;

function openAgeGate() {
  if (!ageGate) return;
  lastFocusedTrigger = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  ageGate.hidden = false;
  $("age-ok").focus();
  track("age_gate_opened");
}
function closeAgeGate() {
  if (!ageGate) return;
  ageGate.hidden = true;
  if (lastFocusedTrigger && typeof lastFocusedTrigger.focus === "function") {
    lastFocusedTrigger.focus();
  }
  lastFocusedTrigger = null;
}
function handleAgeGateKeydown(event) {
  if (!ageGate || ageGate.hidden) return;
  if (event.key === "Escape") {
    event.preventDefault();
    closeAgeGate();
    showView("landing");
    return;
  }
  if (event.key === "Tab") {
    const focusables = ageGate.querySelectorAll("button, a[href], input, select, textarea, [tabindex]:not([tabindex='-1'])");
    const list = Array.from(focusables).filter((el) => !el.disabled && el.offsetParent !== null);
    if (!list.length) return;
    const first = list[0];
    const last = list[list.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
}
document.addEventListener("keydown", handleAgeGateKeydown);

function startQuiz() {
  state.answers = initialAnswers();
  state.current = -1;
  state.result = null;
  if (window.history && window.history.replaceState) {
    window.history.replaceState(null, "", window.location.pathname);
  }
  track("quiz_started");
  showView("quiz");
  renderQuiz();
}

/* ---------------- Quiz ---------------- */

function renderQuiz() {
  const quizCard = $("quiz-card");
  const progressFill = $("progress-fill");
  const progressBar = $("quiz-progress");
  const countEl = $("quiz-count");

  if (state.current === -1) {
    quizCard.innerHTML = `
      <div class="quiz-step quiz-intro">
        <p class="eyebrow">The Audition</p>
        <h3>Ready to step into your lane?</h3>
        <p>Ten questions. About ${ESTIMATED_MINUTES} minutes. Your answers map to a creator archetype.</p>
        <button class="btn btn-primary btn-lg" id="begin-btn" type="button">Begin the Audition</button>
      </div>`;
    quizCard.querySelector("#begin-btn").addEventListener("click", () => {
      state.current = 0;
      renderQuiz();
    });
    const percent = 0;
    progressFill.style.width = `${percent}%`;
    progressBar.setAttribute("aria-valuenow", "0");
    countEl.textContent = `0 / ${QUESTION_COUNT}`;
    return;
  }

  const questionList = state.inFollowUp ? [...QUIZ_QUESTIONS, ...FOLLOW_UP_QUESTIONS] : QUIZ_QUESTIONS;
  const question = questionList[state.current];
  quizCard.innerHTML = "";
  const wrapper = document.createElement("div");
  wrapper.className = "quiz-step";
  const h3 = document.createElement("h3");
  h3.id = "quiz-question";
  h3.tabIndex = -1;
  h3.textContent = `${state.current - (state.inFollowUp ? QUIZ_QUESTIONS.length : 0) + 1}. ${question.title}`;
  const sub = document.createElement("p");
  sub.className = "quiz-subtitle";
  sub.id = "quiz-subtitle";
  sub.textContent = question.subtitle || "";
  wrapper.appendChild(h3);
  wrapper.appendChild(sub);

  const choices = document.createElement("div");
  choices.className = "choices";
  choices.setAttribute("role", question.type === "multi" ? "group" : "radiogroup");
  choices.setAttribute("aria-labelledby", "quiz-question");

  for (const option of question.options) {
    const label = document.createElement("label");
    label.className = "choice-card";
    label.setAttribute("for", `choice-${question.id}-${option.value}`);

    const input = document.createElement("input");
    input.type = question.type === "multi" ? "checkbox" : "radio";
    input.id = `choice-${question.id}-${option.value}`;
    input.name = `question-${question.id}`;
    input.value = option.value;
    input.addEventListener("change", () => {
      applyAnswer(question, option.value, input.checked);
      renderChoicesState();
    });

    const title = document.createElement("span");
    title.className = "choice-title";
    title.textContent = option.label;
    const desc = document.createElement("span");
    desc.className = "choice-desc";
    desc.textContent = option.description || "";

    label.appendChild(input);
    label.appendChild(title);
    label.appendChild(desc);
    choices.appendChild(label);
  }

  wrapper.appendChild(choices);
  quizCard.appendChild(wrapper);

  const selected = state.answers[question.id];
  const selectedValues = question.type === "multi" ? selected || [] : selected ? [selected] : [];
  for (const option of question.options) {
    const input = document.getElementById(`choice-${question.id}-${option.value}`);
    const checked = selectedValues.includes(option.value);
    if (input) input.checked = checked;
  }
  renderChoicesState();

  const nav = buildQuizNav();
  quizCard.appendChild(nav);

  // Move focus to the new question heading for keyboard/screen-reader users.
  h3.focus({ preventScroll: true });
}

function buildQuizNav() {
  const nav = document.createElement("div");
  nav.className = "quiz-nav";

  const prev = document.createElement("button");
  prev.className = "btn btn-ghost";
  prev.id = "prev-btn";
  prev.type = "button";
  prev.textContent = "Back";
  prev.disabled = state.current === -1;
  prev.addEventListener("click", () => goPrev());
  nav.appendChild(prev);

  const error = document.createElement("p");
  error.className = "quiz-error";
  error.id = "quiz-error";
  error.setAttribute("role", "alert");
  error.hidden = true;
  nav.appendChild(error);

  const next = document.createElement("button");
  next.className = "btn btn-primary";
  next.id = "next-btn";
  next.type = "button";
  next.textContent = state.current === QUESTION_COUNT - 1 ? "Reveal My Persona" : "Continue";
  next.addEventListener("click", () => goNext());
  nav.appendChild(next);

  return nav;
}

function renderChoicesState() {
  const question = QUIZ_QUESTIONS[state.current];
  const container = document.querySelector("#quiz-card .choices");
  if (!container) return;
  for (const option of question.options) {
    const input = document.getElementById(`choice-${question.id}-${option.value}`);
    if (!input) continue;
    const card = input.closest(".choice-card");
    if (!card) continue;
    const selected = question.type === "multi"
      ? (state.answers[question.id] || []).includes(option.value)
      : state.answers[question.id] === option.value;
    card.classList.toggle("selected", selected);
  }
}

function applyAnswer(question, value, checked) {
  const next = { ...state.answers };
  if (question.type === "multi") {
    const current = Array.isArray(next[question.id]) ? next[question.id] : [];
    next[question.id] = checked
      ? Array.from(new Set([...current, value]))
      : current.filter((v) => v !== value);
  } else {
    next[question.id] = checked ? value : null;
  }
  state.answers = next;
}

function updateQuizChrome() {
  const progressFill = $("progress-fill");
  const progressBar = $("quiz-progress");
  const countEl = $("quiz-count");
  const total = state.inFollowUp
    ? QUIZ_QUESTIONS.length + FOLLOW_UP_QUESTION_COUNT
    : QUESTION_COUNT;
  const currentIndex = state.current < 0 ? 0 : state.current;
  const percent = total > 1 ? (currentIndex / (total - 1)) * 100 : 0;
  progressFill.style.width = `${percent}%`;
  progressBar.setAttribute("aria-valuemax", String(total - 1));
  progressBar.setAttribute("aria-valuenow", String(currentIndex));
  progressBar.setAttribute("aria-label", `Question ${currentIndex + 1} of ${total}`);
  countEl.textContent = `${currentIndex + 1} / ${total}`;
}

function goNext() {
  if (state.current === -1) {
    state.current = 0;
    renderQuiz();
    updateQuizChrome();
    return;
  }
  const questionList = state.inFollowUp ? [...QUIZ_QUESTIONS, ...FOLLOW_UP_QUESTIONS] : QUIZ_QUESTIONS;
  const question = questionList[state.current];
  const error = $("quiz-error");
  if (!isComplete(question, state.answers)) {
    error.textContent = `Answer required: ${question.title}`;
    error.hidden = false;
    return;
  }
  error.hidden = true;
  if (state.inFollowUp) {
    if (state.current === questionList.length - 1) {
      // Follow-up round complete — merge and recompute the final persona.
      const mergedAnswers = { ...state.answers, ...state.followUpAnswers };
      state.answers = mergedAnswers;
      const finalResult = computeResult(mergedAnswers);
      state.result = finalResult;
      state.inFollowUp = false;
      renderResult(finalResult);
      renderPlaybookInto($("playbook-content"));
      trackScoringResult(finalResult, { usedFollowUps: true });
      if (window.history && window.history.replaceState) {
        window.history.replaceState(null, "", `?persona=${finalResult.top.id}`);
      }
      showView("result");
      const resultSection = document.getElementById("result");
      resultSection?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    state.current += 1;
    renderQuiz();
    updateQuizChrome();
    return;
  }
  if (state.current === QUESTION_COUNT - 1) {
    completeQuiz();
    return;
  }
  state.current += 1;
  renderQuiz();
  updateQuizChrome();
}

function goPrev() {
  if (state.current <= -1) return;
  if (state.inFollowUp && state.current === QUIZ_QUESTIONS.length) return;
  state.current -= 1;
  renderQuiz();
  updateQuizChrome();
}

function completeQuiz() {
  const result = computeResult(state.answers);
  state.result = result;
  renderResult(result);
  renderPlaybookInto($("playbook-content"));
  trackScoringResult(result);

  const shouldFollowUp =
    ["cam", "dominant", "soft-gfe", "anonymous-faceless", "couple"].includes(result.top.id) ||
    result.anonymityBound;

  if (shouldFollowUp) {
    state.inFollowUp = true;
    state.followUpAnswers = {};
    state.current = QUIZ_QUESTIONS.length;
    renderQuiz();
    updateQuizChrome();
    return;
  }

  if (window.history && window.history.replaceState) {
    window.history.replaceState(null, "", `?persona=${result.top.id}`);
  }
  showView("result");
  const resultSection = document.getElementById("result");
  resultSection?.scrollIntoView({ behavior: "smooth", block: "start" });
}

/* ---------------- Result ---------------- */

function renderResult(result) {
  const top = result.top;
  const orb = $("persona-orb");
  orb.textContent = archetypeInitials(top);
  $("persona-name").textContent = top.name;
  $("persona-tagline").textContent = top.tagline;
  $("persona-desc").textContent = top.description;
  $("identity-statement").textContent = top.identityStatement;
  $("fit-score").textContent = formatFitScore(result.fitScore);

  const card = $("persona-card");
  card.classList.add("is-revealed");
  card.style.setProperty("--accent", top.accent);

  const ring = $("fit-ring");
  ring.style.background = `conic-gradient(${top.accent} ${result.fitScore}%, rgba(21, 16, 33, 0.9) 0)`;
  ring.style.setProperty("--fit", String(result.fitScore));

  const strengthsEl = $("persona-strengths");
  strengthsEl.innerHTML = "";
  for (const strength of top.strengths) {
    const li = document.createElement("li");
    li.textContent = strength;
    strengthsEl.appendChild(li);
  }

  const whyEl = $("persona-why");
  whyEl.innerHTML = "";
  for (const reason of result.reasons) {
    const li = document.createElement("li");
    li.textContent = reason;
    whyEl.appendChild(li);
  }
  if (result.anonymityBound) {
    const li = document.createElement("li");
    li.textContent = "A privacy boundary shaped this reveal; the strategy keeps exposure controlled.";
    whyEl.appendChild(li);
  }

  const alternatesEl = $("alternates");
  alternatesEl.innerHTML = "";
  for (const alt of result.alternatives) {
    const article = document.createElement("article");
    article.className = "alternative-card";
    article.style.setProperty("--alt-accent", alt.accent);
    article.innerHTML = `
      <h4>${alt.name}</h4>
      <p>${alt.tagline}</p>
      <p>Exploratory match weight: ${alt.score}</p>
    `;
    alternatesEl.appendChild(article);
  }
}

function renderPlaybookInto(container) {
  const result = state.result;
  const playbook = generatePlaybook(result);
  const top = result.top;
  const accent = top.accent;

  container.innerHTML = `
    <h4>Brand Direction</h4>
    <h3 class="playbook-section-title">Identity & positioning</h3>
    <div class="brand-grid">
      ${playbook.brand.names.map((n) => `<div class="name-card"><h5>${n}</h5><p>Signature name for this lane.</p></div>`).join("")}
    </div>
    <div class="swatch-row" role="list" aria-label="Suggested brand palette">
      ${playbook.palette.map((c) => `<div class="swatch" style="background:${c}" role="listitem" aria-label="Color ${c}"></div>`).join("")}
    </div>
    <p><strong>Personality:</strong> ${playbook.brand.personality}</p>
    <p><strong>Tagline:</strong> ${playbook.brand.tagline}</p>
    <p><strong>Visual aesthetic:</strong> ${playbook.brand.aesthetic}</p>
    <p><strong>Profile bio:</strong> ${playbook.brand.bio}</p>
    <p><strong>Intended audience:</strong> ${playbook.brand.audience}</p>

    <h4>Content Pillars</h4>
    <h3 class="playbook-section-title">Four pillars for this lane</h3>
    <div class="pillars-list">
      ${playbook.pillars.map((p) => `
        <div class="pillar-card">
          <h5>${p.title}</h5>
          <p>${p.description}</p>
          <ul>
            ${p.ideas.map((i) => `<li>${i}</li>`).join("")}
          </ul>
          <p class="pillar-meta">Format: ${p.format}</p>
        </div>`).join("")}
    </div>

    <h4>Platform Recommendations</h4>
    <h3 class="playbook-section-title">Where this lane may fit</h3>
    <div class="platform-list">
      ${playbook.platforms.map((p) => `
        <div class="platform-row">
          <h5>${p.category} <span class="pillar-meta">${p.example}</span></h5>
          <p class="platform-why">${p.why}</p>
          <p>${p.adultNote}</p>
        </div>`).join("")}
    </div>
    <p class="disclaimer">You are responsible for verifying current platform eligibility, identity verification, and content policies.</p>

    <h4>Seven-Day Starter Plan</h4>
    <h3 class="playbook-section-title">From zero to launch</h3>
    <div class="plan-grid">
      ${playbook.plan.map((d) => `
        <div class="plan-day">
          <span class="day-num">DAY ${d.day}</span>
          <h5>${d.title}</h5>
          <ul>
            ${d.tasks.map((t) => `<li>${t}</li>`).join("")}
          </ul>
        </div>`).join("")}
    </div>
  `;
  container.style.setProperty("--playbook-accent", accent);
}

/* ---------------- Result actions ---------------- */

function showSaveStatus(text, isError = false) {
  const el = $("save-status");
  el.textContent = text;
  el.hidden = false;
  el.style.color = isError ? "#ff6b6b" : "#00d9ff";
}

function renderSavedProfiles() {
  const savedList = $("saved-profiles");
  const listEl = $("saved-profiles-list");
  if (!savedList || !listEl) return;
  const profiles = listProfiles();
  const hasProfiles = profiles.length > 0;
  savedList.hidden = !hasProfiles;
  if (!hasProfiles) {
    listEl.innerHTML = "";
    const savedRow = $("saved-row");
    if (savedRow) savedRow.hidden = true;
    return;
  }
  if ($("saved-row")) $("saved-row").hidden = false;
  listEl.innerHTML = profiles
    .map(
      (p) =>
        `<div class="saved-profile-card">` +
        `<div class="saved-profile-info">` +
        `<h5>${p.archetypeName}</h5>` +
        `<p class="saved-profile-meta">${p.fitScore != null ? `Fit estimate: ${p.fitScore} / 100` : "Fit estimate pending"} · Saved ${new Date(p.savedAt).toLocaleDateString()}</p>` +
        (p.identityStatement ? `<p class="saved-profile-identity">“${p.identityStatement}”</p>` : "") +
        `</div>` +
        `<div class="saved-profile-actions">` +
        `<button class="btn btn-ghost" type="button" data-profile-restore="${p.id}">Restore</button>` +
        `<button class="btn btn-ghost" type="button" data-profile-delete="${p.id}">Delete</button>` +
        `</div>` +
        `</div>`
    )
    .join("");
}

function applyProfile(profile) {
  const archetype = ARCHETYPES[profile.archetypeId] || ARCHETYPES["soft-gfe"];
  state.result = {
    top: { ...archetype, id: archetype.id },
    fitScore: profile.fitScore ?? 50,
    reasons: [`Previously saved persona: ${archetype.name}.`],
    anonymityBound: false,
    noLive: false,
    collabOpen: true,
    answers: state.answers,
  };
  renderResult(state.result);
  renderPlaybookInto($("playbook-content"));
  showView("result");
  const resultSection = document.getElementById("result");
  resultSection?.scrollIntoView({ behavior: "smooth", block: "start" });
  showSaveStatus(`Restored saved lane: ${archetype.name}.`);
}

function restoreSaved() {
  const profiles = listProfiles();
  const latest = profiles[0];
  if (!latest) {
    showSaveStatus("No saved lanes yet. Save your result after the reveal.", true);
    return;
  }
  applyProfile(latest);
}

function restoreProfile(id) {
  const profiles = listProfiles();
  const profile = profiles.find((p) => p.id === id);
  if (!profile) return;
  applyProfile(profile);
}

function deleteSavedProfile(id) {
  const remaining = deleteProfile(id);
  renderSavedProfiles();
  if (remaining.length === 0 && $("saved-row")) $("saved-row").hidden = true;
}

function clearSaved() {
  clearProfiles();
  if ($("saved-row")) $("saved-row").hidden = true;
  if ($("saved-profiles")) $("saved-profiles").hidden = true;
  const listEl = $("saved-profiles-list");
  if (listEl) listEl.innerHTML = "";
  state.saved = false;
  showSaveStatus("");
}

function handleLaneLetterSubmit(event) {
  event.preventDefault();
  const emailInput = $("lane-letter-email");
  const statusEl = $("lane-letter-status");
  const email = emailInput ? String(emailInput.value || "").trim() : "";
  if (!isValidEmail(email)) {
    if (statusEl) {
      statusEl.textContent = "Please enter a valid email address.";
      statusEl.hidden = false;
      statusEl.style.color = "#ff6b6b";
    }
    return;
  }
  saveLaneLetterEmail(email, "lane-letter");
  if (statusEl) {
    statusEl.textContent = "You're on the Lane Letter list. Saved locally in this browser.";
    statusEl.hidden = false;
    statusEl.style.color = "#00d9ff";
  }
}

function handleSave() {
  const result = state.result;
  if (!result) return;
  track("result_saved", { archetype: result.top.id });
  const res = saveProfile(result);
  state.saved = res.ok;
  showSaveStatus(res.ok ? "Result saved locally. Use Restore or Clear data anytime." : "Local save failed in this browser.", !res.ok);
  renderSavedProfiles();
}

async function handleCopyBrief() {
  const text = buildNicheBriefText(state.result, state.answers);
  const res = await copyTextToClipboard(text);
  showSaveStatus(res.ok ? "Niche brief copied to clipboard." : "Copy failed. Your browser blocked clipboard access.", !res.ok);
}

function handleDownload() {
  try {
    downloadPlaybook(state.result);
    showSaveStatus("Playbook downloaded as a text file.");
  } catch (err) {
    showSaveStatus("Download failed in this browser.", true);
  }
}

async function handleShare() {
  const res = await sharePublicSummary(state.result);
  track("persona_shared", { archetype: state.result.top.id });
  showSaveStatus(
    res.method === "cancelled"
      ? "Share cancelled."
      : res.ok
        ? "Persona summary shared."
        : "Sharing unavailable — summary copied to clipboard instead.",
  );
}

function handleRetake() {
  state.answers = initialAnswers();
  state.current = -1;
  state.inFollowUp = false;
  state.followUpAnswers = {};
  state.result = null;
  if (window.history && window.history.replaceState) {
    window.history.replaceState(null, "", window.location.pathname);
  }
  track("quiz_restarted");
  showView("quiz");
  renderQuiz();
  updateQuizChrome();
}

/* ---------------- Privacy checklist ---------------- */

function renderChecklist() {
  const container = $("checklist");
  container.innerHTML = "";
  for (const item of CHECKLIST_ITEMS) {
    const checkItem = document.createElement("div");
    checkItem.className = "check-item";

    const head = document.createElement("button");
    head.className = "check-head";
    head.type = "button";
    head.setAttribute("aria-expanded", "false");
    head.innerHTML = `<span class="check-title">${item.title}</span><span class="check-icon" aria-hidden="true">+</span>`;
    head.setAttribute("aria-controls", `check-body-${item.id}`);
    head.addEventListener("click", () => {
      const body = checkItem.querySelector(".check-body");
      const open = head.getAttribute("aria-expanded") === "true";
      head.setAttribute("aria-expanded", String(!open));
      checkItem.classList.toggle("open", !open);
      body.hidden = open;
      body.style.animation = open ? "none" : "";
    });

    const body = document.createElement("div");
    body.className = "check-body";
    body.id = `check-body-${item.id}`;
    body.setAttribute("role", "region");
    body.setAttribute("aria-label", item.title);
    body.hidden = true;
    body.textContent = item.detail;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "check-cb";
    checkbox.id = `check-cb-${item.id}`;
    checkbox.setAttribute("aria-label", item.title);

    const title = document.createElement("h3");
    title.className = "check-title-row";
    const titleText = document.createElement("span");
    titleText.className = "check-title";
    titleText.textContent = item.title;
    title.appendChild(checkbox);
    title.appendChild(titleText);

    checkItem.appendChild(title);
    checkItem.appendChild(head);
    checkItem.appendChild(body);
    container.appendChild(checkItem);
  }
}

async function handleCopyChecklist() {
  const checked = Array.from(document.querySelectorAll(".check-cb:checked")).map(
    (cb) => cb.id.replace("check-cb-", ""),
  );
  const text = buildChecklistText(checked);
  const res = await copyTextToClipboard(text);
  const status = $("checklist-status");
  status.textContent = res.ok ? "Checklist copied to clipboard." : "Copy failed.";
  status.hidden = false;
  status.style.color = res.ok ? "#00d9ff" : "#ff6b6b";
}

/* ---------------- Init ---------------- */

function init() {
  const navCta = document.getElementById("nav-quiz-cta");
  if (navCta) {
    navCta.addEventListener("click", (event) => {
      event.preventDefault();
      openAgeGate();
    });
  }

  $("start-quiz-btn").addEventListener("click", openAgeGate);
  $("age-ok").addEventListener("click", () => {
    closeAgeGate();
    startQuiz();
  });
  $("age-exit").addEventListener("click", () => {
    closeAgeGate();
    showView("landing");
  });

  renderChecklist();
  $("save-result-btn").addEventListener("click", handleSave);
  $("copy-brief-btn").addEventListener("click", handleCopyBrief);
  $("download-playbook-btn").addEventListener("click", handleDownload);
  $("share-persona-btn").addEventListener("click", handleShare);
  $("retake-btn").addEventListener("click", handleRetake);
  $("restore-saved-btn").addEventListener("click", restoreSaved);
  $("clear-saved-btn").addEventListener("click", clearSaved);
  $("copy-checklist-btn").addEventListener("click", handleCopyChecklist);
  const laneLetterForm = document.getElementById("lane-letter-form");
  if (laneLetterForm) {
    laneLetterForm.addEventListener("submit", handleLaneLetterSubmit);
  }

  renderSavedProfiles();

  document.addEventListener("click", (event) => {
    const target = event.target;
    const restoreBtn = target && typeof target.closest === "function" ? target.closest("[data-profile-restore]") : null;
    const deleteBtn = target && typeof target.closest === "function" ? target.closest("[data-profile-delete]") : null;
    if (restoreBtn) {
      event.preventDefault();
      const id = restoreBtn.getAttribute("data-profile-restore");
      if (id) restoreProfile(id);
      return;
    }
    if (deleteBtn) {
      event.preventDefault();
      const id = deleteBtn.getAttribute("data-profile-delete");
      if (id) deleteSavedProfile(id);
      return;
    }
  });

  const consentToggle = document.getElementById("analytics-consent-toggle");
  if (consentToggle) {
    consentToggle.checked = getConsentState();
    consentToggle.addEventListener("change", () => {
      setOptedIn(consentToggle.checked);
      if (consentToggle.checked) {
        track("consent_granted");
      }
    });
  }

  const personaParam = new URLSearchParams(window.location.search).get("persona");
  const personaArchetype = personaParam ? ARCHETYPES[personaParam] : null;
  if (personaParam && personaArchetype) {
    const explicitResult = computeResultForArchetype(personaParam);
    state.result = explicitResult;
    renderResult(explicitResult);
    renderPlaybookInto($("playbook-content"));
    showView("result");
    const resultSection = document.getElementById("result");
    resultSection?.scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }

  showView("landing");
}

document.addEventListener("DOMContentLoaded", init);
