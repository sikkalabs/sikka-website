// Shared navigation behaviour: sticky glass nav + mobile hamburger toggle.
const nav = document.getElementById('main-nav');
if (nav) {
  window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 20));
}

const ham = document.getElementById('hamburger');
const mob = document.getElementById('nav-mobile');
if (ham && mob) {
  ham.addEventListener('click', () => {
    ham.classList.toggle('open');
    mob.classList.toggle('open');
  });
}