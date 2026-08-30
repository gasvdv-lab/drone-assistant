import { createProjectStore } from './project-state.js';
import { calculateIdentification, createDroneProfileStore } from './drone-profile-state.js';
import { createLocalStreamUrl, isPrivateIpv4, validateLocalStreamUrl } from './live-video-utils.js';

const APP_VERSION = '0.4.0.1';
const LIVE_IP_KEY = 'drone-assistant.live.camera-ip.v1';
const LIVE_LOG_KEY = 'drone-assistant.live.log.v1';

const KNOWN_DRONE_PROFILE = Object.freeze({
  name: 'Mijn VISUO XS809HW',
  brand: 'VISUO/TIANQU',
  modelCode: 'XS809HW',
  variant: 'Wifi FPV / altitude hold',
  referenceApp: 'XSW UFO',
  cameras: 'one',
  storageMode: 'phone',
  evidence: ['visual', 'xsw'],
  notes: 'Zeer waarschijnlijk geïdentificeerd op basis van behuizing, onderzijde, VISUO-batterij en werkende XSW UFO-app. Eén eenvoudige wifi-FPV-camera. Geen GPS, tweede camera of optical flow. Exacte cameraresolutie nog niet fysiek bevestigd.'
});

const views = [...document.querySelectorAll('.view')];
const navButtons = [...document.querySelectorAll('.nav-button')];
const networkBadge = document.querySelector('#networkBadge');
const offlineStatus = document.querySelector('#offlineStatus');
const diagnosticsList = document.querySelector('#diagnosticsList');
const copyButton = document.querySelector('#copyDiagnostics');
const copyFeedback = document.querySelector('#copyFeedback');
const updateBanner = document.querySelector('#updateBanner');
const applyUpdateButton = document.querySelector('#applyUpdate');
const projectList = document.querySelector('#projectList');
const projectEmpty = document.querySelector('#projectEmpty');
const projectDialog = document.querySelector('#projectDialog');
const projectForm = document.querySelector('#projectForm');
const projectFormError = document.querySelector('#projectFormError');
const deleteDialog = document.querySelector('#deleteDialog');
const activeProjectName = document.querySelector('#activeProjectName');
const activeProjectMeta = document.querySelector('#activeProjectMeta');
const activeDroneMeta = document.querySelector('#activeDroneMeta');
const droneList = document.querySelector('#droneList');
const droneEmpty = document.querySelector('#droneEmpty');
const droneDialog = document.querySelector('#droneDialog');
const droneForm = document.querySelector('#droneForm');
const droneFormError = document.querySelector('#droneFormError');
const deleteDroneDialog = document.querySelector('#deleteDroneDialog');
const photoPreview = document.querySelector('#photoPreview');
let deleteProjectId = null;
let deleteDroneId = null;
let currentPhotos = [];
let projectStore = null;
let droneProfileStore = null;
let streamAttemptTimer = null;
let liveLogEntries = [];

try { projectStore = createProjectStore(localStorage); }
catch (error) { console.error('DA-DATA-000', error); }
try { droneProfileStore = createDroneProfileStore(localStorage); }
catch (error) { console.error('DA-DRONE-000', error); }

