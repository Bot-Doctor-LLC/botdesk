import { useEffect, useState } from "react";
import { FolderPlus, Plus, X } from "../../shared/ui/icons";
import { pickFolders } from "../../platform/tauri/fs";
import { pathKey } from "../../shared/lib/paths";
import {
  subscribeProjectPathsChanged,
  type RecentProject,
} from "../projects/model/recents";
import {
  createProjectGroup,
  loadProjectGroups,
  loadProjectGroupAssignments,
  saveProjectGroups,
  setProjectGroupAssignment,
} from "../projects/model/projectGroups";

type Props = {
  cwd: string;
  recents: RecentProject[];
  onSelectProject: (path: string) => void;
};

export function DeskRail({ cwd, recents, onSelectProject }: Props) {
  const [groups, setGroups] = useState(loadProjectGroups);
  const [assignments, setAssignments] = useState(loadProjectGroupAssignments);
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(
    () =>
      subscribeProjectPathsChanged(() => {
        setGroups(loadProjectGroups());
        setAssignments(loadProjectGroupAssignments());
      }),
    [],
  );
  const active = assignments[pathKey(cwd)] ?? "personal";
  const addProject = async (desk: string | null) => {
    setError("");
    setBusy(true);
    try {
      const paths = await pickFolders("Add projects to this desk");
      for (const path of paths) setProjectGroupAssignment(path, desk);
      if (paths[0]) onSelectProject(paths[0]);
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "The project could not be opened.",
      );
    } finally {
      setBusy(false);
    }
  };
  const select = (desk: string) => {
    if (desk === active) return;
    const project = recents.find(
      (entry) => (assignments[pathKey(entry.path)] ?? "personal") === desk,
    );
    if (project) onSelectProject(project.path);
    else void addProject(desk === "personal" ? null : desk);
  };
  return (
    <aside className="botdesk-desk-rail" aria-label="Desks">
      <div className="botdesk-mark" title="botdesk">
        b<span>.</span>
      </div>
      <div className="botdesk-desk-buttons">
        {[{ id: "personal", name: "Personal" }, ...groups].map((desk) => (
          <button
            key={desk.id}
            type="button"
            className="botdesk-desk"
            title={desk.name}
            aria-label={`${desk.name} desk`}
            aria-pressed={active === desk.id}
            disabled={busy}
            onClick={() => select(desk.id)}
          >
            <span>
              {desk.name
                .split(/\s+/)
                .slice(0, 2)
                .map((word) => word[0])
                .join("")
                .toUpperCase()}
            </span>
            <small>{desk.name}</small>
          </button>
        ))}
        <button
          type="button"
          className="botdesk-desk botdesk-new-desk"
          aria-label="Create desk"
          title="Create desk"
          onClick={() => setCreating(!creating)}
        >
          <Plus className="size-5" />
          <small>New desk</small>
        </button>
      </div>
      <button
        type="button"
        className="botdesk-desk botdesk-add-project"
        disabled={busy}
        title="Add project to this desk"
        aria-label="Add project to this desk"
        onClick={() => void addProject(active === "personal" ? null : active)}
      >
        <FolderPlus className="size-5" />
      </button>
      {creating ? (
        <form
          className="botdesk-desk-form"
          onSubmit={(event) => {
            event.preventDefault();
            const title = name.trim();
            if (!title) return;
            const current = loadProjectGroups();
            if (
              title.toLowerCase() === "personal" ||
              current.some(
                (group) => group.name.toLowerCase() === title.toLowerCase(),
              )
            ) {
              setError("A desk with this name already exists.");
              return;
            }
            const desk = { ...createProjectGroup(current), name: title };
            if (!saveProjectGroups([...current, desk])) {
              setError("The desk could not be saved.");
              return;
            }
            setCreating(false);
            setName("");
            setError("");
            void addProject(desk.id);
          }}
        >
          <div className="botdesk-picker-heading">
            <strong>Create a desk</strong>
            <button
              type="button"
              aria-label="Close desk form"
              onClick={() => setCreating(false)}
            >
              <X className="size-4" />
            </button>
          </div>
          <label htmlFor="botdesk-desk-name">Desk name</label>
          <input
            id="botdesk-desk-name"
            autoFocus
            value={name}
            onChange={(event) => setName(event.target.value)}
            maxLength={60}
            placeholder="Studio, Research, Personal…"
            required
          />
          <p>
            Group projects and their chats. These local desks share your
            computer account.
          </p>
          <button className="botdesk-primary" type="submit">
            Create and choose a project
          </button>
          {error ? <p role="alert">{error}</p> : null}
        </form>
      ) : error ? (
        <div className="botdesk-desk-error" role="alert">
          {error}
          <button
            type="button"
            aria-label="Dismiss error"
            onClick={() => setError("")}
          >
            <X className="size-4" />
          </button>
        </div>
      ) : null}
    </aside>
  );
}
