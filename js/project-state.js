const STORAGE_KEY = 'drone-assistant.projects.v1';
const BACKUP_KEY = 'drone-assistant.projects.backup.v1';
const SCHEMA_VERSION = 2;

function now() { return new Date().toISOString(); }
function makeId() { return globalThis.crypto?.randomUUID?.() || `project-${Date.now()}-${Math.random().toString(16).slice(2)}`; }
function clean(value, max) { return String(value || '').trim().slice(0, max); }
function freshState() { return { schemaVersion: SCHEMA_VERSION, activeProjectId: null, projects: [] }; }

function validateProject(project) {
  return project && typeof project.id === 'string' && typeof project.name === 'string' && project.name.trim().length > 0;
}

function validateState(state) {
  return state && state.schemaVersion === SCHEMA_VERSION && Array.isArray(state.projects) && state.projects.every(validateProject);
}

function migrateState(state) {
  if (state?.schemaVersion === 1 && Array.isArray(state.projects)) {
    return { ...state, schemaVersion: 2, projects: state.projects.map((project) => ({ ...project, droneProfileId: project.droneProfileId || null })) };
  }
  return state;
}

export function createProjectStore(storage) {
  let state = load();

  function load() {
    try {
      const raw = storage.getItem(STORAGE_KEY);
      if (!raw) return freshState();
      const parsed = migrateState(JSON.parse(raw));
      return validateState(parsed) ? parsed : recover();
    } catch { return recover(); }
  }

  function recover() {
    try {
      const backup = migrateState(JSON.parse(storage.getItem(BACKUP_KEY)));
      return validateState(backup) ? backup : freshState();
    } catch { return freshState(); }
  }

  function persist(next) {
    if (!validateState(next)) throw new Error('DA-DATA-001');
    const current = storage.getItem(STORAGE_KEY);
    if (current) storage.setItem(BACKUP_KEY, current);
    storage.setItem(STORAGE_KEY, JSON.stringify(next));
    state = next;
    return snapshot();
  }

  function snapshot() { return structuredClone(state); }

  return {
    list: () => snapshot().projects.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
    getState: snapshot,
    get: (id) => snapshot().projects.find((project) => project.id === id) || null,
    create(input) {
      const name = clean(input.name, 80);
      if (!name) throw new Error('DA-DATA-002');
      const timestamp = now();
      const project = { id: makeId(), name, location: clean(input.location, 120), description: clean(input.description, 500), droneProfileId: null, createdAt: timestamp, updatedAt: timestamp };
      persist({ ...state, activeProjectId: project.id, projects: [...state.projects, project] });
      return structuredClone(project);
    },
    update(id, input) {
      const existing = state.projects.find((project) => project.id === id);
      if (!existing) throw new Error('DA-DATA-003');
      const name = clean(input.name, 80);
      if (!name) throw new Error('DA-DATA-002');
      const updated = { ...existing, name, location: clean(input.location, 120), description: clean(input.description, 500), updatedAt: now() };
      persist({ ...state, projects: state.projects.map((project) => project.id === id ? updated : project) });
      return structuredClone(updated);
    },
    open(id) {
      if (!state.projects.some((project) => project.id === id)) throw new Error('DA-DATA-003');
      return persist({ ...state, activeProjectId: id });
    },
    linkDroneProfile(id, droneProfileId) {
      const existing = state.projects.find((project) => project.id === id);
      if (!existing) throw new Error('DA-DATA-003');
      const updated = { ...existing, droneProfileId: droneProfileId || null, updatedAt: now() };
      return persist({ ...state, projects: state.projects.map((project) => project.id === id ? updated : project) });
    },
    duplicate(id) {
      const source = state.projects.find((project) => project.id === id);
      if (!source) throw new Error('DA-DATA-003');
      return this.create({ ...source, name: `${source.name} — kopie` });
    },
    remove(id) {
      if (!state.projects.some((project) => project.id === id)) return snapshot();
      const projects = state.projects.filter((project) => project.id !== id);
      const activeProjectId = state.activeProjectId === id ? (projects[0]?.id || null) : state.activeProjectId;
      return persist({ ...state, activeProjectId, projects });
    }
  };
}

export const projectStorageKeys = { STORAGE_KEY, BACKUP_KEY };
