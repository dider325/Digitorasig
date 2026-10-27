(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const body = document.body;
  const loader = $('#loader');
  const progress = $('#loader-progress');
  const number = $('#loader-number');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const menuButton = $('.menu-toggle');
  const nav = $('.primary-nav');
  const year = $('#year');
  if (year) year.textContent = new Date().getFullYear();

  // Accessible mobile navigation.
  menuButton?.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') !== 'true';
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    nav?.classList.toggle('open', open);
  });
  $$('.primary-nav a').forEach(link => link.addEventListener('click', () => {
    nav?.classList.remove('open');
    menuButton?.setAttribute('aria-expanded', 'false');
    menuButton?.setAttribute('aria-label', 'Open navigation');
  }));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && nav?.classList.contains('open')) {
      nav.classList.remove('open');
      menuButton?.setAttribute('aria-expanded', 'false');
      menuButton?.focus();
    }
  });

  const revealPage = () => {
    body.classList.remove('is-loading');
    body.classList.add('is-ready');
    if (loader) {
      loader.classList.add('is-done');
      window.setTimeout(() => loader.remove(), 1100);
    }
    runEntrance();
  };

  function runEntrance() {
    // CSS-visible fallback is intentional: the page remains usable without any CDN libraries.
    const gsapReady = window.gsap && !reducedMotion;
    if (!gsapReady) {
      $$('.hero .headline-left, .hero .headline-right, .hero .character, .hero .topbar, .hero .side-label, .hero .intro-block, .hero .scroll-indicator, .hero .create-note, .hero .bottom-word, .hero .hero-index').forEach(el => {
        el.style.opacity = '1';
      });
      return;
    }
    const gsap = window.gsap;
    const tl = gsap.timeline({defaults: {ease: 'power3.out'}});
    tl.fromTo('.headline-left', {xPercent: -8, opacity: 0}, {xPercent: 0, opacity: 1, duration: .85}, 0)
      .fromTo('.headline-right', {xPercent: 8, opacity: 0}, {xPercent: 0, opacity: 1, duration: .85}, .32)
      .fromTo('.character', {xPercent: -50, yPercent: 12, opacity: 0}, {xPercent: -50, yPercent: 0, opacity: 1, duration: 1.05, ease: 'power2.out'}, .62)
      .fromTo('.bottom-word', {yPercent: 28, opacity: 0, clipPath: 'inset(35% 0 0 0)'}, {yPercent: 0, opacity: 1, clipPath: 'inset(0% 0 0 0)', duration: .85}, 1.02)
      .fromTo('.topbar', {y: -16, opacity: 0}, {y: 0, opacity: 1, duration: .55}, 1.18)
      .fromTo('.side-label, .intro-block, .scroll-indicator, .create-note, .hero-index', {y: 12, opacity: 0}, {y: 0, opacity: 1, duration: .55, stagger: .07}, 1.35);
  }

  // Loader holds for seven seconds in normal mode. Reduced-motion users are not held behind it.
  const start = performance.now();
  const duration = reducedMotion ? 0 : 7000;
  let finished = false;
  const tick = now => {
    if (finished) return;
    const ratio = duration === 0 ? 1 : Math.min(1, (now - start) / duration);
    const pct = Math.round(ratio * 100);
    if (progress) progress.style.width = `${pct}%`;
    if (number) number.textContent = String(pct).padStart(2, '0');
    if (ratio >= 1) {
      finished = true;
      revealPage();
    } else requestAnimationFrame(tick);
  };
  body.classList.add('is-loading');
  // Safety timeout guarantees content reveal if a frame callback is interrupted.
  const safety = window.setTimeout(() => {
    if (!finished) { finished = true; revealPage(); }
  }, duration + 250);
  requestAnimationFrame(tick);
  window.addEventListener('pageshow', () => {
    if (loader && !loader.classList.contains('is-done') && !finished) {
      window.clearTimeout(safety);
      finished = true;
      revealPage();
    }
  }, {once: true});

  // Lenis + GSAP ScrollTrigger integration; native scrolling remains the fallback.
  function initScrollStory() {
    if (reducedMotion || !window.gsap || !window.ScrollTrigger) return;
    const gsap = window.gsap;
    gsap.registerPlugin(window.ScrollTrigger);
    if (window.Lenis) {
      try {
        const lenis = new window.Lenis({duration: 1.05, smoothWheel: true, touchMultiplier: 1.05, wheelMultiplier: 1});
        lenis.on('scroll', window.ScrollTrigger.update);
        gsap.ticker.add(time => lenis.raf(time * 1000));
        gsap.ticker.lagSmoothing(0);
        window.addEventListener('beforeunload', () => lenis.destroy(), {once: true});
      } catch (_) { /* Native scroll is still fully supported. */ }
    }
    try {
      const hero = $('.hero');
      const scrollTl = gsap.timeline({scrollTrigger: {trigger: hero, start: 'top top', end: 'bottom top', scrub: .8}});
      scrollTl.to('.headline-left', {x: '-8vw', opacity: .12, ease: 'none'}, 0)
        .to('.headline-right', {x: '8vw', opacity: .12, ease: 'none'}, 0)
        .to('.character', {y: '7vh', scale: .97, ease: 'none'}, 0)
        .to('.bottom-word', {y: '-9vh', ease: 'none'}, 0)
        .to('.side-label, .intro-block, .scroll-indicator, .create-note', {y: -18, opacity: 0, ease: 'none'}, 0);
      $$('.manifesto h2 span').forEach((line, i) => gsap.from(line, {y: 35, opacity: 0, duration: .8, delay: i * .06, ease: 'power3.out', scrollTrigger: {trigger: line, start: 'top 88%', once: true}}));
      $$('.project-card').forEach((card, i) => gsap.from(card, {y: 45, opacity: 0, duration: .8, delay: i * .08, ease: 'power3.out', scrollTrigger: {trigger: card, start: 'top 88%', once: true}}));
      $$('.service-row').forEach(row => gsap.from(row, {x: -22, opacity: 0, duration: .65, ease: 'power3.out', scrollTrigger: {trigger: row, start: 'top 90%', once: true}}));
      gsap.from('.about-copy > *', {y: 22, opacity: 0, duration: .7, stagger: .08, ease: 'power3.out', scrollTrigger: {trigger: '.about-copy', start: 'top 82%', once: true}});
      gsap.from('.contact h2', {y: 55, opacity: 0, duration: .9, ease: 'power3.out', scrollTrigger: {trigger: '.contact h2', start: 'top 88%', once: true}});
      window.ScrollTrigger.refresh();
    } catch (_) { /* A partial animation failure must never hide content. */ }
  }
  // CDN scripts are deferred and appear before this file; wait briefly without delaying page usability.
  if (document.readyState === 'complete') initScrollStory();
  else window.addEventListener('load', initScrollStory, {once: true});
})();
