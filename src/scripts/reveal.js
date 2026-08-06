// Scroll-reveal: adds the `.revealed` class (opacity/transform handled in CSS)
// when a `.reveal` element scrolls into view. Replaces the old GSAP animation.
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('revealed');
        observer.unobserve(e.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));