function showView(target) {
  if (target !== 'live') stopLiveStream(false);
  views.forEach((view) => {
    const active = view.dataset.view === target;
    view.hidden = !active;
    view.classList.toggle('active', active);
  });
  navButtons.forEach((button) => {
    const active = button.dataset.target === target;
    button.classList.toggle('active', active);
    if (active) button.setAttribute('aria-current', 'page');
    else button.removeAttribute('aria-current');
  });
  if (target === 'diagnostics') renderDiagnostics();
  if (target === 'projects') renderProjects();
  if (target === 'drone') renderDroneProfiles();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

navButtons.forEach((button) => button.addEventListener('click', () => showView(button.dataset.target)));

function updateNetworkState() {
  const online = navigator.onLine;
  networkBadge.textContent = online ? 'Online' : 'Offline';
  networkBadge.style.color = online ? 'var(--accent)' : 'var(--accent-2)';
}

window.addEventListener('online', updateNetworkState);
window.addEventListener('offline', updateNetworkState);
updateNetworkState();

function diagnosticData() {
  return [
    ['Appversie', APP_VERSION],
    ['Lokale projecten', projectStore ? String(projectStore.list().length) : 'Opslagfout'],
    ['Droneprofielen', droneProfileStore ? String(droneProfileStore.list().length) : 'Opslagfout'],
    ['Status netwerk', navigator.onLine ? 'Online' : 'Offline'],
    ['Browser', navigator.userAgent],
    ['Scherm', `${window.screen.width} × ${window.screen.height}`],
    ['Viewport', `${window.innerWidth} × ${window.innerHeight}`],
    ['Taal', navigator.language || 'Onbekend'],
    ['Serviceworker', 'serviceWorker' in navigator ? 'Ondersteund' : 'Niet ondersteund'],
    ['PWA-modus', window.matchMedia('(display-mode: standalone)').matches ? 'Geïnstalleerd/standalone' : 'Browser'],
    ['Camera-API', navigator.mediaDevices?.getUserMedia ? 'Ondersteund (niet aangevraagd)' : 'Niet ondersteund'],
    ['WebXR', 'xr' in navigator ? 'API aanwezig' : 'Niet beschikbaar'],
    ['Lokale opslag', storageAvailable() ? 'Ondersteund' : 'Niet beschikbaar'],
    ['Tijd controle', new Date().toLocaleString('nl-BE')]
  ];
}

function storageAvailable() {
  try {
    const key = '__drone_assistant_test__';
    localStorage.setItem(key, key);
    localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

function renderDiagnostics() {
  diagnosticsList.replaceChildren(...diagnosticData().map(([label, value]) => {
    const row = document.createElement('div');
    row.className = 'diagnostic-row';
    const key = document.createElement('span');
    key.textContent = label;
    const data = document.createElement('strong');
    data.textContent = value;
    row.append(key, data);
    return row;
  }));
}

copyButton.addEventListener('click', async () => {
  const text = ['Drone Assistant diagnostiek', ...diagnosticData().map(([key, value]) => `${key}: ${value}`)].join('\n');
  try {
    await navigator.clipboard.writeText(text);
    copyFeedback.textContent = 'Diagnostiek gekopieerd.';
  } catch {
    copyFeedback.textContent = 'Kopiëren niet toegestaan. Selecteer de gegevens handmatig.';
  }
});

async function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) {
    offlineStatus.textContent = 'Niet ondersteund';
    return;
  }
  try {
    const registration = await navigator.serviceWorker.register('./service-worker.js');
    offlineStatus.textContent = 'Voorbereid';
    registration.addEventListener('updatefound', () => {
      const worker = registration.installing;
      worker?.addEventListener('statechange', () => {
        if (worker.state === 'installed' && navigator.serviceWorker.controller) updateBanner.hidden = false;
      });
    });
  } catch (error) {
    offlineStatus.textContent = 'Fout';
    console.error('DA-PWA-001', error);
  }
}

applyUpdateButton.addEventListener('click', () => window.location.reload());

function formatDate(value) {
  return new Intl.DateTimeFormat('nl-BE', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
}

function renderActiveProject() {
  if (!projectStore) return;
  const state = projectStore.getState();
  const project = state.projects.find((item) => item.id === state.activeProjectId);
  activeProjectName.textContent = project?.name || 'Nog geen project';
  activeProjectMeta.textContent = project ? `${project.location || 'Geen locatie'} · bijgewerkt ${formatDate(project.updatedAt)}` : 'Open Projecten om je eerste project te maken.';
  const profile = project?.droneProfileId && droneProfileStore ? droneProfileStore.get(project.droneProfileId) : null;
  activeDroneMeta.textContent = profile ? `Drone: ${profile.name} · ${statusLabel(profile.identificationStatus)} ${profile.confidenceScore}%` : 'Geen droneprofiel gekoppeld';
}

function projectCard(project, activeId) {
  const card = document.createElement('article');
  card.className = `project-card${project.id === activeId ? ' active-project' : ''}`;
  const header = document.createElement('div');
  header.className = 'project-card-header';
  const info = document.createElement('div');
  const name = document.createElement('h3');
  name.textContent = project.name;
  const meta = document.createElement('p');
  meta.textContent = `${project.location || 'Geen locatie'} · ${formatDate(project.updatedAt)}`;
  info.append(name, meta);
  header.append(info);
  if (project.id === activeId) {
    const badge = document.createElement('span'); badge.className = 'project-badge'; badge.textContent = 'Actief'; header.append(badge);
  }
  const actions = document.createElement('div');
  actions.className = 'project-card-actions';
  [['open', 'Openen'], ['edit', 'Wijzigen'], ['duplicate', 'Kopiëren'], ['delete', 'Verwijderen']].forEach(([action, label]) => {
    const button = document.createElement('button');
    button.type = 'button'; button.className = `project-action ${action}`; button.dataset.action = action; button.dataset.id = project.id; button.textContent = label; actions.append(button);
  });
  card.append(header, actions);
  return card;
}

function renderProjects() {
  if (!projectStore) { projectEmpty.hidden = false; projectList.hidden = true; return; }
  const state = projectStore.getState();
  const projects = projectStore.list();
  projectEmpty.hidden = projects.length > 0;
  projectList.hidden = projects.length === 0;
  projectList.replaceChildren(...projects.map((project) => projectCard(project, state.activeProjectId)));
  renderActiveProject();
}

function openProjectForm(project = null) {
  projectForm.reset(); projectFormError.textContent = '';
  document.querySelector('#projectDialogTitle').textContent = project ? 'Project wijzigen' : 'Nieuw project';
  document.querySelector('#projectId').value = project?.id || '';
  document.querySelector('#projectName').value = project?.name || '';
  document.querySelector('#projectLocation').value = project?.location || '';
  document.querySelector('#projectDescription').value = project?.description || '';
  projectDialog.showModal();
  setTimeout(() => document.querySelector('#projectName').focus(), 0);
}

document.querySelector('#newProjectButton').addEventListener('click', () => openProjectForm());
document.querySelector('#emptyNewProjectButton').addEventListener('click', () => openProjectForm());
document.querySelector('[data-close-project]').addEventListener('click', () => projectDialog.close());

projectForm.addEventListener('submit', (event) => {
  event.preventDefault();
  try {
    const data = { name: document.querySelector('#projectName').value, location: document.querySelector('#projectLocation').value, description: document.querySelector('#projectDescription').value };
    const id = document.querySelector('#projectId').value;
    if (id) projectStore.update(id, data); else projectStore.create(data);
    projectDialog.close(); renderProjects();
  } catch (error) { projectFormError.textContent = error.message === 'DA-DATA-002' ? 'Vul een projectnaam in.' : 'Project kon niet worden bewaard (DA-DATA-004).'; }
});

projectList.addEventListener('click', (event) => {
  const button = event.target.closest('[data-action]');
  if (!button || !projectStore) return;
  const project = projectStore.get(button.dataset.id);
  if (!project) return;
  if (button.dataset.action === 'open') { projectStore.open(project.id); renderProjects(); showView('home'); }
  if (button.dataset.action === 'edit') openProjectForm(project);
  if (button.dataset.action === 'duplicate') { projectStore.duplicate(project.id); renderProjects(); }
  if (button.dataset.action === 'delete') { deleteProjectId = project.id; document.querySelector('#deleteMessage').textContent = `“${project.name}” wordt lokaal van dit toestel verwijderd.`; deleteDialog.showModal(); }
});

document.querySelector('#confirmDelete').addEventListener('click', () => {
  if (deleteProjectId && projectStore) projectStore.remove(deleteProjectId);
  deleteProjectId = null; renderProjects();
});

const STATUS_LABELS = { confirmed: 'Bevestigd', 'very-likely': 'Zeer waarschijnlijk', likely: 'Waarschijnlijk', candidate: 'Mogelijke kandidaat', unknown: 'Onbekend' };
const COMPATIBILITY_LABELS = { confirmed: 'Bevestigd', limited: 'Beperkt', research: 'Onderzoeken', unsupported: 'Niet ondersteund', excluded: 'Niet voorzien' };
function statusLabel(status) { return STATUS_LABELS[status] || 'Onbekend'; }

function droneFormData() {
  return {
    name: document.querySelector('#droneName').value,
    brand: document.querySelector('#droneBrand').value,
    modelCode: document.querySelector('#droneModelCode').value,
    variant: document.querySelector('#droneVariant').value,
    referenceApp: document.querySelector('#droneApp').value,
    appVersion: document.querySelector('#droneAppVersion').value,
    wifiName: document.querySelector('#droneWifi').value,
    cameras: document.querySelector('#droneCameras').value,
    storageMode: document.querySelector('#droneStorage').value,
    evidence: [...document.querySelectorAll('input[name="evidence"]:checked')].map((input) => input.value),
    photos: currentPhotos,
    notes: document.querySelector('#droneNotes').value
  };
}

function updateIdentificationPreview() {
  const data = droneFormData();
  const result = calculateIdentification(data);
  const model = data.modelCode ? `${data.brand || 'Onbekend merk'} ${data.modelCode}` : 'Exact model nog onbekend';
  document.querySelector('#identificationPreview').innerHTML = `<strong>${statusLabel(result.status)} · ${result.score}%</strong>${model}. De score is gebaseerd op ${result.evidence.length} geregistreerde bewijsbron(nen).`;
}

function renderPhotoPreview() {
  photoPreview.replaceChildren(...currentPhotos.map((source, index) => {
    const item = document.createElement('div'); item.className = 'photo-item';
    const image = document.createElement('img'); image.src = source; image.alt = `Bewijsfoto ${index + 1}`;
    const remove = document.createElement('button'); remove.type = 'button'; remove.textContent = '×'; remove.setAttribute('aria-label', `Verwijder bewijsfoto ${index + 1}`);
    remove.addEventListener('click', () => { currentPhotos.splice(index, 1); renderPhotoPreview(); });
    item.append(image, remove); return item;
  }));
}

function compressImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('DA-PHOTO-001'));
    reader.onload = () => {
      const image = new Image();
      image.onerror = () => reject(new Error('DA-PHOTO-002'));
      image.onload = () => {
        const scale = Math.min(1, 720 / Math.max(image.width, image.height));
        const canvas = document.createElement('canvas'); canvas.width = Math.round(image.width * scale); canvas.height = Math.round(image.height * scale);
        canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.72));
      };
      image.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

