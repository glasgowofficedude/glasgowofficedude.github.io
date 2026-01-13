
:root {
  --bg: #0f1115;
  --card: #161a22;
  --muted: #8b97a7;
  --text: #e6edf3;
  --accent: #4f8cff;
  --accent-2: #2ecc71;
  --danger: #ff6b6b;
  --border: #2a2f3a;
  --mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
  --radius: 10px;
}
* { box-sizing: border-box; }
html, body {
  margin: 0;
  padding: 0;
  background: var(--bg);
  color: var(--text);
  font-family: system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, "Helvetica Neue", Arial, "Noto Sans", "Apple Color Emoji", "Segoe UI Emoji";
}

/* Header */
.app-header {
  padding: 24px 20px 12px;
  border-bottom: 1px solid var(--border);
}
.app-header h1 { margin: 0; font-size: 1.6rem; }
.subtitle { margin: 6px 0 0; color: var(--muted); }

/* Card */
.card {
  margin: 16px 20px;
  padding: 16px;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
}

/* Details (collapsible sections) */
details > summary.details-summary {
  cursor: pointer;
  font-weight: 600;
  list-style: none;
}
details > summary.details-summary::-webkit-details-marker { display: none; }
.details-summary::after { content: "▾"; margin-left: 8px; color: var(--muted); }
details[open] > summary.details-summary::after { content: "▴"; }
.details-summary:hover { color: var(--accent); }
.details-content { margin-top: 8px; }
.hint { color: var(--muted); font-size: 0.9rem; }

/* Grid layout for form rows */
.grid {
  display: grid;
  grid-template-columns: 220px 1fr;
  gap: 12px 16px;
  align-items: center;
}
.grid label { color: var(--muted); }

/* Inputs */
input, select, textarea {
  width: 100%;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid var(--border);
  background: #0c0f14;
  color: var(--text);
  outline: none;
}
input::placeholder, textarea::placeholder { color: #6f7885; }

/* Input + Copy button row */
.input-with-copy {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 8px;
  align-items: center;
}

/* Buttons */
.copy-btn, .copy-note, .secondary, .primary {
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid var(--border);
  background: #11151b;
  color: var(--text);
  cursor: pointer;
}
.copy-btn:hover, .copy-note:hover, .primary:hover {
  border-color: var(--accent);
  color: var(--accent);
}
.secondary { color: var(--muted); }
.secondary:hover { color: var(--danger); border-color: var(--danger); }
.actions { margin-top: 12px; }

/* Notes area */
.note-block { margin-top: 12px; }
.note-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.note-actions button { margin-left: 8px; }
.mono { font-family: var(--mono); white-space: pre-wrap; }
.small { font-size: 0.9rem; color: var(--muted); }

/* Footer */
.app-footer {
  padding: 16px 20px 24px;
  color: var(--muted);
  border-top: 1px solid var(--border);
}

/* Conditional blocks */
.agent-only { display: none; } /* default: hidden */
.agent-only.show { display: contents; } /* shown when JS adds .show */
.hidden { display: none !important; }

/* Checklist styling */
.checklist {
  display: grid;
  grid-template-columns: 1fr;
  gap: 8px;
}
.checklist label { color: var(--text); }

/* Security indicator */
.security-label {
  display: flex;
  align-items: center;
  gap: 8px;
}
.sec-indicator {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  font-size: 14px;
  line-height: 1;
  border-radius: 50%;
  border: 1px solid var(--border);
  user-select: none;
}
.sec-indicator.warn { background: var(--danger); color: #0c0f14; }
.sec-indicator.ok { background: var(--accent-2); color: #0c0f14; }

/* Brief templates row */
.template-row {
  display: grid;
  grid-template-columns: 1fr auto auto auto;
  gap: 8px;
  align-items: center;
}
.checkbox-inline {
  display: inline-flex;
  gap: 6px;
  align-items: center;
  color: var(--muted);
}

/* Settings helpers */
.settings-inline {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 8px;
  align-items: center;
}

/* CCEL row (Prefix + Number stepper) */
.ccel-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}
.stepper {
  display: grid;
  grid-template-columns: 1fr auto auto; /* number | – | + */
  gap: 8px;
  align-items: center;
}
.stepper .primary, .stepper .secondary {
  min-width: 40px;
}

/* Responsive */
@media (max-width: 700px) {
  .grid { grid-template-columns: 1fr; }
  .template-row { grid-template-columns: 1fr auto auto; }
  .ccel-row { grid-template-columns: 1fr; }
}

