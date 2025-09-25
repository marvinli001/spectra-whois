// Empty service worker to prevent 404 errors
// This file exists to satisfy browser requests for /sw.js
// No actual service worker functionality is implemented

self.addEventListener('install', () => {
  // Skip waiting to activate immediately
  self.skipWaiting();
});

self.addEventListener('activate', () => {
  // Claim clients immediately
  return self.clients.claim();
});