function populateProjectSelect(profileId = null) {
  const select = document.querySelector('#droneProject');
  const linked = profileId && projectStore ? projectStore.list().find((project) => project.droneProfileId === profileId)?.id : '';
  select.replaceChildren(new Option('Niet koppelen', ''), ...(projectStore ? projectStore.list().map((project) => new Option(project.name, project.id, false, project.id === linked)) : []));
}

function openDroneForm(profile = null) {
  droneForm.reset(); droneFormError.textContent = ''; currentPhotos = [...(profile?.photos || [])];
  document.querySelector('#droneDialogTitle').textContent = profile ? 'Droneprofiel wijzigen' : 'Nieuw droneprofiel';
  document.querySelector('#droneId').value = profile?.id || '';
  document.querySelector('#droneName').value = profile?.name || 'Mijn VISUO-drone';
  document.querySelector('#droneBrand').value = profile?.brand || 'VISUO/TIANQU';
  document.querySelector('#droneModelCode').value = profile?.modelCode || '';
  document.querySelector('#droneVariant').value = profile?.variant || '';
  document.querySelector('#droneApp').value = profile?.referenceApp || 'XSW UFO';
  document.querySelector('#droneAppVersion').value = profile?.appVersion || '';
  document.querySelector('#droneWifi').value = profile?.wifiName || '';
  document.querySelector('#droneCameras').value = profile?.cameras || 'unknown';
  document.querySelector('#droneStorage').value = profile?.storageMode || 'unknown';
  document.querySelector('#droneNotes').value = profile?.notes || '';
  document.querySelectorAll('input[name="evidence"]').forEach((input) => { input.checked = profile?.evidence?.includes(input.value) || (!profile && input.value === 'xsw'); });
  populateProjectSelect(profile?.id); renderPhotoPreview(); updateIdentificationPreview(); droneDialog.showModal();
}

