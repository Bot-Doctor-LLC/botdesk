# botdesk roadmap

This is the product order for the public repository. The rule underneath every item is simple: keep the MonoCode operating interface and add useful communication and coordination features without turning product work into another infrastructure project.

**Baseline.** `main` is MonoCode (upstream `1ef5357`) plus one small botdesk layer: lowercase app identity, a narrow desk rail that groups local projects, and an agent toolbar inside each chat with explicit provider handoffs and per-chat provider session continuity. An earlier botdesk line drifted away from the MonoCode baseline and was retired; features that existed only there are not on `main` and must be rebuilt on this base. In particular, **items 4 and 5 are not yet on the new `main`** and need to be rebuilt on the MonoCode base.

## 1. Preserve the MonoCode interface across desktop and web

**Status: Baseline in place.** `main` is the MonoCode desktop with a minimal botdesk layer, so the desktop interface matches the reference by construction. A web surface and desktop/web parity are not part of this repository yet.

Deacon's direction was explicit: “Keep the MonoCode interface” and “the app is now drifting too far away from the monocode baseline.” Treat visual drift as a defect. New botdesk surfaces should look and behave like they belong inside the existing shell, not like a separate dashboard product.

Source: session `rollout-2026-10-10T12-41-32`, Oct 10, 5:52 PM CT; session `rollout-2026-10-09T11-36-02`, Oct 9, 3:55 PM CT.

## 2. Add new chats and group chats in the existing sidebar

**Status: Not shipped.** `main` lets several agent providers take turns in one chat through the agent toolbar, but there is no New group chat flow for people and no shared conversations.

“Add new chats and group chats in the existing sidebar. Show me something useful in the app instead of more setup.” Keep creation close to the chat list, reuse the existing composer and session flows, and open the created chat immediately.

Source: session `rollout-2026-10-10T12-41-32`, Oct 10, 5:52 PM CT.

## 3. Make desks one rearrangeable recent-work list

**Status: Partly shipped.** `main` has a desk rail (`src/features/botdesk/DeskRail.tsx`) that groups local projects into named desks. There is no combined recent list across desks and no drag reordering yet.

Desks should work “almost like projects”: pick one desk or see one combined recent list, without clicking through separate tabs. Reordering should be hold-and-drag, not visible up/down buttons.

Source: session `rollout-2026-10-09T11-36-02`, Oct 9, 4:28 PM CT and 4:29 PM CT; session `rollout-2026-10-09T23-23-46`, Oct 9, 11:23 PM CT.

## 4. Keep the left chat list compact and show real activity

**Status: Not yet on the new `main`; must be rebuilt on the MonoCode base.** A compact recent-chat list with running/finished indicators existed only on the retired line.

“Add more compact chats on the left-hand side” with indicators for “when it's spinning versus when it's done, similar to how Codex has it set up.” Status must come from runtime state, remain readable without color, and respect reduced-motion settings. Start from MonoCode's existing sidebar rows.

Source: session `rollout-2026-10-09T11-36-02`, Oct 9, 11:31 PM CT.

## 5. Continue the same chats across desktop and web

**Status: Not yet on the new `main`; must be rebuilt on the MonoCode base.** Desktop-to-web transcript sync and web follow-ups existed only on the retired line. `main` keeps chats local and preserves provider sessions per chat across restarts; there is no backend or web client in this repository yet.

The first focus was “getting the computer app and the web app on the same page,” followed by the direct instruction: “Also add desktop-to-web chat sync.” A conversation should retain its identity, history, and originating computer instead of becoming a duplicate chat.

Source: session `rollout-2026-10-09T11-36-02`, Oct 9, 1:14 PM CT and 4:34 PM CT.

## 6. Ship mobile first as an installable web companion

**Status: Not shipped.** Depends on item 5.

The product goal includes desktop, phone, and web. The first mobile delivery should be an installable web app that opens recent chats, sends a text follow-up to the originating computer, survives closing the phone, notifies on a saved result, and reopens that exact result. Prove the journey on physical iPhone and Android devices before deciding whether a native shell is necessary.

Source: session `rollout-2026-10-09T11-36-02`, Oct 9, 12:20 PM CT; session `rollout-2026-10-10T12-41-32`, Oct 10, 12:41 PM CT and 3:15 PM CT.

## 7. Give the botdesk plugin the user's real capabilities

**Status: Not shipped in this repository.**

The plugin should let someone work from Codex, Claude, Hermes, or another preferred interface while accessing authorized project context and updating the desk as that user. Deacon's boundary was: it “needs to pretty much have access to everything the user has access to” and “take every action a user could take,” not only send messages. Authorization and confirmations must still be explicit.

Source: session `rollout-2026-10-09T15-24-20`, Oct 9, 3:30 PM CT, 3:35 PM CT, 5:50 PM CT.

## 8. Use botdesk.work and lowercase botdesk everywhere

**Status: Partly shipped.** The Tauri product name, window title, macOS menu, bundle identifier, and package name use lowercase `botdesk`, but upstream MonoCode naming remains in many UI strings, the crate/binary names, and storage keys.

The purchased domain is `botdesk.work`; the app should be a separate product and “the botdesk is all lowercase.” Normalize product copy, links, and application metadata without erasing required upstream attribution.

Source: session `rollout-2026-10-09T10-42-04`, Oct 9, 10:42 AM CT and 10:43 AM CT.

## 9. Open browser and image tools in the existing right side

**Status: Not shipped as a botdesk flow.** MonoCode has reusable right-side panels and split panes, but the requested botdesk launcher and tool set are not on `main`.

Use the existing top-right control and panel language for a right sidebar that can show a browser, images, and later tools. Do not invent another full-screen dashboard or compress the main conversation.

Source: session `rollout-2026-10-09T14-09-47`, Oct 9, 2:49 PM CT.

## 10. Explore sandboxed shared compute after the core app is useful

**Status: Parked.** This is later architecture work, not a prerequisite for the chat/sidebar/mobile sequence above.

The long-term idea is a project compute pool: a member can add a computer, another authorized member can steer work from a phone, and execution runs in a scoped, capped, sandboxed environment. It must never silently move an existing conversation to another executor.

Source: session `rollout-2026-10-09T11-36-02`, Oct 9, 12:27 PM CT and 12:28 PM CT.

## Contradictions / unclear

- “Mobile first” means the first **mobile** implementation is an installable web app. It does not override the earlier instruction to align desktop and web before building mobile.
- Deacon wants agent messages to feel immediate and objected to sluggish “queued” UX, while the mobile contract requires truthful queued, starting, running, interrupted, and result-syncing states. The interface needs immediate acknowledgement without claiming execution or completion too early.
- Full plugin control is a product goal, but the exact destructive actions, confirmation rules, audit trail, and per-desk permission boundaries are not yet specified.
- The first mobile version assumes the originating computer stays available. Running while that computer sleeps would require the separate shared-compute decision in item 10.
- Desks on `main` are local project groups, not access control. Shared desks need backend authorization before any multi-user feature ships.
