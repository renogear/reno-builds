/**
 * PropGrid Service Worker
 * Provides offline support, caching, and performance optimization
 */

const CACHE_NAME = 'propgrid-v1.0.0';
const STATIC_CACHE = 'propgrid-static-v1.0.0';
const DYNAMIC_CACHE = 'propgrid-dynamic-v1.0.0';

// Files to cache immediately
const STATIC_FILES = [
    '/',
    '/index.html',
    '/script.js',
    'https://cdn.tailwindcss.com',
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// Install event - cache static files
self.addEventListener('install', (event) => {
            // Service Worker installing
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then((cache) => {
                // Caching static files
                return cache.addAll(STATIC_FILES);
            })
            .then(() => {
                // Service Worker installed
                return self.skipWaiting();
            })
            .catch((error) => {
                if (typeof console !== 'undefined' && console.error) {
                    console.error('Service Worker install failed:', error);
                }
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
            // Service Worker activating
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
                            // Deleting old cache
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                // Service Worker activated
                return self.clients.claim();
            })
    );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }

    // Handle different types of requests
    if (url.origin === self.location.origin) {
        // Same-origin requests
        event.respondWith(handleSameOriginRequest(request));
    } else if (url.origin.includes('cdn.tailwindcss.com') || 
               url.origin.includes('fonts.googleapis.com') ||
               url.origin.includes('cdnjs.cloudflare.com')) {
        // CDN requests
        event.respondWith(handleCDNRequest(request));
    } else {
        // Other external requests
        event.respondWith(handleExternalRequest(request));
    }
});

// Handle same-origin requests
async function handleSameOriginRequest(request) {
    try {
        // Try network first, fallback to cache
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            // Cache the response for future use
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        // Network failed, try cache
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        // Return offline page if available
        return caches.match('/offline.html');
    }
}

// Handle CDN requests
async function handleCDNRequest(request) {
    try {
        // Try cache first for CDN resources
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        // If not in cache, fetch from network
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            // Cache CDN resources
            const cache = await caches.open(STATIC_CACHE);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        // Return a fallback response for critical resources
        if (request.url.includes('tailwindcss.com')) {
            return new Response('/* Tailwind CSS fallback */', {
                headers: { 'Content-Type': 'text/css' }
            });
        }
        
        throw error;
    }
}

// Handle external requests
async function handleExternalRequest(request) {
    try {
        // Try network first
        const response = await fetch(request);
        return response;
    } catch (error) {
        // Return a simple offline response
        return new Response('Offline', {
            status: 503,
            statusText: 'Service Unavailable'
        });
    }
}

// Background sync for form submissions
self.addEventListener('sync', (event) => {
    if (event.tag === 'background-sync') {
        event.waitUntil(doBackgroundSync());
    }
});

async function doBackgroundSync() {
    try {
        // Get stored form data
        const formData = await getStoredFormData();
        
        if (formData) {
            // Submit form data
            const response = await fetch('/api/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });
            
            if (response.ok) {
                // Clear stored data on success
                await clearStoredFormData();
                // Background sync successful
            }
        }
    } catch (error) {
        if (typeof console !== 'undefined' && console.error) {
            console.error('Background sync failed:', error);
        }
    }
}

// Push notifications
self.addEventListener('push', (event) => {
    const options = {
        body: event.data ? event.data.text() : 'New real estate deal alert!',
        icon: '/2zeilN5FnQ4boMLVI0qnMaQk248.svg',
        badge: '/2zeilN5FnQ4boMLVI0qnMaQk248.svg',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [
            {
                action: 'explore',
                title: 'View Deal',
                icon: '/icon-192x192.png'
            },
            {
                action: 'close',
                title: 'Close',
                icon: '/icon-192x192.png'
            }
        ]
    };

    event.waitUntil(
        self.registration.showNotification('PropGrid Deal Alert', options)
    );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    if (event.action === 'explore') {
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

// Utility functions for background sync
async function getStoredFormData() {
    try {
        const cache = await caches.open(DYNAMIC_CACHE);
        const response = await cache.match('/form-data');
        return response ? await response.json() : null;
    } catch (error) {
        if (typeof console !== 'undefined' && console.error) {
            console.error('Error getting stored form data:', error);
        }
        return null;
    }
}

async function clearStoredFormData() {
    try {
        const cache = await caches.open(DYNAMIC_CACHE);
        await cache.delete('/form-data');
    } catch (error) {
        if (typeof console !== 'undefined' && console.error) {
            console.error('Error clearing stored form data:', error);
        }
    }
}

// Message handling for communication with main thread
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'CACHE_URLS') {
        event.waitUntil(
            caches.open(DYNAMIC_CACHE)
                .then((cache) => {
                    return cache.addAll(event.data.urls);
                })
        );
    }
});

// Error handling
self.addEventListener('error', (event) => {
    if (typeof console !== 'undefined' && console.error) {
        console.error('Service Worker error:', event.error);
    }
});

self.addEventListener('unhandledrejection', (event) => {
    if (typeof console !== 'undefined' && console.error) {
        console.error('Service Worker unhandled rejection:', event.reason);
    }
}); 