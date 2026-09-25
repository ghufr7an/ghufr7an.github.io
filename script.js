// ===== Nav scroll state =====
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// ===== Mobile menu =====
const burger = document.getElementById('burger');
const navLinks = document.querySelector('.nav-links');
burger.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => navLinks.classList.remove('open'));
});

// ===== Cursor glow =====
const cursorGlow = document.getElementById('cursorGlow');
let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
let glowX = mouseX, glowY = mouseY;
document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});
function animateGlow() {
  glowX += (mouseX - glowX) * 0.12;
  glowY += (mouseY - glowY) * 0.12;
  cursorGlow.style.left = glowX + 'px';
  cursorGlow.style.top = glowY + 'px';
  requestAnimationFrame(animateGlow);
}
animateGlow();

// ===== Card hover light =====
document.querySelectorAll('.exp-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const r = card.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 100;
    const y = ((e.clientY - r.top) / r.height) * 100;
    card.style.setProperty('--mx', x + '%');
    card.style.setProperty('--my', y + '%');
  });
});

// ===== Counter animation =====
function animateCount(el) {
  const target = parseInt(el.dataset.target, 10);
  const suffix = el.dataset.suffix || '';
  const duration = 1600;
  const start = performance.now();
  function step(now) {
    const p = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(target * eased) + suffix;
    if (p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}
const counterObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      animateCount(e.target);
      counterObs.unobserve(e.target);
    }
  });
}, { threshold: 0.4 });
document.querySelectorAll('.stat-num').forEach(el => counterObs.observe(el));

// ===== Scroll reveal =====
const revealTargets = document.querySelectorAll(
  '.section-title, .section-tag, .about-grid, .exp-card, .project-card, .tl-item, .cert-card, .edu-card, .contact-item, .vendors-block'
);
revealTargets.forEach(el => el.classList.add('reveal'));

const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
revealTargets.forEach(el => io.observe(el));

// ===== Stagger =====
document.querySelectorAll('.tl-item').forEach((el, i) => {
  el.style.transitionDelay = `${i * 0.09}s`;
});
document.querySelectorAll('.exp-card').forEach((el, i) => {
  el.style.transitionDelay = `${(i % 3) * 0.07}s`;
});
document.querySelectorAll('.project-card').forEach((el, i) => {
  el.style.transitionDelay = `${(i % 3) * 0.07}s`;
});

// ===== Hide cursor glow on touch devices =====
if (window.matchMedia('(hover: none)').matches) {
  cursorGlow.style.display = 'none';
  document.body.style.cursor = 'auto';
  document.querySelectorAll('.btn,.contact-item,.exp-card,.project-card').forEach(el => el.style.cursor = 'auto');
}