function openKnownDroneProfile() {
  openDroneForm();
  document.querySelector('#droneName').value = KNOWN_DRONE_PROFILE.name;
  document.querySelector('#droneBrand').value = KNOWN_DRONE_PROFILE.brand;
  document.querySelector('#droneModelCode').value = KNOWN_DRONE_PROFILE.modelCode;
  document.querySelector('#droneVariant').value = KNOWN_DRONE_PROFILE.variant;
  document.querySelector('#droneApp').value = KNOWN_DRONE_PROFILE.referenceApp;
  document.querySelector('#droneCameras').value = KNOWN_DRONE_PROFILE.cameras;
  document.querySelector('#droneStorage').value = KNOWN_DRONE_PROFILE.storageMode;
  document.querySelector('#droneNotes').value = KNOWN_DRONE_PROFILE.notes;
  document.querySelectorAll('input[name="evidence"]').forEach((input) => { input.checked = KNOWN_DRONE_PROFILE.evidence.includes(input.value); });
  updateIdentificationPreview();
}

function compatibilityRows(profile) {
  const names = { profile: 'Profielbeheer', projectLink: 'Projectkoppeling', mediaImport: 'Media-import', liveView: 'Livebeeld', groundAr: 'Ground AR', flightControl: 'Vluchtbesturing' };
  const wrapper = document.createElement('div'); wrapper.className = 'compatibility-grid';
  Object.entries(profile.compatibility).forEach(([key, value]) => { const name = document.createElement('span'); name.textContent = names[key] || key; const status = document.createElement('span'); status.className = `status-${value}`; status.textContent = COMPATIBILITY_LABELS[value] || value; wrapper.append(name, status); });
  return wrapper;
}

