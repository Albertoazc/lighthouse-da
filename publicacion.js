'use strict';

(() => {
  const article = document.querySelector('#articulo');
  const progress = document.querySelector('#reading-progress-bar');
  const header = document.querySelector('.site-header');
  const toc = document.querySelector('details.toc');
  const tocLinks = [...document.querySelectorAll('.toc nav a')];
  const sections = tocLinks.map(link => document.getElementById(link.hash.slice(1))).filter(Boolean);

  if (toc) {
    const compact = window.matchMedia('(max-width: 900px)');
    toc.open = !compact.matches;
    compact.addEventListener('change', event => { toc.open = !event.matches; });
  }

  if (article) {
    let scheduled = false;
    function updateReading() {
      scheduled = false;
      const offset = (header?.getBoundingClientRect().height || 0) + 24;
      const bounds = article.getBoundingClientRect();
      const start = bounds.top + window.scrollY - offset;
      const end = bounds.bottom + window.scrollY - window.innerHeight;
      const percentage = end > start ? 100 * (window.scrollY - start) / (end - start) : (window.scrollY >= start ? 100 : 0);
      if (progress) progress.style.width = `${Math.min(100, Math.max(0, percentage))}%`;

      // Una sola sección activa, incluso al saltar directamente a un ancla.
      const active = sections.filter(section => section.getBoundingClientRect().top <= offset + 1).at(-1) || sections[0];
      tocLinks.forEach(link => {
        const current = link.hash === `#${active?.id}`;
        link.classList.toggle('toc-active', current);
        if (current) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    }
    function scheduleUpdate() {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(updateReading);
    }
    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate);
    window.addEventListener('load', scheduleUpdate);
    if ('ResizeObserver' in window) new ResizeObserver(scheduleUpdate).observe(article);
    document.fonts?.ready.then(scheduleUpdate);
    updateReading();
  }

  const shareButton = document.querySelector('#share-button');
  const feedback = document.querySelector('#share-feedback');
  if (shareButton && feedback) {
    shareButton.hidden = false;
    shareButton.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(window.location.href);
        feedback.textContent = 'Enlace copiado al portapapeles.';
      } catch {
        feedback.textContent = 'Copia la dirección de la barra del navegador para compartir.';
      }
    });
  }
})();
