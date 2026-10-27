// Site-wide behavior: solid header on scroll, mobile menu, fade-up on scroll.

const header = document.querySelector<HTMLElement>('[data-header]');
const toggle = document.querySelector<HTMLButtonElement>('[data-menu-toggle]');
const nav = document.getElementById('site-nav');

function setMenu(open: boolean) {
  if (!header || !toggle) return;
  header.classList.toggle('menu-open', open);
  toggle.setAttribute('aria-expanded', String(open));
  updateHeader();
}

function updateHeader() {
  if (!header) return;
  const scrolled = window.scrollY > 8;
  header.classList.toggle('is-solid', scrolled || header.classList.contains('menu-open'));
}

if (header) {
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });
}

if (header && toggle && nav) {
  toggle.addEventListener('click', () => {
    setMenu(toggle.getAttribute('aria-expanded') !== 'true');
  });

  nav.addEventListener('click', (event) => {
    if ((event.target as HTMLElement).closest('a')) setMenu(false);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && header.classList.contains('menu-open')) {
      setMenu(false);
      toggle.focus();
    }
  });

  document.addEventListener('click', (event) => {
    if (header.classList.contains('menu-open') && !header.contains(event.target as Node)) {
      setMenu(false);
    }
  });

  window.matchMedia('(min-width: 960px)').addEventListener('change', (event) => {
    if (event.matches) setMenu(false);
  });
}

// Fade-up: elements with .reveal ease in once as they enter the viewport.
const reveals = document.querySelectorAll<HTMLElement>('.reveal');
if (reveals.length && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      }
    },
    { rootMargin: '0px 0px -10% 0px' },
  );
  reveals.forEach((el) => observer.observe(el));
} else {
  reveals.forEach((el) => el.classList.add('is-visible'));
}

// Hero video: visible pause/play button; no autoplay with reduced motion.
const video = document.querySelector<HTMLVideoElement>('[data-hero-video]');
const videoToggle = document.querySelector<HTMLButtonElement>('[data-video-toggle]');
if (video && videoToggle) {
  const label = videoToggle.querySelector('[data-video-label]');
  const sync = () => {
    videoToggle.classList.toggle('is-paused', video.paused);
    if (label) {
      label.textContent = video.paused
        ? (videoToggle.dataset.playLabel ?? '')
        : (videoToggle.dataset.pauseLabel ?? '');
    }
  };
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) video.pause();
  video.addEventListener('play', sync);
  video.addEventListener('pause', sync);
  videoToggle.addEventListener('click', () => {
    if (video.paused) void video.play();
    else video.pause();
  });
  sync();
}
