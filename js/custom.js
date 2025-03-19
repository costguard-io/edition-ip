document.addEventListener('DOMContentLoaded', () => {
    // Select all manage buttons and their corresponding dropdown menus

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/js/service-worker.js');
    }

});
