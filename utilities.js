async function nukeEverything() {
  const regs = await navigator.serviceWorker.getRegistrations();
  await Promise.all(regs.map(r => r.unregister()));
  const keys = await caches.keys();
  await Promise.all(keys.map(k => caches.delete(k)));
  localStorage.clear();
  if (indexedDB.databases) {
    const dbs = await indexedDB.databases();
    await Promise.all(dbs.map(db => indexedDB.deleteDatabase(db.name)));
  }
  location.reload();
}

async function testServiceWorker() {
  const reg = await navigator.serviceWorker.getRegistration('/');
  console.log('SW Registration:', reg);
}
