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

// ===== Connexion à Supabase =====
let db = null; // client Supabase, réutilisé dans les modules suivants

function setStatus(text, state) {
  const el = document.getElementById('db-status');
  if (!el) return;
  el.textContent = text;
  el.className = 'db-status' + (state ? ' ' + state : '');
}

async function testConnexion() {
  // 1. La bibliothèque Supabase est-elle chargée ? (absente si hors ligne)
  if (!window.supabase) {
    setStatus('HORS LIGNE – BASE INACCESSIBLE', 'error');
    return;
  }

  // 2. Création du client
  db = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

  // 3. Test : on compte les pièces de la table "vetements"
  try {
    const { count, error } = await db
      .from('vetements')
      .select('*', { count: 'exact', head: true });

    if (error) throw error;
    setStatus('CONNECTÉ · ' + count + ' PIÈCE' + (count > 1 ? 'S' : ''), 'ok');
  } catch (err) {
    setStatus('ERREUR : ' + (err.message || err), 'error');
    console.error(err);
  }
}

testConnexion();

// ===== Enregistrement du service worker =====
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js')
      .catch(err => console.error('Service worker non enregistré :', err));
  });
}
