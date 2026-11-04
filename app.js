'use strict';

(() => {
  // La portada es también el catálogo del buscador: no se duplican títulos ni rutas.
  const normalize = text => text.toLocaleLowerCase('es').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const articles = [...document.querySelectorAll('.card-button, .latest-post')].map(link => ({
    title: link.querySelector('h3')?.textContent.trim() || '',
    category: link.querySelector('.category')?.textContent.trim() || '',
    lead: link.querySelector('.card-summary, .latest-content > p:not(.category)')?.textContent.trim() || '',
    keywords: link.dataset.searchTerms || '',
    url: link.getAttribute('href')
  })).filter(article => article.title && article.url);

  const toggle = document.querySelector('.search-toggle');
  const panel = document.querySelector('#search-panel');
  const input = document.querySelector('#site-search');
  const results = document.querySelector('#search-results');
  const clearButton = document.querySelector('#clear-search');
  if (!toggle || !panel || !input || !results) return;

  function closeSearch(restoreFocus = true) {
    panel.hidden = true;
    toggle.setAttribute('aria-expanded', 'false');
    if (restoreFocus) toggle.focus();
  }

  function searchArticles(value) {
    const query = normalize(value).trim();
    results.replaceChildren();
    if (!query) return;
    const matches = articles.filter(article =>
      normalize(`${article.title} ${article.category} ${article.lead} ${article.keywords}`).includes(query)
    );
    if (!matches.length) {
      const note = document.createElement('p');
      note.className = 'search-empty';
      note.textContent = 'No encontramos coincidencias en las publicaciones de muestra.';
      results.append(note);
      return;
    }
    matches.forEach(article => {
      const link = document.createElement('a');
      link.className = 'search-result';
      link.href = article.url;
      const heading = document.createElement('span');
      heading.textContent = article.title;
      const category = document.createElement('small');
      category.textContent = article.category;
      link.append(heading, category);
      results.append(link);
    });
  }

  toggle.addEventListener('click', () => {
    if (!panel.hidden) {
      closeSearch();
      return;
    }
    panel.hidden = false;
    toggle.setAttribute('aria-expanded', 'true');
    input.focus();
  });
  input.addEventListener('input', event => searchArticles(event.target.value));
  clearButton?.addEventListener('click', () => {
    input.value = '';
    results.replaceChildren();
    input.focus();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !panel.hidden) closeSearch(panel.contains(document.activeElement));
  });
})();
