// UBAH ANGKA VERSI INI SETIAP KALI KAMU MENGUBAH KODE INDEX.HTML
// Contoh: v1, v2, v3, v3.1, dst.
const CACHE_NAME = 'buku-tamu-v2.2'; 

const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap'
];

// Tahap Install: Memaksa Service Worker baru langsung diinstal
self.addEventListener('install', event => {
  self.skipWaiting(); // <-- Baris ajaib agar tidak perlu menutup tab browser untuk update
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Membuka cache: ' + CACHE_NAME);
        return cache.addAll(urlsToCache);
      })
  );
});

// Tahap Activate: Menghapus cache versi lama yang sudah usang
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          // Jika nama cache tidak sama dengan versi terbaru, HAPUS!
          if (cache !== CACHE_NAME) {
            console.log('Menghapus cache lama: ' + cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim(); // Memaksa Service Worker baru langsung mengambil alih halaman
});

// Tahap Fetch: Mengambil data dari cache atau jaringan
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Kembalikan dari cache jika ada, jika tidak ambil dari internet
        return response || fetch(event.request);
      })
  );
});
