
// --- Clipboard utility + small toast ---
async function copyText(text) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      toast("Copied to clipboard.");
    } else {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(ta);
      toast(ok ? "Copied to clipboard." : "Copy failed.");
    }
  } catch (e) {
    console.error(e);
    toast("Copy failed.");
  }
}

let toastTimer;
function toast(msg) {
  let t = document.getElementById("toast");
  if (!t) {
    t = document.createElement("div");
    t.id = "toast";
    t.style.position = "fixed";
    t.style.bottom = "16px";
    t.style.left = "50%";
    t.style.transform = "translateX(-50%)";
    t.style.background = "#11151b";
    t.style.border = "1px solid #2a2f3a";
    t.style.color = "#e6edf3";
    t.style.padding = "8px 12px";
    t.style.borderRadius = "8px";
    t.style.zIndex = "9999";
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.style.display = "block";
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => (t.style.display = "none"), 1600);
}

// --- Element refs ---
const ids = [
  "officerName","ccelRef",
  "vrn","businessName","addressLine","postcode",
  "relation","agencyName","agencyAddress","agentRef",
  "callerName","phoneNumber","securityResult",
  "brief"
];
const els = {};
ids.forEach(id => (els[id] = document.getElementById(id)));

const introOfficerName = document.getElementById("introOfficerName");
const resetBtn = document.getElementById("resetBtn");
const securityIndicator = document.getElementById("securityIndicator");

const ccelNoteOut = document.getElementById("ccelNote");
const sapNoteOut = document.getElementById("sapNote");

// Security detail blocks
const passLabel = document.getElementById("securityPassLabel");
const passBlock = document.getElementById("securityPassBlock");
const failLabel = document.getElementById("securityFailLabel");
const failBlock = document.getElementById("securityFailBlock");

// Pass checkboxes
const passChecks = {
  box5: document.getElementById("sec_pass_box5"),
  edr: document.getElementById("sec_pass_edr"),
  arn: document.getElementById("sec_pass_arn"),
  f64_8: document.getElementById("sec_pass_64_8"),
  agentOther: document.getElementById("sec_pass_agent_other"),
  eis: document.getElementById("sec_pass_eis")
};

// Fail checkboxes
const failChecks = {
  box5: document.getElementById("sec_fail_box5"),
  edr: document.getElementById("sec_fail_edr"),
  vrn: document.getElementById("sec_fail_vrn"),
  agentNotAuth: document.getElementById("sec_fail_agent_not_auth"),
  notAuth: document.getElementById("sec_fail_not_auth"),
  agentRefOther: document.getElementById("sec_fail_agent_ref_other")
};

// --- Settings persistence (values) ---
function loadSettings() {
  const name = localStorage.getItem("officerName") || "";
  const ref  = localStorage.getItem("ccelRef") || "";
  els.officerName.value = name;
  els.ccelRef.value = ref;
  introOfficerName.textContent = name || "[Name]";
}
function saveSettings() {
  localStorage.setItem("officerName", (els.officerName.value || "").trim());
  localStorage.setItem("ccelRef", (els.ccelRef.value || "").trim());
  introOfficerName.textContent = (els.officerName.value || "").trim() || "[Name]";
}

// --- Panel open/closed state persistence ---
function loadDetailsState(id, key) {
  const details = document.getElementById(id);
  if (!details) return;
  const open = localStorage.getItem(key);
  if (open !== null) details.open = open === "true";
}
function wireDetailsState(id, key) {
  const details = document.getElementById(id);
  if (!details) return;
  details.addEventListener("toggle", () => {
    localStorage.setItem(key, details.open ? "true" : "false");
  });
}

// --- Conditional UI: Agent fields ---
function updateAgentFields() {
  const isAgent = els.relation.value === "Agent";
  const agentBlock = document.querySelector(".agent-only");
  const agentPassLabel = document.querySelector(".agent-only-pass");
  if (isAgent) {
    agentBlock.classList.remove("hidden");
    if (agentPassLabel) agentPassLabel.classList.remove("hidden");
  } else {
    agentBlock.classList.add("hidden");
    if (agentPassLabel) agentPassLabel.classList.add("hidden");
    els.agencyName.value = "";
    els.agencyAddress.value = "";
    els.agentRef.value = "";
  }
}

