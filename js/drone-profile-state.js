const STORAGE_KEY = 'drone-assistant.drone-profiles.v1';
const BACKUP_KEY = 'drone-assistant.drone-profiles.backup.v1';
const SCHEMA_VERSION = 1;
const VALID_STATUS = ['confirmed', 'very-likely', 'likely', 'candidate', 'unknown'];
const VALID_COMPATIBILITY = ['confirmed', 'limited', 'research', 'unsupported', 'excluded'];

function now() { return new Date().toISOString(); }
function makeId() { return globalThis.crypto?.randomUUID?.() || `drone-${Date.now()}-${Math.random().toString(16).slice(2)}`; }
function clean(value, max) { return String(value || '').trim().slice(0, max); }
function freshState() { return { schemaVersion: SCHEMA_VERSION, profiles: [] }; }

export function calculateIdentification(input) {
  const evidence = [...new Set((input.evidence || []).filter(Boolean))];
  const code = clean(input.modelCode, 40).toUpperCase();
  const primary = evidence.some((item) => ['sticker', 'manual', 'box'].includes(item));
  let status = 'unknown'; let score = 0;
  if (code && primary) { status = 'confirmed'; score = 100; }
  else if (code && evidence.length >= 2) { status = 'very-likely'; score = 85; }
  else if (code || evidence.length >= 3) { status = 'likely'; score = 65; }
  else if (evidence.length > 0 || clean(input.brand, 50)) { status = 'candidate'; score = 35; }
  return { status, score, evidence };
}

export function candidateModels(modelCode = '') {
  const code = clean(modelCode, 40).toUpperCase();
  if (code.includes('XS809HW')) return ['VISUO XS809HW'];
  if (code.includes('XS809W')) return ['VISUO XS809W', 'VISUO XS809HW'];
  if (code.includes('XS816L')) return ['VISUO XS816L Battle Sharks'];
  if (code.includes('XS816')) return ['VISUO XS816 Battle Sharks', 'VISUO XS816L Battle Sharks'];
  if (code.includes('XS809S')) return ['VISUO XS809S Battle Sharks'];
  return ['VISUO XS809HW', 'VISUO XS809W'];
}

function normalize(input, existing = {}) {
  const identification = calculateIdentification(input);
  const timestamp = now();
  return {
    id: existing.id || makeId(),
    name: clean(input.name, 80) || 'Onbekende drone',
    brand: clean(input.brand, 50),
    modelCode: clean(input.modelCode, 40).toUpperCase(),
    variant: clean(input.variant, 60),
    referenceApp: clean(input.referenceApp, 60),
    appVersion: clean(input.appVersion, 30),
    wifiName: clean(input.wifiName, 80),
    cameras: ['unknown', 'one', 'two'].includes(input.cameras) ? input.cameras : 'unknown',
    storageMode: ['unknown', 'phone', 'drone', 'both'].includes(input.storageMode) ? input.storageMode : 'unknown',
    evidence: identification.evidence,
    identificationStatus: identification.status,
    confidenceScore: identification.score,
    photos: Array.isArray(input.photos) ? input.photos.slice(0, 3).filter((item) => typeof item === 'string' && item.startsWith('data:image/')) : [],
    notes: clean(input.notes, 800),
    candidates: candidateModels(input.modelCode),
    compatibility: {
      profile: 'confirmed', projectLink: 'confirmed', mediaImport: 'research', liveView: 'research', groundAr: 'research', flightControl: 'excluded',
      ...(input.compatibility || {})
    },
    createdAt: existing.createdAt || timestamp,
    updatedAt: timestamp
  };
}

function validateProfile(profile) {
  return profile && typeof profile.id === 'string' && typeof profile.name === 'string' && VALID_STATUS.includes(profile.identificationStatus) && Object.values(profile.compatibility || {}).every((value) => VALID_COMPATIBILITY.includes(value));
}
function validateState(state) { return state && state.schemaVersion === SCHEMA_VERSION && Array.isArray(state.profiles) && state.profiles.every(validateProfile); }

export function createDroneProfileStore(storage) {
  let state = load();
  function recover() {
    try { const backup = JSON.parse(storage.getItem(BACKUP_KEY)); return validateState(backup) ? backup : freshState(); }
    catch { return freshState(); }
  }
  function load() {
    try { const raw = storage.getItem(STORAGE_KEY); if (!raw) return freshState(); const parsed = JSON.parse(raw); return validateState(parsed) ? parsed : recover(); }
    catch { return recover(); }
  }
  function snapshot() { return structuredClone(state); }
  function persist(next) {
    if (!validateState(next)) throw new Error('DA-DRONE-001');
    const current = storage.getItem(STORAGE_KEY); if (current) storage.setItem(BACKUP_KEY, current);
    storage.setItem(STORAGE_KEY, JSON.stringify(next)); state = next; return snapshot();
  }
  return {
    list: () => snapshot().profiles.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
    get: (id) => snapshot().profiles.find((profile) => profile.id === id) || null,
    create(input) { const profile = normalize(input); persist({ ...state, profiles: [...state.profiles, profile] }); return structuredClone(profile); },
    update(id, input) { const existing = state.profiles.find((profile) => profile.id === id); if (!existing) throw new Error('DA-DRONE-002'); const profile = normalize(input, existing); persist({ ...state, profiles: state.profiles.map((item) => item.id === id ? profile : item) }); return structuredClone(profile); },
    duplicate(id) { const source = this.get(id); if (!source) throw new Error('DA-DRONE-002'); return this.create({ ...source, name: `${source.name} — kopie` }); },
    remove(id) { return persist({ ...state, profiles: state.profiles.filter((profile) => profile.id !== id) }); }
  };
}

export const droneProfileStorageKeys = { STORAGE_KEY, BACKUP_KEY };
