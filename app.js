// ===== Navigation entre les onglets =====
const tabs = document.querySelectorAll('.tab');
const screens = document.querySelectorAll('.screen');

function showScreen(name) {
  screens.forEach(s => s.classList.toggle('active', s.id === 'screen-' + name));
  tabs.forEach(t => t.classList.toggle('active', t.dataset.screen === name));
  window.scrollTo(0, 0);
}

tabs.forEach(tab => {
  tab.addEventListener('click', () => showScreen(tab.dataset.screen));
});

// ===== Enregistrement du service worker =====
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js')
      .catch(err => console.error('Service worker non enregistré :', err));
  });
}
