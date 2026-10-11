# botdesk

botdesk is a desktop workspace built on MonoCode for working with coding and general agents in persistent conversations. Desks organize local projects. Each project retains chats, files, previews, changes, and terminals. Agents take turns in a chat, with explicit context handoffs and provider-native session continuity.

This release runs on the user's computer and uses existing provider CLIs. Local desk grouping is not tenant authorization. Hosted botdesk, shared human messaging, desktop/web sync, remote runtimes, provider credentials, and production services are outside this snapshot. No account or remote connection is represented as authenticated merely because its CLI exists.

The primary journey is to open a project, talk to an agent, invite another provider into the same conversation, inspect its work, and return after closing the application. The first provider choices are Hermes Agent, Codex, and Claude Code. Existing MonoCode provider support remains available.

The product order and acceptance criteria live in [ROADMAP.md](ROADMAP.md). Upstream source: [MonoCode](https://github.com/hardbeat920/monocode) at `1ef5357`.
