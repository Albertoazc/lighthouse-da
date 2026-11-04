'use strict';

(() => {
  const toggle = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('#mobile-navigation');
  const desktop = window.matchMedia('(min-width: 741px)');

  function closeMenu() {
    if (!navigation || !toggle) return;
    navigation.hidden = true;
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Abrir menú');
  }

  if (toggle && navigation) {
    toggle.addEventListener('click', () => {
      const open = navigation.hidden;
      navigation.hidden = !open;
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    });
    navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
    desktop.addEventListener('change', event => { if (event.matches) closeMenu(); });
    document.addEventListener('keydown', event => {
      if (event.key !== 'Escape' || navigation.hidden) return;
      const restoreFocus = navigation.contains(document.activeElement) || document.activeElement === toggle;
      closeMenu();
      if (restoreFocus) toggle.focus();
    });
  }

  // La sección activa se declara en cada HTML con aria-current.

  const year = document.querySelector('#current-year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
