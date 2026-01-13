
// ---------- Utilities ----------
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

// Safer value helper (always returns a string)
function val(v, fallback = "—") {
  const s = (v ?? "").toString().trim();
  return s || fallback;
}

// ---------- Element references ----------
const els = {
  // Settings
  officerName: document.getElementById("officerName"),
  ccelPrefix: document.getElementById("ccelPrefix"),
  ccelNumber: document.getElementById("ccelNumber"),
  ccelNumDec: document.getElementById("ccelNumDec"),
  ccelNumInc: document.getElementById("ccelNumInc"),

  webchatId: document.getElementById("webchatId"),
  includeWebchatId: document.getElementById("includeWebchatId"),
  auiExt: document.getElementById("auiExt"),
  includeAuiExt: document.getElementById("includeAuiExt"),

  // Intake
  vrn: document.getElementById("vrn"),
  businessName: document.getElementById("businessName"),
  relation: document.getElementById("relation"),
  relationOther: document.getElementById("relationOther"),
  relationOtherLabel: document.getElementById("relationOtherLabel"),
  relationOtherBlock: document.getElementById("relationOtherBlock"),

  agencyName: document.getElementById("agencyName"),
  agencyAddress: document.getElementById("agencyAddress"),
  agentRef: document.getElementById("agentRef"),

  callerName: document.getElementById("callerName"),
  phoneNumber: document.getElementById("phoneNumber"),
  securityResult: document.getElementById("securityResult"),
  brief: document.getElementById("brief"),
  briefTemplateSelect: document.getElementById("briefTemplateSelect"),
  briefTemplateAppend: document.getElementById("briefTemplateAppend"),
};

const agentBlock = document.getElementById("agentBlock"); // Agent-only container
const introOfficerName = document.getElementById("introOfficerName");
const resetBtn = document.getElementById("resetBtn");
const resetSettingsBtn = document.getElementById("resetSettingsBtn");
const securityIndicator = document.getElementById("securityIndicator");
const ccelNoteOut = document.getElementById("ccelNote");
const auiNoteOut = document.getElementById("auiNote");

// Security detail blocks
const passLabel = document.getElementById("securityPassLabel");
const passBlock = document.getElementById("securityPassBlock");
const failLabel = document.getElementById("securityFailLabel");
const failBlock = document.getElementById("securityFailBlock");

// Pass/Fail checkboxes
const passChecks = {
  box5: document.getElementById("sec_pass_box5"),
  edr: document.getElementById("sec_pass_edr"),
  arn: document.getElementById("sec_pass_arn"),
  f64_8: document.getElementById("sec_pass_64_8"),
  agentOther: document.getElementById("sec_pass_agent_other"),
  eis: document.getElementById("sec_pass_eis"),
};
const failChecks = {
  box5: document.getElementById("sec_fail_box5"),
  edr: document.getElementById("sec_fail_edr"),
  vrn: document.getElementById("sec_fail_vrn"),
  agentNotAuth: document.getElementById("sec_fail_agent_not_auth"),
  notAuth: document.getElementById("sec_fail_not_auth"),
  agentRefOther: document.getElementById("sec_fail_agent_ref_other"),
};

// ---------- Settings persistence ----------
function loadSettings() {
  const name = localStorage.getItem("officerName") || "";
  const prefix = localStorage.getItem("ccelPrefix") || "CCEL-";
  const number = localStorage.getItem("ccelNumber") ?? ""; // keep blank if not set
  const webchatId = localStorage.getItem("webchatId") || "";
  const auiExt = localStorage.getItem("auiExt") || "";
  const includeWebchatId = localStorage.getItem("includeWebchatId") === "1";
  const includeAuiExt = localStorage.getItem("includeAuiExt") === "1";

  if (els.officerName) els.officerName.value = name;
  if (introOfficerName) introOfficerName.textContent = name || "[Name]";

  if (els.ccelPrefix) els.ccelPrefix.value = prefix;
  if (els.ccelNumber) els.ccelNumber.value = number;

  if (els.webchatId) els.webchatId.value = webchatId;
  if (els.auiExt) els.auiExt.value = auiExt;
  if (els.includeWebchatId) els.includeWebchatId.checked = includeWebchatId;
  if (els.includeAuiExt) els.includeAuiExt.checked = includeAuiExt;
}

