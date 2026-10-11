# Architecture and security boundary

The React/Vite frontend renders the desktop interface. Tauri provides the native shell and local capabilities. Host processes run supported agent harnesses and retain local session state. The botdesk layer lives in `src/features/botdesk/` (desk rail, chat agent toolbar, per-chat participant and provider-session storage) and hooks into the existing session store and shell.

This snapshot has no backend: chats, desks, and provider sessions are stored locally. Desks are local project groups and do not authorize anything. The Tauri CSP allows only local IPC/asset origins and a few public image hosts inherited from MonoCode. The updater has no endpoints or key. Release signing and artifact credentials are outside this repository and must never be exposed to pull-request workflows.