function droneCard(profile) {
  const card = document.createElement('article'); card.className = 'drone-card';
  const header = document.createElement('div'); header.className = 'drone-card-header';
  const info = document.createElement('div'); const name = document.createElement('h3'); name.textContent = profile.name;
  const meta = document.createElement('p'); meta.textContent = `${profile.brand || 'Onbekend merk'} · ${profile.modelCode || 'modelcode ontbreekt'} · ${statusLabel(profile.identificationStatus)}`; info.append(name, meta);
  const score = document.createElement('span'); score.className = 'confidence-ring'; score.textContent = `${profile.confidenceScore}%`; header.append(info, score);
  const candidate = document.createElement('div'); candidate.className = 'candidate-box'; candidate.textContent = `Kandidaten: ${profile.candidates.join(', ')}`;
  const actions = document.createElement('div'); actions.className = 'project-card-actions';
  [['edit', 'Aanvullen'], ['duplicate', 'Kopiëren'], ['delete', 'Verwijderen']].forEach(([action, label]) => { const button = document.createElement('button'); button.type = 'button'; button.className = `project-action ${action}`; button.dataset.droneAction = action; button.dataset.id = profile.id; button.textContent = label; actions.append(button); });
  card.append(header, candidate, compatibilityRows(profile), actions); return card;
}

function renderDroneProfiles() {
  const profiles = droneProfileStore?.list() || [];
  droneEmpty.hidden = profiles.length > 0; droneList.hidden = profiles.length === 0;
  droneList.replaceChildren(...profiles.map(droneCard)); renderActiveProject();
}

document.querySelector('#newDroneButton').addEventListener('click', () => openDroneForm());
document.querySelector('#emptyNewDroneButton').addEventListener('click', () => openDroneForm());
document.querySelector('#loadKnownDroneButton').addEventListener('click', openKnownDroneProfile);
document.querySelector('[data-close-drone]').addEventListener('click', () => droneDialog.close());
droneForm.addEventListener('input', (event) => { if (event.target.id !== 'dronePhotos') updateIdentificationPreview(); });
document.querySelector('#dronePhotos').addEventListener('change', async (event) => {
  droneFormError.textContent = '';
  try { const available = 3 - currentPhotos.length; const added = await Promise.all([...event.target.files].slice(0, available).map(compressImage)); currentPhotos.push(...added); renderPhotoPreview(); }
  catch { droneFormError.textContent = 'Een foto kon niet worden verwerkt (DA-PHOTO-003).'; }
  event.target.value = '';
});

droneForm.addEventListener('submit', (event) => {
  event.preventDefault();
  try {
    const id = document.querySelector('#droneId').value; const data = droneFormData();
    const profile = id ? droneProfileStore.update(id, data) : droneProfileStore.create(data);
    if (projectStore) {
      projectStore.list().filter((project) => project.droneProfileId === profile.id).forEach((project) => projectStore.linkDroneProfile(project.id, null));
      const projectId = document.querySelector('#droneProject').value; if (projectId) projectStore.linkDroneProfile(projectId, profile.id);
    }
    droneDialog.close(); renderDroneProfiles(); renderProjects();
  } catch (error) { droneFormError.textContent = error.name === 'QuotaExceededError' ? 'Lokale opslag is vol. Verwijder een bewijsfoto.' : 'Profiel kon niet worden bewaard (DA-DRONE-003).'; }
});

