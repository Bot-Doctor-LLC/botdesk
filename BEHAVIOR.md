# Desktop prototype behavior contract

1. The installed app identifies as botdesk and uses a separate data directory from MonoCode.
2. Creating a named desk and choosing a project exposes that desk and its project. Reopening the app preserves them. No mock clients are seeded.
3. A chat shows its selected agent. Add agent lists provider CLI availability truthfully and explains the context handoff. An unavailable provider cannot be selected there.
4. Sending a message starts real provider work. Stop and normal native permission controls remain available. Replies and tool output come from the provider.
5. Switching to another available provider keeps the visible conversation, sends a handoff on the next message, and returning resumes the saved provider session when supported. A restart without sending must not lose an armed handoff.
6. Existing files, split panes, previews, terminal commands, and project chat history remain usable.
7. Closing and reopening the app preserves completed chat history; it does not automatically replay a prompt.
8. Native minimum-size layout remains usable with keyboard focus and readable controls. This desktop prototype does not claim a mobile or multi-user client experience.

Use only a task-owned project directory for execution checks. Do not create or change authentication. Report a provider connection as blocked when its existing CLI/account cannot run. No hosted deployment is part of this contract.
