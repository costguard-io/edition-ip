const SW_VERSION = '1.3.34';
const SW_FILE = `/service-worker.v${SW_VERSION}.js`;

if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
        try {
            const reg = await navigator.serviceWorker.register(SW_FILE, { scope: '/' });
            console.log('✅ SW registered:', reg.scope);

            if (reg.waiting) reg.waiting.postMessage({ type: 'SKIP_WAITING' });

            reg.addEventListener('updatefound', () => {
                const newSW = reg.installing;
                newSW?.addEventListener('statechange', () => {
                    if (newSW.state === 'installed' && navigator.serviceWorker.controller) {
                        console.log('📦 New SW installed, pending activation');
                    }
                });
            });

            const trySkip = () => reg.waiting?.postMessage({ type: 'SKIP_WAITING' });
            window.addEventListener('beforeunload', trySkip);
            window.addEventListener('pagehide', trySkip);

        } catch (err) {
            console.error('❌ SW registration failed:', err);
        }
    });
}
