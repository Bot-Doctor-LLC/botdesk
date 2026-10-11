import {
  HARNESSES,
  sessionWorkCwd,
  type HarnessId,
  type PendingHarnessSwitch,
  type Session,
} from "../sessions/model/session";

export type ChatParticipant = {
  harness: HarnessId;
  model: string;
  modelSettings: Record<string, string>;
  cwd: string;
  providerSessionId?: string;
  providerAccountId?: string;
};

type ChatAgents = {
  participants: ChatParticipant[];
  selection?: { harness: HarnessId; pending: PendingHarnessSwitch };
};

const key = (id: string) => `botdesk.chat-agents.${id}`;

function record(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function harness(value: unknown): HarnessId | undefined {
  return HARNESSES.find((id) => id === value);
}

function settings(value: unknown): Record<string, string> {
  return record(value)
    ? Object.fromEntries(
        Object.entries(value).filter(
          (entry): entry is [string, string] => typeof entry[1] === "string",
        ),
      )
    : {};
}

function participant(value: unknown): ChatParticipant | undefined {
  if (!record(value)) return;
  const id = harness(value.harness);
  if (!id || typeof value.model !== "string" || typeof value.cwd !== "string")
    return;
  return {
    harness: id,
    model: value.model,
    cwd: value.cwd,
    modelSettings: settings(value.modelSettings),
    ...(typeof value.providerSessionId === "string"
      ? { providerSessionId: value.providerSessionId }
      : {}),
    ...(typeof value.providerAccountId === "string"
      ? { providerAccountId: value.providerAccountId }
      : {}),
  };
}

function read(id: string): ChatAgents {
  if (typeof localStorage === "undefined") return { participants: [] };
  const raw = localStorage.getItem(key(id));
  if (!raw) return { participants: [] };
  const value: unknown = JSON.parse(raw);
  if (!record(value) || !Array.isArray(value.participants))
    throw new Error("The saved chat agents could not be read.");
  const participants = value.participants.flatMap((item: unknown) => {
    const parsed = participant(item);
    return parsed ? [parsed] : [];
  });
  const selection = value.selection;
  if (record(selection) && record(selection.pending)) {
    const to = harness(selection.harness),
      from = harness(selection.pending.from);
    const pending = selection.pending;
    if (to && from && typeof pending.fromModel === "string") {
      return {
        participants,
        selection: {
          harness: to,
          pending: {
            from,
            fromModel: pending.fromModel,
            fromSettings: settings(pending.fromSettings),
            ...(typeof pending.fromProviderSessionId === "string"
              ? { fromProviderSessionId: pending.fromProviderSessionId }
              : {}),
            ...(typeof pending.fromProviderAccountId === "string"
              ? { fromProviderAccountId: pending.fromProviderAccountId }
              : {}),
            ...(pending.skipOutgoingRecap === true
              ? { skipOutgoingRecap: true }
              : {}),
          },
        },
      };
    }
  }
  return { participants };
}

export function chatParticipants(session: Session): ChatParticipant[] {
  const saved = read(session.id).participants.filter(
    (entry) => entry.cwd === sessionWorkCwd(session),
  );
  const current = participant({ ...session, cwd: sessionWorkCwd(session) });
  return current
    ? [...saved.filter((entry) => entry.harness !== current.harness), current]
    : saved;
}

export function savedChatParticipant(
  session: Session,
  target: HarnessId,
): ChatParticipant | undefined {
  return read(session.id).participants.find(
    (entry) =>
      entry.harness === target && entry.cwd === sessionWorkCwd(session),
  );
}

export function rememberChatSession(session: Session): void {
  if (typeof localStorage === "undefined") return;
  const saved = read(session.id);
  const current = participant({ ...session, cwd: sessionWorkCwd(session) });
  if (!current) return;
  // An armed selection has not spoken yet. Keep the outgoing native thread too.
  const pending = session.pendingSwitch;
  const outgoing = pending
    ? participant({
        harness: pending.from,
        model: pending.fromModel,
        modelSettings: pending.fromSettings,
        cwd: sessionWorkCwd(session),
        providerSessionId: pending.fromProviderSessionId,
        providerAccountId: pending.fromProviderAccountId,
      })
    : undefined;
  for (const entry of [outgoing, current]) {
    if (!entry) continue;
    saved.participants = saved.participants.filter(
      (item) => item.harness !== entry.harness || item.cwd !== entry.cwd,
    );
    saved.participants.push(entry);
  }
  const next: ChatAgents = {
    participants: saved.participants,
    ...(pending ? { selection: { harness: session.harness, pending } } : {}),
  };
  localStorage.setItem(key(session.id), JSON.stringify(next));
}

export function restoreChatSelection(session: Session): Session {
  const saved = read(session.id);
  const selection = saved.selection;
  return selection?.harness === session.harness
    ? { ...session, pendingSwitch: selection.pending }
    : session;
}

export function forgetChatParticipants(id: string): void {
  if (typeof localStorage !== "undefined") localStorage.removeItem(key(id));
}
