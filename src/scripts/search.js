"use strict";
// Búsqueda local: el índice /buscar.json se genera en la compilación y se descarga solo al abrir el panel.
(() => {
  const normalize = s => String(s).toLocaleLowerCase('es').normalize('NFD').replace(/[̀-ͯ]/g, '');
  const button = document.querySelector('.search-toggle');
  const panel = document.querySelector('#search-panel');
  const input = document.querySelector('#site-search');
  const results = document.querySelector('#search-results');
  if (!button || !panel || !input || !results) return;
  let index = null;
  let loading = null;

  function load() {
    loading ??= fetch(input.dataset.index || '/buscar.json')
      .then(r => (r.ok ? r.json() : []))
      .then(items => { index = items.map(item => ({ ...item, haystack: normalize([item.title, item.description, item.category, item.author, ...(item.tags || [])].join(' ')) })); })
      .catch(() => { index = []; });
    return loading;
  }
  function message(text) {
    const el = document.createElement('p'); el.className = 'search-empty'; el.textContent = text; results.append(el);
  }
  async function search() {
    const terms = normalize(input.value.trim()).split(/\s+/).filter(Boolean);
    results.replaceChildren();
    if (!terms.length) return;
    if (!index) { message('Cargando…'); await load(); results.replaceChildren(); }
    const matches = index.filter(item => terms.every(t => item.haystack.includes(t))).slice(0, 8);
    if (!matches.length) { message('No encontramos coincidencias.'); return; }
    for (const item of matches) {
      const el = document.createElement('a'); el.className = 'search-result'; el.href = item.url;
      const name = document.createElement('span'); name.textContent = item.title;
      const meta = document.createElement('small'); meta.textContent = `${item.category} · ${item.date}`;
      el.append(name, meta); results.append(el);
    }
  }
  function close() { panel.hidden = true; button.setAttribute('aria-expanded', 'false'); }
  button.addEventListener('click', () => {
    const open = panel.hidden;
    panel.hidden = !open;
    button.setAttribute('aria-expanded', String(open));
    if (open) { input.focus(); load(); }
  });
  input.addEventListener('input', search);
  document.querySelector('#clear-search')?.addEventListener('click', () => { input.value = ''; results.replaceChildren(); input.focus(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !panel.hidden) { close(); button.focus(); } });
})();