function saveSettings() {
  els.officerName && localStorage.setItem("officerName", els.officerName.value.trim());
  els.ccelPrefix && localStorage.setItem("ccelPrefix", els.ccelPrefix.value.trim() || "CCEL-");
  els.ccelNumber && localStorage.setItem("ccelNumber", els.ccelNumber.value.trim());

  els.webchatId && localStorage.setItem("webchatId", els.webchatId.value.trim());
  els.auiExt && localStorage.setItem("auiExt", els.auiExt.value.trim());

  if (els.includeWebchatId) localStorage.setItem("includeWebchatId", els.includeWebchatId.checked ? "1" : "0");
  if (els.includeAuiExt) localStorage.setItem("includeAuiExt", els.includeAuiExt.checked ? "1" : "0");

  if (introOfficerName) introOfficerName.textContent = val(els.officerName?.value, "[Name]");
}

// Build CCEL from Prefix + Number
function getCcelRef() {
  const prefix = (els.ccelPrefix?.value || "").trim();
  const number = (els.ccelNumber?.value || "").trim();
  const ref = `${prefix}${number}`;
  return ref.trim();
}

// ---------- Conditional UI ----------
function updateAgentFields() {
  const relation = (els.relation?.value || "");
  const isAgent = relation === "Agent";
  const isOther = relation === "Other";

  // Agent-specific block
  if (agentBlock) {
    if (isAgent) {
      agentBlock.classList.add("show");
    } else {
      agentBlock.classList.remove("show");
      els.agencyName && (els.agencyName.value = "");
      els.agencyAddress && (els.agencyAddress.value = "");
      els.agentRef && (els.agentRef.value = "");
    }
  }

  // Other -> specify field
  const showOther = !!isOther;
  els.relationOtherLabel && els.relationOtherLabel.classList.toggle("hidden", !showOther);
  els.relationOtherBlock && els.relationOtherBlock.classList.toggle("hidden", !showOther);
  if (!showOther && els.relationOther) els.relationOther.value = "";
}

