import {
  saveLastModelChoice,
  saveLastModelSettings,
} from "../sessions/model/models";
import {
  saveGridArcadeEnabled,
  saveMonosEnabled,
} from "../settings/model/settings";

export function initializeBotdesk(): void {
  if (localStorage.getItem("botdesk.initialized")) return;
  saveLastModelChoice("codex", "codex:gpt-6-astra");
  saveLastModelSettings({ reasoningEffort: "low" });
  saveGridArcadeEnabled(false);
  saveMonosEnabled(false);
  localStorage.setItem("monocode.githubStarPrompt.dismissed.v1", "1");
  localStorage.setItem("botdesk.initialized", "1");
}
