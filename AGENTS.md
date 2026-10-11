# Repository instructions

## One issue per Codex chat

Before planning or editing, every Codex chat must read:

1. `ROADMAP.md`
2. `docs/DESIGN-CHECKLIST.md`
3. The one GitHub issue assigned to that chat

Take exactly one issue. Do not combine related issues, opportunistic cleanup, or infrastructure work.

Create a dedicated branch named `issue-<number>-<short-slug>`, for example:

```text
issue-12-chat-list-indicators
```

Implement only that issue, run the relevant local tests, and capture before/after screenshots for user-visible changes. Open a pull request with `.github/pull_request_template.md`; its `Closes #N` line must name exactly the one issue.

Do not merge pull requests. Do not change CI, workflows, runners, releases, deployment, billing, or repository settings. If the issue is blocked by infrastructure, document the blocker and stop instead of changing the infrastructure.

Preserve the MonoCode interface. Reuse existing components and tokens. Treat unexplained visual drift as a defect. Never add credentials, client/private data, environment-specific identifiers, or local machine paths to the repository.