// --- Security indicator + detail blocks ---
function updateSecurityIndicator() {
  const val = (els.securityResult.value || "").trim();
  if (!securityIndicator) return;
  if (val === "Pass") {
    securityIndicator.textContent = "✔";
    securityIndicator.classList.remove("warn");
    securityIndicator.classList.add("ok");
    securityIndicator.setAttribute("aria-label", "Security passed");
    securityIndicator.setAttribute("title", "Security passed");
  } else {
    securityIndicator.textContent = "✖";
    securityIndicator.classList.remove("ok");
    securityIndicator.classList.add("warn");
    securityIndicator.setAttribute("aria-label", "Security not passed");
    securityIndicator.setAttribute("title", "Security not passed");
  }
}

function clearPassFailSelections() {
  Object.values(passChecks).forEach(cb => cb && (cb.checked = false));
  Object.values(failChecks).forEach(cb => cb && (cb.checked = false));
}

function updateSecurityDetailsBlocks() {
  const val = (els.securityResult.value || "").trim();
  // Toggle visibility
  if (val === "Pass") {
    passLabel.classList.remove("hidden");
    passBlock.classList.remove("hidden");
    failLabel.classList.add("hidden");
    failBlock.classList.add("hidden");
    // Clear fail selections
    Object.values(failChecks).forEach(cb => cb && (cb.checked = false));
  } else if (val === "Fail") {
    failLabel.classList.remove("hidden");
    failBlock.classList.remove("hidden");
    passLabel.classList.add("hidden");
    passBlock.classList.add("hidden");
    // Clear pass selections
    Object.values(passChecks).forEach(cb => cb && (cb.checked = false));
  } else {
    passLabel.classList.add("hidden");
    passBlock.classList.add("hidden");
    failLabel.classList.add("hidden");
    failBlock.classList.add("hidden");
    clearPassFailSelections();
  }
  updateSecurityIndicator();
}

// --- Build notes ---
function buildSecurityLine() {
  const val = (els.securityResult.value || "").trim();
  if (val !== "Pass" && val !== "Fail") return `Security: ${val || "N/A"}`;

  if (val === "Pass") {
    const items = [];
    if (passChecks.box5?.checked) items.push("PASSED box five figure confirmed");
    if (passChecks.edr?.checked) items.push("PASSED EDR confirmed");
    if (passChecks.arn?.checked) items.push("PASSED ARN confirmed");
    if (passChecks.f64_8?.checked) items.push("PASSED via VAT form 64-8");
    if (passChecks.agentOther?.checked) items.push("PASSED agent unable to confirm ARN but confirmed answers to other account questions");
    if (passChecks.eis?.checked) items.push("PASSED via EIS reference");
    const suffix = items.length ? ` (details: ${items.join("; ")})` : "";
    return `Security: Pass${suffix}`;
  } else {
    const items = [];
    if (failChecks.box5?.checked) items.push("FAILED unable to confirm box 5 figure");
    if (failChecks.edr?.checked) items.push("FAILED unable to confirm EDR");
    if (failChecks.vrn?.checked) items.push("FAILED unable to confirm VRN");
    if (failChecks.agentNotAuth?.checked) items.push("FAILED agent not authorised");
    if (failChecks.notAuth?.checked) items.push("FAILED not authorised");
    if (failChecks.agentRefOther?.checked) items.push("FAILED agent unable to confirm agent ref or answer other account questions");
    const suffix = items.length ? ` (details: ${items.join("; ")})` : "";
    return `Security: Fail${suffix}`;
  }
}

function buildCcelNote() {
  const lines = [];
  lines.push("All calls are digitally recorded. To request a copy of this call please email DL-CC Head Office Quality.");
  lines.push("");
  lines.push(`Officer: ${safe(els.officerName.value)}`);
  lines.push(`VRN: ${safe(els.vrn.value)}`);
  lines.push(`CCEL Ref: ${safe(els.ccelRef.value)}`);
  lines.push(`Business Name: ${safe(els.businessName.value)}`);
  const addr = [safe(els.addressLine.value), safe(els.postcode.value)].filter(Boolean).join(" ");
  lines.push(`Address: ${addr}`);
  lines.push(`Caller Name: ${safe(els.callerName.value)}`);
  lines.push(`Relationship: ${safe(els.relation.value)}`);
  if (els.relation.value === "Agent") {
    const agency = [safe(els.agencyName.value), safe(els.agencyAddress.value)].filter(Boolean).join(" | ");
    lines.push(`Agency: ${agency}`);
    lines.push(`Agent Ref: ${safe(els.agentRef.value)}`);
  }
  lines.push(`Phone number: ${safe(els.phoneNumber.value)}`);
  lines.push(buildSecurityLine());
  lines.push("");
  lines.push("Brief — What they wanted / What you did:");
  lines.push(safe(els.brief.value) || "—");
  return lines.join("\n");
}

