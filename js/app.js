const APP_VERSION = '0.1.0';

const views = [...document.querySelectorAll('.view')];
const navButtons = [...document.querySelectorAll('.nav-button')];
const networkBadge = document.querySelector('#networkBadge');
const offlineStatus = document.querySelector('#offlineStatus');
const diagnosticsList = document.querySelector('#diagnosticsList');
const copyButton = document.querySelector('#copyDiagnostics');
const copyFeedback = document.querySelector('#copyFeedback');
const updateBanner = document.querySelector('#updateBanner');
const applyUpdateButton = document.querySelector('#applyUpdate');

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

window.addEventListener('error', (event) => console.error('DA-APP-001', event.error || event.message));
window.addEventListener('unhandledrejection', (event) => console.error('DA-APP-002', event.reason));

registerServiceWorker();