function updateSecurityIndicator() {
  const valSel = (els.securityResult?.value || "").trim();
  if (!securityIndicator) return;
  if (valSel === "Pass") {
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
  const valSel = (els.securityResult?.value || "").trim();
  if (!passLabel || !passBlock || !failLabel || !failBlock) return;
  if (valSel === "Pass") {
    passLabel.classList.remove("hidden");
    passBlock.classList.remove("hidden");
    failLabel.classList.add("hidden");
    failBlock.classList.add("hidden");
    Object.values(failChecks).forEach(cb => cb && (cb.checked = false));
  } else if (valSel === "Fail") {
    failLabel.classList.remove("hidden");
    failBlock.classList.remove("hidden");
    passLabel.classList.add("hidden");
    passBlock.classList.add("hidden");
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

// ---------- Brief Templates (Progress-chasing) ----------
const briefTemplates = {
  "Deceased Traders (Bereavement)": "Caller is progress-chasing a bereavement case. Checked CCEL/SAP; advised current status and expected next steps/timeframe.",
  "Default Surcharge": "Caller is progress-chasing a default surcharge notice. Reviewed ledger/penalty records; advised current status and next steps.",
  "De-Registration": "Caller is progress-chasing a VAT de-registration request. Checked submission status; advised effective date/timeline and actions if delayed.",
  "DIY": "Caller is progress-chasing a DIY scheme application/claim. Confirmed receipt/processing stage; advised expected outcome timeframe.",
  "Error Correction": "Caller is progress-chasing an error correction (VAT652). Checked receipt and workflow stage; advised response timeline and any further info needed.",
  "FRS - Flat Rate Scheme": "Caller is progress-chasing a Flat Rate Scheme application/exit. Verified current status; advised next steps and timing.",
  "Group Amendments": "Caller is progress-chasing VAT group amendments. Checked system updates; advised processing status and when changes take effect.",
  "IRU form": "Caller is progress-chasing an IRU form submission. Confirmed receipt; advised current stage and expected follow-up.",
  "Variations": "Caller is progress-chasing a variation request. Reviewed case progress; advised status and next steps.",
  "VAT Ledger Breakdown": "Caller is progress-chasing a VAT ledger breakdown. Checked ledger movements; advised when breakdown will be available/issued.",
  "VAT Written Enquiry": "Caller is progress-chasing a written enquiry. Confirmed case in queue; advised response SLA/timeline.",
  "VAT 68 (COLE/TOGC)": "Caller is progress-chasing VAT68 for COLE/TOGC. Verified receipt and case routing; advised current status and next steps.",
  "VAT915": "Caller is progress-chasing a VAT915 submission. Confirmed intake stage; advised expected processing timeframe.",
  "64-8 processing": "Caller is progress-chasing 64-8 (agent authorisation) processing. Checked authorisation status; advised when access will be active.",
  "Payment Allocation (IPP)": "Caller is progress-chasing payment allocation (IPP). Reviewed allocation status; advised reconciliation steps and timeline.",
  "Penalty appeals": "Caller is progress-chasing a penalty appeal. Checked appeal status; advised expected review/decision timeframe.",
  "Registration": "Caller is progress-chasing VAT registration. Verified application progress; advised next steps and expected effective date.",
  "Reinstatements": "Caller is progress-chasing a reinstatement request. Confirmed current status; advised actions/timing.",
  "Repayment": "Caller is progress-chasing a repayment claim. Checked claim status; advised expected payment date and any holds.",
  "Tracing Unit 309": "Caller is progress-chasing a Tracing Unit (309) case. Verified investigation status; advised next steps/timeline.",
};

function buildBriefContextLine() {
  const bits = [];
  if (els.vrn && els.vrn.value) bits.push(`VRN: ${els.vrn.value.trim()}`);

  const ccel = getCcelRef();
  if (ccel) bits.push(`CCEL: ${ccel}`);

  if (els.businessName && els.businessName.value) bits.push(`Business: ${els.businessName.value.trim()}`);
  if (els.callerName && els.callerName.value) {
    const relVal = (els.relation?.value || "");
    let relText = relVal || "N/A";
    if (relVal === "Other" && els.relationOther?.value) relText = `Other — ${els.relationOther.value.trim()}`;
    const relSuffix = ` (${relText})`;
    bits.push(`Caller: ${els.callerName.value.trim()}${relSuffix}`);
  }
  return bits.length ? `Context: ${bits.join(" | ")}` : "";
}

function insertBriefTemplate(topic, append = false) {
  const tpl = briefTemplates[topic];
  if (!tpl || !els.brief) return;
  const ctx = buildBriefContextLine();
  const actions = "Actions taken: ";
  const text = [tpl, ctx, actions].filter(Boolean).join("\n");
  if (append && els.brief.value.trim()) {
    els.brief.value = `${els.brief.value.trim()}\n\n${text}`;
  } else {
    els.brief.value = text;
  }
  updateNotes();
  toast("Template inserted into Brief.");
}

// ---------- Notes generation ----------
function buildSecurityLine() {
  const sel = (els.securityResult?.value || "").trim();
  if (sel !== "Pass" && sel !== "Fail") return "Security: N/A";
  if (sel === "Pass") {
    const items = [];
    if (passChecks.box5?.checked) items.push("PASSED box five figure confirmed");
    if (passChecks.edr?.checked) items.push("PASSED EDR confirmed");
    if (passChecks.arn?.checked) items.push("PASSED ARN confirmed");
    if (passChecks.f64_8?.checked) items.push("PASSED via VAT form 64-8");
    if (passChecks.agentOther?.checked) items.push("PASSED agent unable to confirm ARN but confirmed other account answers");
    if (passChecks.eis?.checked) items.push("PASSED via EIS reference");
    return `Security: Pass${items.length ? ` (details: ${items.join("; ")})` : ""}`;
  } else {
    const items = [];
    if (failChecks.box5?.checked) items.push("FAILED unable to confirm box 5 figure");
    if (failChecks.edr?.checked) items.push("FAILED unable to confirm EDR");
    if (failChecks.vrn?.checked) items.push("FAILED unable to confirm VRN");
    if (failChecks.agentNotAuth?.checked) items.push("FAILED agent not authorised");
    if (failChecks.notAuth?.checked) items.push("FAILED not authorised");
    if (failChecks.agentRefOther?.checked) items.push("FAILED agent unable to confirm agent ref or other account answers");
    return `Security: Fail${items.length ? ` (details: ${items.join("; ")})` : ""}`;
  }
}

function buildCcelNote() {
  const lines = [];
  lines.push("All calls are digitally recorded. To request a copy of this call please email DL-CC Head Office Quality.");
  lines.push("");
  lines.push(`Officer: ${val(els.officerName?.value)}`);

  // Optional Settings-based identifiers
  const includeW = !!els.includeWebchatId?.checked && val(els.webchatId?.value, "");
  const includeA = !!els.includeAuiExt?.checked && val(els.auiExt?.value, "");
  if (includeW) lines.push(`Webchat ID: ${els.webchatId.value.trim()}`);
  if (includeA) lines.push(`AUI Ext: ${els.auiExt.value.trim()}`);

  lines.push(`VRN: ${val(els.vrn?.value, "N/A")}`);
  lines.push(`CCEL Ref: ${val(getCcelRef(), "N/A")}`);
  lines.push(`Business Name: ${val(els.businessName?.value)}`);

  lines.push(`Caller Name: ${val(els.callerName?.value)}`);
  let relation = val(els.relation?.value, "N/A");
  if ((els.relation?.value || "") === "Other" && els.relationOther?.value) {
    relation = `Other — ${els.relationOther.value.trim()}`;
  }
  lines.push(`Relationship: ${relation}`);

  if ((els.relation?.value || "") === "Agent") {
    const agencyParts = [];
    if (els.agencyName?.value) agencyParts.push(els.agencyName.value.trim());
    if (els.agencyAddress?.value) agencyParts.push(els.agencyAddress.value.trim());
    const agency = agencyParts.join(" | ");
    lines.push(`Agency: ${agency || "—"}`);
    lines.push(`Agent Ref: ${val(els.agentRef?.value)}`);
  }

  lines.push(`Phone number: ${val(els.phoneNumber?.value)}`);
  lines.push(buildSecurityLine());
  lines.push("");
  lines.push("Brief — What they wanted / What you did:");
  lines.push(val(els.brief?.value));
  return lines.join("\n");
}

function buildAuiNote() {
  const lines = [];
  lines.push("All calls are digitally recorded. To request a copy of this call please email DL-CC Head Office Quality.");
  lines.push("");

  const ccel = val(getCcelRef(), "N/A");
  let relation = val(els.relation?.value, "N/A");
  if ((els.relation?.value || "") === "Other" && els.relationOther?.value) {
    relation = `Other — ${els.relationOther.value.trim()}`;
  }

  lines.push(`VRN: ${val(els.vrn?.value, "N/A")}  |  CCEL: ${ccel}`);
  lines.push(`Name: ${val(els.callerName?.value)} (${relation})`);
  lines.push(`Business: ${val(els.businessName?.value)}`);
  lines.push(buildSecurityLine());
  lines.push(`Phone: ${val(els.phoneNumber?.value)}`);

  // Optional Settings-based identifiers
  const includeW = !!els.includeWebchatId?.checked && val(els.webchatId?.value, "");
  const includeA = !!els.includeAuiExt?.checked && val(els.auiExt?.value, "");
  if (includeW) lines.push(`Webchat ID: ${els.webchatId.value.trim()}`);
  if (includeA) lines.push(`AUI Ext: ${els.auiExt.value.trim()}`);

  lines.push("");
  lines.push("Brief:");
  lines.push(val(els.brief?.value));
  return lines.join("\n");
}

function updateNotes() {
  ccelNoteOut && (ccelNoteOut.value = buildCcelNote());
  auiNoteOut && (auiNoteOut.value = buildAuiNote());
}

// ---------- Reset Call ----------
function resetCall() {
  // Fields that must be preserved (Settings)
  const preserveIds = new Set([
    "officerName",
    "ccelPrefix",
    "ccelNumber",
    "webchatId",
    "auiExt",
    "includeWebchatId",
    "includeAuiExt",
  ]);

  // Clear only call-related fields
  Object.values(els).forEach(el => {
    if (!el || !el.id) return;
    if (preserveIds.has(el.id)) return; // keep Settings

    if (el.tagName === "SELECT") el.selectedIndex = 0;
    else if (el.type === "checkbox") el.checked = false;
    else el.value = "";
  });

  // Clear pass/fail blocks and selections
  clearPassFailSelections();
  passLabel && passLabel.classList.add("hidden");
  passBlock && passBlock.classList.add("hidden");
  failLabel && failLabel.classList.add("hidden");
  failBlock && failBlock.classList.add("hidden");

  // Hide agent fields & set indicator back to red ✖ and hide "Other" specify
  updateAgentFields();
  updateSecurityIndicator();

  updateNotes();
  toast("Call reset.");
}

// ---------- Reset Settings ----------
function resetSettings() {
  // Clear localStorage keys used by Settings
  ["officerName","ccelPrefix","ccelNumber","webchatId","auiExt","includeWebchatId","includeAuiExt"]
    .forEach(k => localStorage.removeItem(k));

  // Restore defaults & reflect in UI
  if (els.officerName) els.officerName.value = "";
  if (introOfficerName) introOfficerName.textContent = "[Name]";
  if (els.ccelPrefix) els.ccelPrefix.value = "CCEL-";
  if (els.ccelNumber) els.ccelNumber.value = "";
  if (els.webchatId) els.webchatId.value = "";
  if (els.auiExt) els.auiExt.value = "";
  if (els.includeWebchatId) els.includeWebchatId.checked = false;
  if (els.includeAuiExt) els.includeAuiExt.checked = false;

  updateNotes();
  toast("Settings reset.");
}

// ---------- CCEL Number stepper ----------
function bumpCcelNumber(delta) {
  if (!els.ccelNumber) return;
  const raw = els.ccelNumber.value.trim();
  const current = raw === "" ? 0 : parseInt(raw, 10);
  const next = Math.max(0, current + delta); // clamp to 0+
  els.ccelNumber.value = String(next);
  saveSettings();
  updateNotes();
}

// ---------- Init ----------
document.addEventListener("DOMContentLoaded", () => {
  loadSettings();

  // Initial UI state
  updateAgentFields();
  updateSecurityDetailsBlocks(); // also sets indicator
  updateNotes(); // guarantees base notes & disclaimer visible

  // Save settings as you type / change
  els.officerName?.addEventListener("input", saveSettings);
  els.ccelPrefix?.addEventListener("input", saveSettings);
  els.ccelNumber?.addEventListener("input", saveSettings);

  els.webchatId?.addEventListener("input", saveSettings);
  els.auiExt?.addEventListener("input", saveSettings);
  els.includeWebchatId?.addEventListener("change", () => { saveSettings(); updateNotes(); });
  els.includeAuiExt?.addEventListener("change", () => { saveSettings(); updateNotes(); });

  // CCEL stepper
  els.ccelNumDec?.addEventListener("click", () => bumpCcelNumber(-1));
  els.ccelNumInc?.addEventListener("click", () => bumpCcelNumber(+1));

  // Relation & Security changes
  els.relation?.addEventListener("change", () => { updateAgentFields(); updateNotes(); });
  els.relationOther?.addEventListener("input", updateNotes);
  els.securityResult?.addEventListener("change", () => { updateSecurityDetailsBlocks(); updateNotes(); });

  // Field changes -> update notes
  document.querySelectorAll("input, select, textarea").forEach(el => {
    el.addEventListener("input", updateNotes);
    el.addEventListener("change", updateNotes);
  });

  // Copy buttons per-field
  document.querySelectorAll(".copy-btn[data-copy-target]").forEach(btn => {
    btn.addEventListener("click", () => {
      const targetId = btn.getAttribute("data-copy-target");
      const el = document.getElementById(targetId);
      copyText(el?.value || "");
    });
  });

  // Copy CCEL/AUI notes
  document.querySelectorAll(".copy-note").forEach(btn => {
    btn.addEventListener("click", () => {
      const which = btn.getAttribute("data-note");
      const text = which === "ccel" ? ccelNoteOut?.value : auiNoteOut?.value;
      copyText(text || "");
    });
  });

  // Quick Template controls (Append unchecked by default)
  const applyBtn = document.getElementById("applyTemplateBtn");
  const clearBtn = document.getElementById("clearTemplateBtn");
  applyBtn?.addEventListener("click", () => {
    const sel = els.briefTemplateSelect?.value;
    if (!sel) return toast("Select a template first.");
    insertBriefTemplate(sel, !!els.briefTemplateAppend?.checked);
  });
  clearBtn?.addEventListener("click", () => {
    if (els.brief) els.brief.value = "";
    if (els.briefTemplateSelect) els.briefTemplateSelect.selectedIndex = 0;
    if (els.briefTemplateAppend) els.briefTemplateAppend.checked = false;
    updateNotes();
    toast("Brief cleared.");
  });

  // Reset Call
  resetBtn?.addEventListener("click", resetCall);

  // Reset Settings
  resetSettingsBtn?.addEventListener("click", resetSettings);
});
