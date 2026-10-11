## One issue

Closes #N

> Replace N with exactly one issue number. A pull request that closes zero or multiple issues is not ready for review.

## What changed

<!-- Describe only the change required by that issue. -->

## Before / after

<!-- Both are required for any user-visible change. Use the same state, viewport, theme, and scale. -->

| Before | After |
|---|---|
| <!-- image --> | <!-- image --> |

- [ ] A before screenshot is attached.
- [ ] An after screenshot is attached.

## Verification

<!-- List exact commands and manual checks, with results. -->

## MonoCode design checklist

Full reference: [`docs/DESIGN-CHECKLIST.md`](../docs/DESIGN-CHECKLIST.md)

- [ ] I started from an existing MonoCode component or pattern and named it in the PR.
- [ ] Layout, density, spacing, typography, colors, focus, and motion match the existing shell.
- [ ] New screens reuse the repository components and tokens listed in the checklist.
- [ ] Keyboard, screen-reader, reduced-motion, narrow-width, empty, loading, and error states were checked where relevant.
- [ ] Before/after screenshots use the same state, viewport, theme, and scale.
- [ ] Any visual drift is fixed or explicitly justified by the issue.
- [ ] This PR contains no unrelated infrastructure, workflow, runner, release, or deployment work.

## Scope check

- [ ] This PR addresses exactly the single issue named above.
- [ ] No client/private data, credentials, environment-specific identifiers, or machine paths were added.
- [ ] I did not merge this PR; review and merge remain owner actions.
