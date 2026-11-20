// Change ce numéro à chaque mise à jour de l'app pour forcer le rafraîchissement
const CACHE = 'dressing-v2';

const FILES = [
  './',
  './index.html',
  './style.css',
  './config.js',
  './app.js',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/apple-touch-icon.png'
];

// Installation : mise en cache des fichiers de l'app
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(FILES)));
  self.skipWaiting();
});

// Activation : suppression des anciens caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Requêtes
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  // Supabase (données + photos) : toujours le réseau, jamais le cache
  if (event.request.url.includes('.supabase.co')) return;

  // Reste de l'app : réseau d'abord, cache si hors ligne
  event.respondWith(
    fetch(event.request)
      .then(response => {
        const copy = response.clone();
        caches.open(CACHE).then(cache => cache.put(event.request, copy));
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
