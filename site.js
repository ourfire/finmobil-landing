// Interacciones del sitio: encabezado, apariciones al hacer scroll y recorrido de "Cómo funciona".
(function () {
  'use strict';

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Encabezado con fondo al hacer scroll
  var header = document.getElementById('header');
  function onScroll() {
    if (header) header.classList.toggle('scrolled', window.scrollY > 24);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Aparición de elementos
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  // Recorrido de pasos
  var STEPS = [
    { t: 'Fondeo', p: 'El inversionista presta a Finmobil mediante un instrumento de deuda privada, con tasa, plazo y calendario de pagos definidos.' },
    { t: 'Compra de cartera', p: 'Con ese capital compramos cartera de libranza que cumple criterios de elegibilidad, tras due diligence del originador.' },
    { t: 'Recaudo', p: 'Las pagadurías descuentan las cuotas de nómina y los flujos llegan a un patrimonio autónomo administrado por una fiduciaria.' },
    { t: 'Pago al inversionista', p: 'Intereses y capital se pagan según el calendario pactado, con reportes periódicos del desempeño de la cartera.' }
  ];
  var panel = document.getElementById('flow-panel');
  var num = document.getElementById('flow-num');
  var bar = document.getElementById('step-bar');
  var buttons = document.querySelectorAll('.step-btn');
  if (!panel || !buttons.length) return;

  var current = 0;
  var timer = null;
  var autoplay = !reduceMotion;

  function show(i) {
    current = i;
    buttons.forEach(function (b, k) { b.setAttribute('aria-selected', k === i ? 'true' : 'false'); });
    var box = document.createElement('div');
    box.className = 'fade';
    var h = document.createElement('h3');
    h.textContent = STEPS[i].t;
    var p = document.createElement('p');
    p.textContent = STEPS[i].p;
    box.appendChild(h);
    box.appendChild(p);
    panel.textContent = '';
    panel.appendChild(box);
    if (num) num.textContent = '0' + (i + 1);
    restartBar();
  }

  function restartBar() {
    if (!bar) return;
    bar.classList.remove('run');
    void bar.offsetWidth; // reinicia la animación
    if (autoplay) bar.classList.add('run');
  }

  function schedule() {
    clearInterval(timer);
    if (autoplay) timer = setInterval(function () { show((current + 1) % STEPS.length); }, 6000);
  }

  buttons.forEach(function (b) {
    b.addEventListener('click', function () {
      autoplay = false; // el usuario toma el control
      clearInterval(timer);
      show(parseInt(b.getAttribute('data-step'), 10));
    });
  });

  // Solo avanza solo mientras la sección está a la vista
  if ('IntersectionObserver' in window && autoplay) {
    new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!autoplay) return;
        if (e.isIntersecting) { restartBar(); schedule(); }
        else { clearInterval(timer); }
      });
    }, { threshold: 0.3 }).observe(panel);
  }
})();
