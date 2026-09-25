const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

const burger = document.getElementById('burger');
const navLinks = document.querySelector('.nav-links');
burger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => navLinks.classList.remove('open'));
});

const revealTargets = document.querySelectorAll(
  '.section-title, .about-grid, .exp-card, .tl-item, .cert-card, .edu-card, .contact-item, .hero-stats'
);
revealTargets.forEach(el => el.classList.add('reveal'));

const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

revealTargets.forEach(el => io.observe(el));

document.querySelectorAll('.tl-item').forEach((el, i) => {
  el.style.transitionDelay = `${i * 0.08}s`;
});
document.querySelectorAll('.exp-card').forEach((el, i) => {
  el.style.transitionDelay = `${(i % 3) * 0.06}s`;
});
