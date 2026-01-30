You are my senior frontend engineer working inside my existing Vue 3 + Vite + Tailwind project (already set up and running). Build a small, clean, frontend-only interactive web app that visualizes True RNG vs Pseudo-Random Distribution (PRD) for Dota-style proc mechanics.

IMPORTANT PROCESS
- Do not dump a giant amount of code in one message.
- First: propose a short Phase 1 (MVP) plan and Phase 2 (polish) plan.
- Then implement Phase 1 only.
- After Phase 1 is complete, stop and ask me if I want you to proceed to Phase 2.

PRODUCT GOAL
Help users instantly understand how “True RNG” differs from “PRD” by simulating procs over many trials and visualizing the distribution. This is primarily an educational tool and should feel professional and technical.

TECH STACK / CONSTRAINTS
- Vue 3 + Vite + Tailwind (already installed and configured)
- Charting: Chart.js (use a Vue-friendly integration if needed, but keep it simple)
- Frontend-only: no backend, no accounts, no persistence
- Keep the simulation logic in a pure, testable module (no DOM access), and have the UI call into it.
- Performance: handle up to 100k trials without freezing the UI. Start with chunked computation (batched loops with yielding to the event loop). Only introduce Web Workers if chunking is insufficient.

VISUAL / UI DIRECTION
- Dark themed, clean, minimal, technical style
- Main content centered on screen with generous spacing
- Sleek, professional typography
- Smooth transitions when switching modes and when graphs update (subtle fade/slide)
- Minimal UI elements, no clutter, no long paragraphs
- Use small helper text/tooltips where needed

CORE UI (SINGLE PAGE)
Centered container with three sections:

1) Controls (top)
- Mode toggle: True RNG vs PRD
- Inputs:
  - Proc chance (%) numeric input
  - Trials count selector (1k / 10k / 100k)
  - Optional: seed input (for reproducibility). If seed is implemented, runs with the same seed must be deterministic.
- Run button
- Loading/progress indicator (especially for 100k)

2) Presets (small list)
Add exactly 3 preset buttons/cards:
- Roshan Bash - Proc chance 15%
- Maelstrom Chain Lightning - Proc chance 25%
- Juggernaut Blade Dance - Proc chance 35%

Clicking a preset sets the proc chance input accordingly (and any PRD parameter if applicable), and should feel instant.

3) Results (main)
- Chart.js bar chart (histogram) showing the distribution of “proc occurred on attempt N”
  - X axis: attempt number (1..N)
  - Y axis: count or percent of trials
  - Use a sensible cap for attempts shown (ex: show attempts 1..30, bucket everything beyond into “30+”)
- Summary stats below the chart:
  - average attempts-to-proc
  - median attempts-to-proc
  - 90th percentile attempts-to-proc
  - max attempts observed (max drought)
  - percent of procs on first attempt (optional)

MODE BEHAVIOR REQUIREMENTS
- True RNG: each attempt independent with probability p.
- PRD: probability ramps up after failures and resets on success.
- For Phase 1: prioritize having the PRD mode working as a PRD concept demonstration.
  - If accurate Dota C-values are not available yet, implement PRD with a configurable parameter (C) internally and label the PRD output as “PRD (generic)” in the UI.
  - Do NOT present “exact Dota PRD values” unless you are confident and can point to where they were sourced from.
  - The key is that the PRD histogram shape should visibly differ from True RNG for the same proc chance.

CHART / UX REQUIREMENTS
- Smooth chart updates (no jarring redraw). If necessary, re-create the chart instance cleanly but with a fade transition.
- Keep the chart readable: clear axis labels, minimal gridlines, no noisy colors.
- Dark mode styling should be consistent across inputs, buttons, and chart area.

DELIVERABLES FOR PHASE 1 (MVP)
- Single-page app with:
  - mode toggle
  - proc chance input
  - trials selection
  - run button + loading/progress
  - 3 preset buttons
  - histogram bar chart via Chart.js
  - summary stats
- Responsiveness: should work on desktop widths cleanly and not look broken on smaller screens.
- Performance: 10k runs should be quick; 100k should be acceptable with progress and no full UI freeze.

PHASE 2 IDEAS (DO NOT IMPLEMENT UNTIL I CONFIRM)
After Phase 1, propose Phase 2 options like:
- web worker for simulations
- a “timeline strip” visualization for one run
- better chart tooltips
- URL query params to share settings
- optional seeded RNG improvements
- adding verified C-values and switching PRD label from “generic” to “Dota-accurate” only when verified

STOP CONDITION
After you complete Phase 1, stop and ask: “Do you want me to proceed to Phase 2?” Do not continue automatically.
