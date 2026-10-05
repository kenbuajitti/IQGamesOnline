(() => {
  'use strict';
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const hoverAvailable = window.matchMedia('(any-hover: hover)');
  let active = null;

  function stop(card) {
    const video = card.querySelector('.game-trailer');
    card.classList.remove('trailer-playing');
    if (video.tagName === 'IFRAME') {
      video.removeAttribute('src');
      if (active === card) active = null;
      return;
    }
    video.pause();
    if (video.readyState > 0) video.currentTime = 0;
    if (active === card) active = null;
  }

  function start(card) {
    if (reducedMotion.matches || document.hidden || active === card) return;
    if (active) stop(active);
    active = card;
    const video = card.querySelector('.game-trailer');
    // Fetch only the trailer the visitor chooses to preview.
    if (!video.getAttribute('src')) video.src = video.dataset.src;
    if (video.tagName === 'IFRAME') {
      card.classList.add('trailer-playing');
      return;
    }
    video.muted = true;
    const play = video.play();
    if (play) play.catch(() => {
      if (active === card) stop(card);
    });
  }

  const observer = 'IntersectionObserver' in window
    ? new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting && active === entry.target) stop(entry.target);
      });
    }) : null;

  document.querySelectorAll('.game').forEach(card => {
    const video = card.querySelector('.game-trailer');
    if (!video) return;
    card.addEventListener('pointerenter', event => {
      if (hoverAvailable.matches && event.pointerType !== 'touch') start(card);
    });
    card.addEventListener('pointerleave', () => stop(card));
    card.addEventListener('focus', () => start(card));
    card.addEventListener('blur', () => stop(card));
    video.addEventListener('playing', () => {
      if (active === card) card.classList.add('trailer-playing');
      else stop(card);
    });
    video.addEventListener('error', () => {
      stop(card);
      card.classList.add('trailer-unavailable');
    });
    if (observer) observer.observe(card);
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden && active) stop(active);
  });
  window.addEventListener('pagehide', () => { if (active) stop(active); });
  reducedMotion.addEventListener('change', () => {
    if (reducedMotion.matches && active) stop(active);
  });
})();