function buildSapNote() {
  const lines = [];
  lines.push("All calls are digitally recorded. To request a copy of this call please email DL-CC Head Office Quality.");
  lines.push("");
  lines.push(`VRN: ${safe(els.vrn.value)} | CCEL: ${safe(els.ccelRef.value)}`);
  lines.push(`Name: ${safe(els.callerName.value)} (${safe(els.relation.value) || "N/A"})`);
  lines.push(`Business: ${safe(els.businessName.value)} | Postcode: ${safe(els.postcode.value)}`);
  lines.push(buildSecurityLine());
  lines.push(`Phone: ${safe(els.phoneNumber.value)}`);
  lines.push("");
  lines.push("Brief:");
  lines.push(safe(els.brief.value) || "—");
  return lines.join("\n");
}

function safe(v) { return (v || "").toString().trim(); }
function updateNotes() {
  ccelNoteOut.value = buildCcelNote();
  sapNoteOut.value = buildSapNote();
}

// --- Copy wiring ---
function wireFieldCopies() {
  document.querySelectorAll(".copy-btn[data-copy-target]").forEach(btn => {
    btn.addEventListener("click", () => {
      const targetId = btn.getAttribute("data-copy-target");
      const el = document.getElementById(targetId);
      const val = el ? el.value : "";
      copyText(val || "");
    });
  });
}
function wireNoteCopies() {
  document.querySelectorAll(".copy-note").forEach(btn => {
    btn.addEventListener("click", () => {
      const which = btn.getAttribute("data-note");
      const text = which === "ccel" ? ccelNoteOut.value : sapNoteOut.value;
      copyText(text);
    });
  });
}

// --- Reset ---
function resetCall() {
  [
    "vrn","businessName","addressLine","postcode","relation",
    "agencyName","agencyAddress","agentRef",
    "callerName","phoneNumber","securityResult","brief"
  ].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    if (el.tagName === "SELECT") el.selectedIndex = 0;
    else el.value = "";
  });

  // Clear pass/fail selections + hide blocks + indicator back to red ✖
  clearPassFailSelections();
  passLabel.classList.add("hidden");
  passBlock.classList.add("hidden");
  failLabel.classList.add("hidden");
  failBlock.classList.add("hidden");
  updateSecurityIndicator();

  updateAgentFields();
  updateNotes();
  toast("Call reset.");
}

// --- Init ---
document.addEventListener("DOMContentLoaded", () => {
  loadSettings();

  // Panel open-state
  loadDetailsState("introDetails", "introDetailsOpen");
  loadDetailsState("settingsDetails", "settingsDetailsOpen");
  wireDetailsState("introDetails", "introDetailsOpen");
  wireDetailsState("settingsDetails", "settingsDetailsOpen");

  wireFieldCopies();
  wireNoteCopies();

  // Live updates
  Object.values(els).forEach(el => {
    el.addEventListener("input", () => {
      if (el.id === "officerName" || el.id === "ccelRef") saveSettings();
      if (el.id === "relation") updateAgentFields();
      if (el.id === "securityResult") updateSecurityDetailsBlocks();
      updateNotes();
    });
    if (el.tagName === "SELECT") {
      el.addEventListener("change", () => {
        if (el.id === "relation") updateAgentFields();
        if (el.id === "securityResult") updateSecurityDetailsBlocks();
        updateNotes();
      });
    }
  });

  // Any change in pass/fail checklists updates notes
  [...Object.values(passChecks), ...Object.values(failChecks)]
    .forEach(cb => cb && cb.addEventListener("change", updateNotes));

  resetBtn.addEventListener("click", resetCall);

  // Initial state
  updateAgentFields();
  updateSecurityIndicator(); // default red ✖
  updateNotes();
});
