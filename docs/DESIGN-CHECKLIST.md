# MonoCode design checklist

MonoCode is the reference interface. botdesk extends that interface; it does not introduce a second visual system. Visual drift is a defect.

## Reuse these real repository paths

- App shell and navigation: `src/app/shell/Sidebar.tsx`, `src/app/shell/TitleBar.tsx`, `src/app/shell/ProjectRail.tsx`, `src/app/shell/RailAction.tsx`.
- Desk rail and chat agents: `src/features/botdesk/DeskRail.tsx`, `src/features/botdesk/ChatAgents.tsx`, `src/features/botdesk/botdesk.css`.
- Projects and chat list: `src/features/projects/model/projectGroups.ts`, `src/features/projects/model/recents.ts`, `src/app/shell/Sidebar.tsx`.
- Conversation surface: `src/features/sessions/ui/AgentTranscript.tsx`, `src/features/sessions/ui/Composer.tsx`, `src/features/sessions/ui/SessionPane.tsx`.
- Right-side panels: `src/features/monos/ui/MonoSidebar.tsx`, `src/features/monos/ui/MonoDetails.tsx`, `src/features/monos/ui/MonoActivityPanel.tsx`, `src/features/monos/ui/MonoChangesPanel.tsx`.
- Shared controls: `src/shared/ui/SecondaryButton.tsx`, `src/shared/ui/Modal.tsx`, `src/shared/ui/Popover.tsx`, `src/shared/ui/icons.tsx`.
- Reordering and panes: `src/shared/hooks/useSortable.ts`, `src/features/workspace/ui/PaneTree.tsx`, `src/features/workspace/ui/SurfaceTabs.tsx`.
- Theme, typography, spacing, focus, selection, and color tokens: `src/styles/index.css`. Use `--color-background-base`, `--color-content`, `--color-stroke`, `--color-accent`, and the existing font variables; do not fork them into botdesk-only equivalents.

## Pull-request checks

- [ ] The change begins with the closest existing component above; a new component is justified by behavior, not styling convenience.
- [ ] Sidebar rows keep the existing density, hit areas, truncation, selected state, and hierarchy.
- [ ] New chat/group controls live in the existing sidebar instead of a new dashboard or marketing surface.
- [ ] Browser, image, activity, and detail tools use the existing right-side panel and split-pane behavior.
- [ ] Colors come from existing tokens. Status is not communicated by color alone.
- [ ] Typography, icon size, radii, borders, and spacing match adjacent MonoCode controls.
- [ ] Keyboard order, focus visibility, labels, screen-reader names, and Escape/close behavior work.
- [ ] Motion respects `prefers-reduced-motion`; loading indicators do not cause layout shift.
- [ ] Light and dark themes, narrow widths, long titles, empty/loading/error states, and 200% text sizing were checked where relevant.
- [ ] Before/after screenshots use the same data state, viewport, theme, and scale.
- [ ] A reviewer can compare the result directly with the existing MonoCode screen and find no unexplained visual drift.
- [ ] No CI, runner, release, deployment, authentication, sync, or other plumbing work was added unless the chosen issue is demonstrably blocked by it.

If infrastructure is genuinely blocking the issue, stop and record the blocker. Do not widen a UI issue into infrastructure work.
