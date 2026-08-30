import { createProjectStore } from './project-state.js';

const APP_VERSION = '0.2.0';

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
let deleteProjectId = null;
let projectStore = null;

try { projectStore = createProjectStore(localStorage); }
catch (error) { console.error('DA-DATA-000', error); }

function showView(target) {
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

window.addEventListener('error', (event) => console.error('DA-APP-001', event.error || event.message));
window.addEventListener('unhandledrejection', (event) => console.error('DA-APP-002', event.reason));

registerServiceWorker();
renderActiveProject();
