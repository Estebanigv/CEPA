/* CEPA — comportamiento compartido */
(function () {
  "use strict";

  /* ---- Navbar: fondo sólido al hacer scroll ---- */
  var nav = document.querySelector('.nav');
  function onScroll() {
    if (!nav) return;
    nav.classList.toggle('is-scrolled', window.scrollY > 16);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---- Hero: entrada segura (revelar al cargar) ---- */
  var hero = document.querySelector('.hero');
  if (hero) {
    var showHero = function () { hero.classList.add('is-in'); };
    requestAnimationFrame(function () { requestAnimationFrame(showHero); });
    // failsafe: nunca dejar el hero oculto
    setTimeout(showHero, 1200);
    document.addEventListener('visibilitychange', function () {
      if (!document.hidden) showHero();
    });
  }

  /* ---- Panel lateral (drawer) ---- */
  var burger  = document.querySelector('.nav__burger');
  var drawer  = document.getElementById('drawer');
  var overlay = document.getElementById('drawer-overlay');
  var closeBtn = document.getElementById('drawer-close');

  function setDrawer(open) {
    if (!drawer) return;
    drawer.classList.toggle('is-open', open);
    if (overlay) overlay.classList.toggle('is-open', open);
    if (burger) burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    document.body.style.overflow = open ? 'hidden' : '';
    document.body.classList.toggle('drawer-open', open);
    if (open && closeBtn) closeBtn.focus();
  }

  if (burger)   burger.addEventListener('click', function () { setDrawer(true); });
  if (closeBtn) closeBtn.addEventListener('click', function () { setDrawer(false); });
  if (overlay)  overlay.addEventListener('click', function () { setDrawer(false); });
  if (drawer) {
    drawer.addEventListener('click', function (e) {
      if (e.target.closest('a[href]')) setDrawer(false);
    });
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') setDrawer(false);
  });

  /* ---- Scroll reveal ---- */
  var reveals = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && reveals.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          var d = en.target.getAttribute('data-reveal-delay');
          if (d) en.target.style.transitionDelay = d + 'ms';
          en.target.classList.add('is-in');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -10px 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---- Tabs ---- */
  document.querySelectorAll('[data-tabs]').forEach(function (group) {
    var tabs = group.querySelectorAll('[role="tab"]');
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var panelId = tab.getAttribute('aria-controls');
        tabs.forEach(function (t) {
          var sel = t === tab;
          t.setAttribute('aria-selected', sel ? 'true' : 'false');
          t.tabIndex = sel ? 0 : -1;
        });
        group.querySelectorAll('[role="tabpanel"]').forEach(function (p) {
          p.hidden = p.id !== panelId;
        });
      });
      tab.addEventListener('keydown', function (e) {
        var list = Array.prototype.slice.call(tabs);
        var i = list.indexOf(tab);
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
          e.preventDefault();
          var ni = e.key === 'ArrowRight' ? (i + 1) % list.length : (i - 1 + list.length) % list.length;
          list[ni].focus(); list[ni].click();
        }
      });
    });
  });

  /* ---- Acordeón ---- */
  document.querySelectorAll('[data-accordion] .acc__head').forEach(function (head) {
    head.addEventListener('click', function () {
      var item = head.closest('.acc__item');
      var open = item.classList.toggle('is-open');
      head.setAttribute('aria-expanded', open ? 'true' : 'false');
      var body = item.querySelector('.acc__body');
      if (body) body.style.maxHeight = open ? body.scrollHeight + 'px' : '';
    });
  });

  /* ---- Año dinámico en footer ---- */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
