import { useState, useSyncExternalStore } from "react";
import { Plus, X } from "../../shared/ui/icons";
import { HarnessIcon } from "../sessions/ui/HarnessIcon";
import {
  HARNESSES,
  HARNESS_TITLE,
  type HarnessId,
  type Session,
} from "../sessions/model/session";
import { defaultModelId, resolveModel } from "../sessions/model/models";
import { isPreparingHandoff } from "../sessions/model/handoff";
import {
  getHarnessAvailabilitySnapshot,
  hasProbedHarnessAvailability,
  isHarnessAvailable,
  subscribeHarnessAvailability,
} from "../../integrations/harness/core/availabilityState";
import { chatParticipants, savedChatParticipant } from "./participants";

type Props = {
  session: Session;
  onSelect: (id: string, harness: HarnessId, model: string) => void;
};

export function ChatAgents({ session, onSelect }: Props) {
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");
  useSyncExternalStore(
    subscribeHarnessAvailability,
    getHarnessAvailabilitySnapshot,
  );
  const locked = !!session.busy || isPreparingHandoff(session);
  let participants;
  try {
    participants = chatParticipants(session);
  } catch {
    participants = [session];
  }
  const select = (id: HarnessId) => {
    try {
      const previous = savedChatParticipant(session, id);
      onSelect(session.id, id, previous?.model ?? defaultModelId(id));
      setAdding(false);
      setError("");
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "The agent could not be selected.",
      );
    }
  };
  return (
    <section className="botdesk-chat-agents" aria-label="Agents in this chat">
      <div className="botdesk-agent-row">
        <span className="botdesk-you">You</span>
        <span className="botdesk-agent-divider" aria-hidden="true" />
        {participants.map((entry) => (
          <button
            key={entry.harness}
            type="button"
            className="botdesk-agent"
            aria-pressed={entry.harness === session.harness}
            disabled={
              locked ||
              (hasProbedHarnessAvailability() &&
                !isHarnessAvailable(entry.harness))
            }
            title={
              entry.harness === session.harness
                ? resolveModel(entry.harness, session.model).name
                : `Continue with ${HARNESS_TITLE[entry.harness]}`
            }
            onClick={() => select(entry.harness)}
          >
            <HarnessIcon harness={entry.harness} className="size-4" />
            {HARNESS_TITLE[entry.harness]}
            {entry.harness === session.harness ? (
              <span className="botdesk-agent-state">
                {session.busy ? "Working" : "Selected"}
              </span>
            ) : null}
          </button>
        ))}
        <button
          type="button"
          className="botdesk-add-agent"
          disabled={locked}
          aria-expanded={adding}
          onClick={() => setAdding(!adding)}
        >
          <Plus className="size-3.5" />
          Add agent
        </button>
      </div>
      {adding ? (
        <div className="botdesk-agent-picker">
          <div className="botdesk-picker-heading">
            <strong>Bring an agent into this chat</strong>
            <button
              type="button"
              aria-label="Close agent picker"
              onClick={() => setAdding(false)}
            >
              <X className="size-4" />
            </button>
          </div>
          <p>
            The selected agent receives a handoff brief when you send your next
            message. Agents take turns in this shared conversation.
          </p>
          <div className="botdesk-agent-options">
            {HARNESSES.filter(
              (id) => !participants.some((entry) => entry.harness === id),
            ).map((id) => {
              const installed = isHarnessAvailable(id),
                probed = hasProbedHarnessAvailability();
              return (
                <button
                  type="button"
                  key={id}
                  disabled={!installed}
                  onClick={() => select(id)}
                >
                  <HarnessIcon harness={id} className="size-4" />
                  <span>{HARNESS_TITLE[id]}</span>
                  <small>
                    {probed
                      ? installed
                        ? "CLI available"
                        : "Not installed"
                      : "Checking…"}
                  </small>
                </button>
              );
            })}
          </div>
          <p className="botdesk-picker-footnote">
            CLI availability does not confirm account access. Manage accounts
            and remote connections in Settings.
          </p>
        </div>
      ) : null}
      {session.pendingSwitch ? (
        <p className="botdesk-handoff-notice">
          Next message: share a brief from{" "}
          {HARNESS_TITLE[session.pendingSwitch.from]} with{" "}
          {HARNESS_TITLE[session.harness]}.
        </p>
      ) : null}
      {error ? <p role="alert">{error}</p> : null}
    </section>
  );
}
