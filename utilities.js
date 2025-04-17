async function nukeEverything() {
    console.log('🧨 Nuking service workers, caches, localStorage, and IndexedDB...');

    const regs = await navigator.serviceWorker.getRegistrations();
    await Promise.all(regs.map(r => {
        console.log('🔪 Unregistering SW:', r.scope);
        return r.unregister();
    }));

    const keys = await caches.keys();
    await Promise.all(keys.map(k => {
        console.log('🧹 Deleting cache:', k);
        return caches.delete(k);
    }));

    localStorage.clear();
    console.log('🧼 Cleared localStorage');

    if (indexedDB.databases) {
        const dbs = await indexedDB.databases();
        await Promise.all(dbs.map(db => {
            console.log('💣 Deleting DB:', db.name);
            return indexedDB.deleteDatabase(db.name);
        }));
    }

    console.log('✅ Done. Reloading...');
    location.reload();
}

async function testServiceWorker() {
    if (!('serviceWorker' in navigator)) {
        console.warn('🚫 Service workers not supported in this browser.');
        return;
    }

    const reg = await navigator.serviceWorker.getRegistration('/');
    if (!reg) {
        console.warn('🚫 No service worker registered at "/"');
        return;
    }

    console.log('✅ Service worker registered:', reg.scope);
    console.log('📄 Script URL:', reg.active?.scriptURL || '(none)');
    console.log('📦 State:', reg.active?.state || '(no active worker)');

    if (navigator.serviceWorker.controller) {
        console.log('🧠 Controlled by SW:', navigator.serviceWorker.controller.scriptURL);
    } else {
        console.warn('⚠️ This page is NOT controlled by a service worker (yet). Try refreshing.');
    }

    const versionMatch = reg.active?.scriptURL.match(/v(\d+\.\d+\.\d+)/);
    if (versionMatch) {
        console.log('🏷️ Loaded SW version:', versionMatch[1]);
    } else {
        console.warn('❓ Could not determine SW version from script URL.');
    }

    // optional: log all registrations
    const allRegs = await navigator.serviceWorker.getRegistrations();
    if (allRegs.length > 1) {
        console.log('🧾 All SW registrations:');
        allRegs.forEach(r => console.log('-', r.scope, r.active?.scriptURL));
    }
}
