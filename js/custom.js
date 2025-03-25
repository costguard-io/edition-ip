/*
 @todo tarek
 - push notifications
 - caching PWA files
 */

document.addEventListener('DOMContentLoaded', () => {
    // Select all manage buttons and their corresponding dropdown menus

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/js/service-workers.js?v=1.2.12');
    }

});
