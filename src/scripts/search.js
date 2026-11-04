"use strict";
(() => {
  const normalize = s => String(s).toLocaleLowerCase('es').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const cards = [...document.querySelectorAll('.card-button, .latest-post')].map(link => ({
    title: link.querySelector('h3')?.textContent.trim() || '',
    category: link.querySelector('.category')?.textContent.trim() || '',
    lead: link.querySelector('.card-summary, .latest-content > p:not(.category)')?.textContent.trim() || '',
    url: link.getAttribute('href')
  })).filter(a => a.url && a.title);
  const button = document.querySelector('.search-toggle');
  const panel = document.querySelector('#search-panel');
  const input = document.querySelector('#site-search');
  const results = document.querySelector('#search-results');
  if (!button || !panel || !input || !results) return;
  function search() {
    const value = normalize(input.value.trim());
    results.replaceChildren();
    if (!value) return;
    const seen = new Set();
    const matches = cards.filter(a => {
      if (seen.has(a.url)) return false;
      seen.add(a.url);
      return normalize([a.title,a.category,a.lead].join(' ')).includes(value);
    });
    if (!matches.length) { const el=document.createElement('p'); el.className='search-empty'; el.textContent='No encontramos coincidencias.'; results.append(el); }
    matches.forEach(a => {
      const el=document.createElement('a'); el.className='search-result'; el.href=a.url;
      const name=document.createElement('span'); name.textContent=a.title;
      const category=document.createElement('small'); category.textContent=a.category;
      el.append(name,category); results.append(el);
    });
  }
  button.addEventListener('click', () => { const open=panel.hidden; panel.hidden=!open; button.setAttribute('aria-expanded',String(open)); if(open)input.focus(); });
  input.addEventListener('input',search);
  document.querySelector('#clear-search')?.addEventListener('click', () => { input.value=''; results.replaceChildren(); input.focus(); });
  document.addEventListener('keydown',e => { if(e.key==='Escape'&&!panel.hidden) {panel.hidden=true;button.setAttribute('aria-expanded','false');} });
})();
