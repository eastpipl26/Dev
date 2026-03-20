---
description: How to safely start the dev server (Vite)
---
# Safe Dev Server Startup Protocol

When starting or restarting a Vite development server, always follow these critical rules to avoid port collision, caching issues, or zombie processes:

1. **Check Existing Processes**: Verify if there's an existing `npm run dev` process running in the background (e.g., hanging on port 5173). 
2. **Assign Explicit Ports**: If a new server must be started because the old one is hung or serving a stale cache, ALWAYS assign a completely new and explicit port (e.g., `npm run dev -- --port 5175 --open`). Do not rely on Vite's auto-incrementing ports silently masking the issue.
3. **Terminate Old Instances**: Send a termination signal to any previous `run_command` instances of `npm run dev` you created to actively manage system resources and free up ports.
4. **Refresh Notification**: When making massive overwrites to major configuration files (`tailwind.config.js`, `vite.config.js`, or the entire `App.jsx`), HMR connections may permanently break. ALWAYS immediately advise the user to perform a hard refresh (`Ctrl + Shift + R`) or explicitly inform them about potential stale cache.
