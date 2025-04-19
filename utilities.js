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
