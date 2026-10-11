# botdesk design

MonoCode is the interface reference for botdesk. Preserve its compact native controls, resizable panes, dark and light themes, readable transcript, code editors, accessibility behavior, and keyboard model.

botdesk adds a narrow desk rail, lowercase botdesk identity, and an agent toolbar inside each conversation. Projects and chats remain in the existing sidebars. Files and previews use existing split panes; terminals use the existing dock. No marketing sections or dashboard metrics.

The new surfaces inherit `--color-background-base`, `--color-content`, and `--color-stroke`. Selected desk and agent controls use muted amber `#d3ac70`, with `#211b13` text on filled primary controls. Body and controls use the existing native sans font. Code retains upstream monospace styling. Agent chips have 7px corners; desk initials have 10px corners. Focus outlines use the same amber.

Actual agent status comes from the runtime. Desks are local project groups, not a claim of client isolation. Agent handoffs state what context will be shared before sending.

The concrete component map and review criteria are in [docs/DESIGN-CHECKLIST.md](docs/DESIGN-CHECKLIST.md). Any deliberate departure needs an issue-specific explanation and equivalent accessibility coverage.