droneList.addEventListener('click', (event) => {
  const button = event.target.closest('[data-drone-action]'); if (!button || !droneProfileStore) return;
  const profile = droneProfileStore.get(button.dataset.id); if (!profile) return;
  if (button.dataset.droneAction === 'edit') openDroneForm(profile);
  if (button.dataset.droneAction === 'duplicate') { droneProfileStore.duplicate(profile.id); renderDroneProfiles(); }
  if (button.dataset.droneAction === 'delete') { deleteDroneId = profile.id; document.querySelector('#deleteDroneMessage').textContent = `“${profile.name}” en de lokale bewijsfoto’s worden verwijderd. Projectkoppelingen worden losgemaakt.`; deleteDroneDialog.showModal(); }
});

document.querySelector('#confirmDeleteDrone').addEventListener('click', () => {
  if (deleteDroneId && droneProfileStore) {
    projectStore?.list().filter((project) => project.droneProfileId === deleteDroneId).forEach((project) => projectStore.linkDroneProfile(project.id, null));
    droneProfileStore.remove(deleteDroneId);
  }
  deleteDroneId = null; renderDroneProfiles(); renderProjects();
});

const cameraIpInput = document.querySelector('#cameraIp');
const streamPreset = document.querySelector('#streamPreset');
const streamUrlInput = document.querySelector('#streamUrl');
const hostTestFeedback = document.querySelector('#hostTestFeedback');
const streamFeedback = document.querySelector('#streamFeedback');
const streamImage = document.querySelector('#streamImage');
const streamPlaceholder = document.querySelector('#streamPlaceholder');
const liveLog = document.querySelector('#liveLog');

function safeLocalGet(key, fallback = '') {
  try { return localStorage.getItem(key) || fallback; } catch { return fallback; }
}

function safeLocalSet(key, value) {
  try { localStorage.setItem(key, value); } catch { /* Diagnostiek blijft in deze sessie werken. */ }
}

function renderLiveLog() {
  liveLog.replaceChildren(...liveLogEntries.map((entry) => {
    const row = document.createElement('div');
    row.className = `live-log-entry ${entry.level}`;
    row.textContent = `${entry.time} · ${entry.message}`;
    return row;
  }));
  if (!liveLogEntries.length) {
    const empty = document.createElement('div'); empty.className = 'live-log-entry'; empty.textContent = 'Nog geen tests uitgevoerd.'; liveLog.append(empty);
  }
}

function addLiveLog(message, level = 'warning') {
  liveLogEntries.unshift({ time: new Date().toLocaleTimeString('nl-BE'), message, level });
  liveLogEntries = liveLogEntries.slice(0, 30);
  safeLocalSet(LIVE_LOG_KEY, JSON.stringify(liveLogEntries));
  renderLiveLog();
}

function normalizedCameraIp() {
  const value = cameraIpInput.value.trim();
  if (!isPrivateIpv4(value)) throw new Error('Gebruik een geldig privé-IP-adres, bijvoorbeeld 192.168.0.1.');
  return value;
}

function buildPresetUrl() {
  return createLocalStreamUrl(normalizedCameraIp(), streamPreset.value);
}

function updateStreamUrlFromPreset() {
  try { streamUrlInput.value = buildPresetUrl(); hostTestFeedback.textContent = ''; }
  catch (error) { hostTestFeedback.textContent = error.message; }
}

cameraIpInput.value = safeLocalGet(LIVE_IP_KEY, '192.168.0.1');
streamUrlInput.value = `http://${cameraIpInput.value}/`;
cameraIpInput.addEventListener('input', updateStreamUrlFromPreset);
streamPreset.addEventListener('change', updateStreamUrlFromPreset);

