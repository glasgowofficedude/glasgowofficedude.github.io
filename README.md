# glasgowofficedude.github.io
Note taking tool for AOs in VAT

VAT Helpline – Quality Notes Tool
Overview
The VAT Helpline Quality Notes Tool is a lightweight, browser-based application designed for administrative officers handling VAT-related calls. It streamlines note-taking during customer interactions, ensuring compliance, accuracy, and speed without relying on external servers. Built with HTML, CSS, and vanilla JavaScript, this tool runs entirely locally for maximum security.

Key Features


Structured Call Intake
Capture essential details such as:

VRN (VAT Registration Number)
Business Name & Address
Caller Name & Phone Number
Relation to Business (with dynamic agent fields)
Security status (Pass/Fail) with detailed verification reasons



Security Indicator
Visual cue for compliance:

Red ✖ when security is pending or failed
Green ✔ when security is passed
Auto-reset on new call



Dynamic Agent Fields
Agent-specific fields (Agency Name, Address, Agent Ref) appear only when Relation = Agent.


Quick Templates for Brief
Predefined progress-chasing templates for common VAT queries:

Insert with one click
Optional Append mode
Clear button resets Brief and template selection



Auto-Generated Notes
Two ready-to-copy formats:

CCEL Note (Detailed) – Comprehensive record for internal systems
AUI Note (Simplified) – Condensed summary for quick reference
Both include mandatory disclaimer and dynamically populated call details



Copy Buttons Everywhere
One-click copy for:

Individual fields
Full CCEL or AUI notes



Reset Function
Clears all call data while preserving officer settings.


Offline & Secure
Runs entirely in the browser; no data leaves your machine.
This little tool does not record any of the activities after hitting "Reset Call" all info is cleared.


Why Use This Tool?

Compliance: Ensures mandatory disclaimer and security checks are always documented.
Efficiency: Reduces repetitive typing with templates and copy buttons.
Accuracy: Auto-generates structured notes from captured data.
Privacy: No external dependencies; works offline.


Tech Stack

HTML5 for structure
CSS3 for responsive, accessible UI
Vanilla JavaScript for dynamic behavior and local persistence


How to Run

Clone or download the files.
Open index.html in any modern browser.
Start taking calls and generating notes instantly.
(You can run this tool locally as well just download the index, script and style files in the same folder and start it up by double clicking index.)

Future Enhancements

Export notes as TXT/PDF
Add searchable template list
Keyboard shortcuts for power users
PWA support for offline installation
