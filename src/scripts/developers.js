// Developers page — copy-to-clipboard for code blocks + sidebar scroll-spy.

function flash(btn, okText) {
  if (!btn) return;
  const orig = btn.innerHTML;
  btn.innerHTML = '<i class="fa-solid fa-check"></i> ' + okText;
  btn.style.color = '#22c55e';
  setTimeout(() => { btn.innerHTML = orig; btn.style.color = ''; }, 1600);
}

function copyBlock(id, ev) {
  if (!ev && window.event) ev = window.event;
  const btn = ev && ev.currentTarget ? ev.currentTarget : null;
  const text = (document.getElementById(id) || {}).textContent || '';
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => flash(btn, 'Copied')).catch(() => {});
  } else {
    const ta = document.createElement('textarea');
    ta.value = text; document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); flash(btn, 'Copied'); } catch (e) {}
    document.body.removeChild(ta);
  }
}

/* Sidebar active on scroll */
const links = document.querySelectorAll('#dev-sidebar a');
const sections = Array.from(links).map((a) => document.querySelector(a.getAttribute('href')));
const spy = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        links.forEach((l) => l.classList.toggle('active', l.getAttribute('href') === '#' + e.target.id));
      }
    });
  },
  { rootMargin: '-40% 0px -55% 0px' }
);
sections.forEach((s) => s && spy.observe(s));

/* Copy buttons pass the clicked element */
document.querySelectorAll('.copy-btn').forEach((btn) => {
  btn.addEventListener('click', function (e) {
    const block = this.closest('.terminal');
    const pre = block ? block.querySelector('pre') : null;
    const id = pre ? pre.id : null;
    if (id) copyBlock(id, e);
  });
});