// Add your public profile links here. Empty values are automatically hidden,
// so the deployed site never shows broken placeholder buttons.
const PROFILE = {
  email: "",
  linkedin: "",
  github: ""
};

const header = document.querySelector('.site-header');
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-nav');
const progress = document.querySelector('.scroll-progress span');
const glow = document.querySelector('.cursor-glow');
const navLinks = [...document.querySelectorAll('.site-nav a[href^="#"]')];

if (menuToggle && nav) {
  menuToggle.addEventListener('click', () => {
    const open = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!open));
    nav.classList.toggle('open', !open);
    document.body.classList.toggle('menu-open', !open);
  });

  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    menuToggle.setAttribute('aria-expanded', 'false');
    nav.classList.remove('open');
    document.body.classList.remove('menu-open');
  }));
}

const onScroll = () => {
  const y = window.scrollY;
  header?.classList.toggle('scrolled', y > 18);
  const max = document.documentElement.scrollHeight - window.innerHeight;
  if (progress) progress.style.width = `${max > 0 ? (y / max) * 100 : 0}%`;
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

if (glow && window.matchMedia('(pointer:fine)').matches) {
  window.addEventListener('pointermove', e => {
    glow.animate({ left: `${e.clientX}px`, top: `${e.clientY}px` }, { duration: 700, fill: 'forwards' });
  }, { passive: true });
}

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -35px' });

document.querySelectorAll('.reveal').forEach((el, index) => {
  el.style.transitionDelay = `${Math.min(index % 4, 3) * 70}ms`;
  revealObserver.observe(el);
});

const sections = [...document.querySelectorAll('main section[id]')];
const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
  });
}, { rootMargin: '-35% 0px -58% 0px', threshold: 0 });
sections.forEach(section => sectionObserver.observe(section));

const setProfileLink = (selector, value, prefix = '') => {
  const el = document.querySelector(selector);
  if (!el || !value) return;
  el.href = `${prefix}${value}`;
  el.hidden = false;
};
setProfileLink('.profile-email', PROFILE.email, 'mailto:');
setProfileLink('.profile-linkedin', PROFILE.linkedin);
setProfileLink('.profile-github', PROFILE.github);

document.getElementById('year').textContent = new Date().getFullYear();
