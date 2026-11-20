// Renta.ph service worker: phone alerts (also when the app is closed) and app install.
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');
importScripts('config.js');
try { firebase.initializeApp(self.RENTA_FIREBASE); firebase.messaging(); } catch (e) {}

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', () => {});
// Alerts the open app shows itself (alerts sent from the server open their own link)
self.addEventListener('notificationclick', e => {
  const url = e.notification.data && e.notification.data.url;
  if (!url) return;
  e.notification.close();
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
    for (const c of list) { if (c.url.includes('app.html') && 'focus' in c) { c.navigate(url).catch(() => {}); return c.focus(); } }
    return self.clients.openWindow(url);
  }));
});
