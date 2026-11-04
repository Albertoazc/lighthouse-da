"use strict";
(() => {
  const toggle=document.querySelector('.menu-toggle');
  const nav=document.querySelector('#mobile-navigation');
  function close() { if(!nav||!toggle)return; nav.hidden=true;toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Abrir menú'); }
  if(toggle&&nav) {
    toggle.addEventListener('click', () => {const show=nav.hidden;nav.hidden=!show;toggle.setAttribute('aria-expanded',String(show));toggle.setAttribute('aria-label',show?'Cerrar menú':'Abrir menú');});
    nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',close));
    window.matchMedia('(min-width: 741px)').addEventListener('change',e=>{if(e.matches)close();});
    document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!nav.hidden)close();});
  }
  const year=document.querySelector('#current-year'); if(year) year.textContent=String(new Date().getFullYear());
})();
