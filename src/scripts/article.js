"use strict";
(() => {
  const progress=document.querySelector('#reading-progress-bar');
  const article=document.querySelector('#articulo');
  const tocLinks=[...document.querySelectorAll('.toc nav a')];
  const sections=tocLinks.map(a=>document.getElementById(a.hash.slice(1))).filter(Boolean);
  let scheduled=false;
  function update() {
    scheduled=false;
    if(progress){
      const container=article||document.body;
      const rect=container.getBoundingClientRect();
      const start=rect.top+window.scrollY;
      const max=rect.bottom+window.scrollY-window.innerHeight-start;
      progress.style.width=`${max>0?Math.min(100,Math.max(0,(window.scrollY-start)*100/max)):100}%`;
    }
    if(sections.length) {
      const offset=(document.querySelector('.site-header')?.offsetHeight||0)+35;
      const selected=sections.filter(s=>s.getBoundingClientRect().top<=offset).at(-1)||sections[0];
      tocLinks.forEach(a=>{
        const active=a.hash===`#${selected.id}`;
        a.classList.toggle('toc-active',active);
        if(active)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');
      });
    }
  }
  window.addEventListener('scroll',()=>{if(!scheduled){scheduled=true;requestAnimationFrame(update);}}, {passive:true});
  window.addEventListener('resize',update);
  update();
  document.querySelector('#share-button')?.addEventListener('click',async()=>{
    const feedback=document.querySelector('#share-feedback');
    try{await navigator.clipboard.writeText(location.href);if(feedback)feedback.textContent='Enlace copiado al portapapeles.';}
    catch{if(feedback)feedback.textContent='Copia la dirección del navegador.';}
  });
})();
