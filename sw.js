const CACHE = 'andeti-v2';

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c =>
      c.addAll(['/fluxo-familia/fluxo-familia.html'])
    )
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE)
            .map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  if(e.request.url.includes('supabase.co')) return;
  if(e.request.url.includes('googleapis.com')) return;
  e.respondWith(
    fetch(e.request)
      .then(res => {
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