document.querySelector('#testCameraHost').addEventListener('click', async () => {
  hostTestFeedback.textContent = 'Lokaal adres testen… Chrome kan om lokale-netwerktoegang vragen.';
  let ip;
  try { ip = normalizedCameraIp(); }
  catch (error) { hostTestFeedback.textContent = error.message; addLiveLog(error.message, 'error'); return; }
  safeLocalSet(LIVE_IP_KEY, ip);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);
  try {
    await fetch(`http://${ip}/`, { mode: 'no-cors', cache: 'no-store', signal: controller.signal, targetAddressSpace: 'local' });
    hostTestFeedback.textContent = 'Het lokale HTTP-adres antwoordde. Dit bewijst nog niet dat het een videostream is.';
    addLiveLog(`HTTP-antwoord ontvangen van ${ip}.`, 'success');
  } catch (error) {
    const reason = error.name === 'AbortError' ? 'time-out na 5 seconden' : 'geblokkeerd of geen HTTP-antwoord';
    hostTestFeedback.textContent = `Geen leesbaar HTTP-antwoord: ${reason}. Dit kan ook betekenen dat de camera alleen UDP gebruikt.`;
    addLiveLog(`Geen HTTP-antwoord van ${ip}: ${reason}.`, 'error');
  } finally { clearTimeout(timeout); }
});

function stopLiveStream(writeLog = true) {
  clearTimeout(streamAttemptTimer); streamAttemptTimer = null;
  if (streamImage) { streamImage.onload = null; streamImage.onerror = null; streamImage.removeAttribute('src'); streamImage.hidden = true; }
  if (streamPlaceholder) streamPlaceholder.hidden = false;
  if (writeLog && streamFeedback) { streamFeedback.textContent = 'Beeldproef gestopt.'; addLiveLog('Beeldproef handmatig gestopt.'); }
}

document.querySelector('#tryStream').addEventListener('click', () => {
  stopLiveStream(false);
  let url;
  try { url = validateLocalStreamUrl(streamUrlInput.value.trim()); }
  catch (error) { streamFeedback.textContent = error.message; addLiveLog(error.message, 'error'); return; }
  const parsed = new URL(url); cameraIpInput.value = parsed.hostname; safeLocalSet(LIVE_IP_KEY, parsed.hostname);
  streamFeedback.textContent = 'Beeld wordt geprobeerd… Geef Chrome lokale-netwerktoegang wanneer daarom wordt gevraagd.';
  streamPlaceholder.hidden = true; streamImage.hidden = false;
  streamImage.onload = () => {
    clearTimeout(streamAttemptTimer);
    streamFeedback.textContent = 'Beeldbron geladen. Controleer of het beeld werkelijk live verandert.';
    addLiveLog(`Beeldbron geladen: ${url}`, 'success');
  };
  streamImage.onerror = () => {
    clearTimeout(streamAttemptTimer); streamImage.hidden = true; streamPlaceholder.hidden = false;
    streamFeedback.textContent = 'Geen browsercompatibel beeld op dit pad. Probeer één ander patroon.';
    addLiveLog(`Geen beeld op ${url}`, 'error');
  };
  streamImage.src = `${url}${url.includes('?') ? '&' : '?'}da_cache=${Date.now()}`;
  streamAttemptTimer = setTimeout(() => {
    if (!streamImage.complete) {
      streamFeedback.textContent = 'De beeldproef blijft wachten. Stop en probeer een ander pad; mogelijk gebruikt de drone UDP.';
      addLiveLog(`Time-out tijdens beeldproef: ${url}`, 'warning');
    }
  }, 8000);
});

document.querySelector('#stopStream').addEventListener('click', () => stopLiveStream(true));
document.querySelector('#copyLiveLog').addEventListener('click', async () => {
  const report = [`Drone Assistant livevideo v${APP_VERSION}`, `IP: ${cameraIpInput.value}`, `Stream: ${streamUrlInput.value}`, ...liveLogEntries.map((entry) => `${entry.time} ${entry.message}`)].join('\n');
  try { await navigator.clipboard.writeText(report); addLiveLog('Diagnoselogboek gekopieerd.', 'success'); }
  catch { addLiveLog('Kopiëren werd door de browser geweigerd.', 'error'); }
});

try {
  const storedLog = JSON.parse(safeLocalGet(LIVE_LOG_KEY, '[]'));
  liveLogEntries = Array.isArray(storedLog) ? storedLog.slice(0, 30) : [];
} catch { liveLogEntries = []; }
renderLiveLog();

window.addEventListener('error', (event) => console.error('DA-APP-001', event.error || event.message));
window.addEventListener('unhandledrejection', (event) => console.error('DA-APP-002', event.reason));

registerServiceWorker();
renderActiveProject();
