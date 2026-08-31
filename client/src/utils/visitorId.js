// Generates (once) and persists a unique ID for this browser, so we can
// count genuinely unique visitors instead of counting every single page load
export function getOrCreateVisitorId() {
  let id = localStorage.getItem('visitorId');
  if (!id) {
    id = 'v_' + Date.now() + '_' + Math.random().toString(36).slice(2, 11);
    localStorage.setItem('visitorId', id);
  }
  return id;
}