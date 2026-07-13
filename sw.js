const CACHE_NAME = 'newjeans-abc-final-v5';
const ASSETS = [
 './','./index.html','./style.css','./script.js','./manifest.webmanifest','./icon-192.png','./icon-512.png', './line-preview.png','./assets/app-icon-original.png','./assets/favorite-badge.png','./assets/abc-master-badge.png','./images/poster.png',
 './images/01.jpg','./images/02.jpg','./images/03.jpg','./images/04.jpg','./images/05.jpg','./images/06.jpg','./images/07.jpg','./images/08.jpg','./images/09.jpg','./images/10.jpg','./images/11.jpg','./images/12.jpg','./images/13.jpg','./images/14.jpg','./images/15.jpg','./images/16.jpg','./images/17.jpg','./images/18.jpg','./images/19.jpg','./images/20.jpg','./images/21.jpg','./images/22.jpg','./images/23.jpg','./images/24.jpg','./images/25.jpg','./images/26.jpg'
];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(ASSETS))); self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k))))); self.clients.claim(); });
self.addEventListener('fetch', e => { if(e.request.method !== 'GET') return; e.respondWith(caches.match(e.request).then(cached => cached || fetch(e.request).then(res => { const copy=res.clone(); caches.open(CACHE_NAME).then(c=>c.put(e.request, copy)); return res; }).catch(()=>caches.match('./index.html')))); });
