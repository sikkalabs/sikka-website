// Shared navigation behaviour: sticky glass nav + mobile hamburger toggle.
const nav = document.getElementById('main-nav');
if (nav) {
  window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 20));
}

const ham = document.getElementById('hamburger');
const mob = document.getElementById('nav-mobile');
if (ham && mob) {
  const setOpen = (open) => {
    ham.classList.toggle('open', open);
    mob.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
    ham.setAttribute('aria-expanded', String(open));
    ham.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  };

  ham.addEventListener('click', () => setOpen(!mob.classList.contains('open')));

  // Close when a menu link is tapped.
  mob.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setOpen(false)));

  // Close on outside taps.
  document.addEventListener('click', (e) => {
    if (mob.classList.contains('open') && !mob.contains(e.target) && !ham.contains(e.target)) {
      setOpen(false);
    }
  });

  // Close on Escape.
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setOpen(false);
  });

  // Reset state when resizing up to desktop.
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) setOpen(false);
  });
}