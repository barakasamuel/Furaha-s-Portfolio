// Theme toggle
const themeToggle = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);
themeToggle.querySelector('i').className = savedTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';

themeToggle.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  themeToggle.querySelector('i').className = next === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
});

// Carousel
document.querySelectorAll('.carousel').forEach(carousel => {
  const track = carousel.querySelector('.car-track');
  const imgs = track.querySelectorAll('img');
  const dotsContainer = carousel.querySelector('.car-dots');
  let current = 0, autoSlide;

  // Create dots
  imgs.forEach((_, i) => {
    const dot = document.createElement('span');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(dot);
  });

  function goTo(index) {
    current = (index + imgs.length) % imgs.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    dotsContainer.querySelectorAll('span').forEach((d, i) => d.classList.toggle('active', i === current));
  }

  carousel.querySelector('.car-prev').addEventListener('click', () => { goTo(current - 1); resetAuto(); });
  carousel.querySelector('.car-next').addEventListener('click', () => { goTo(current + 1); resetAuto(); });

  function resetAuto() { clearInterval(autoSlide); autoSlide = setInterval(() => goTo(current + 1), 3500); }
  resetAuto();

  // Swipe support
  let startX = 0;
  track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; });
  track.addEventListener('touchend', e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) { diff > 0 ? goTo(current + 1) : goTo(current - 1); resetAuto(); }
  });
});

// Lightbox
const lightbox = document.getElementById('lightbox');
const lbImg = document.getElementById('lbImg');
let galleryImgs = [], lbIndex = 0;

document.querySelectorAll('.view-photos-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    galleryImgs = btn.getAttribute('data-images').split(',').map(src => ({ src: src.trim() }));
    lbIndex = 0;
    lbImg.src = galleryImgs[0].src;
    lightbox.classList.add('open');
  });
});

document.getElementById('lbClose').addEventListener('click', () => lightbox.classList.remove('open'));
lightbox.addEventListener('click', e => { if (e.target === lightbox) lightbox.classList.remove('open'); });
lightbox.addEventListener('touchend', e => { if (e.target === lightbox) lightbox.classList.remove('open'); });

document.getElementById('lbPrev').addEventListener('click', () => {
  lbIndex = (lbIndex - 1 + galleryImgs.length) % galleryImgs.length;
  lbImg.src = galleryImgs[lbIndex].src;
});

document.getElementById('lbNext').addEventListener('click', () => {
  lbIndex = (lbIndex + 1) % galleryImgs.length;
  lbImg.src = galleryImgs[lbIndex].src;
});

document.addEventListener('keydown', e => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'ArrowLeft') document.getElementById('lbPrev').click();
  if (e.key === 'ArrowRight') document.getElementById('lbNext').click();
  if (e.key === 'Escape') lightbox.classList.remove('open');
});

// Touch swipe for mobile
let touchStartX = 0;
lightbox.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; });
lightbox.addEventListener('touchend', e => {
  const diff = touchStartX - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 50) {
    if (diff > 0) document.getElementById('lbNext').click();
    else document.getElementById('lbPrev').click();
  }
});


const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
  document.getElementById('backToTop').classList.toggle('visible', window.scrollY > 400);
});

// Active nav link on scroll
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 80) current = s.getAttribute('id');
  });
  navLinks.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === `#${current}`);
  });
});

// Mobile menu toggle
document.getElementById('hamburger').addEventListener('click', () => {
  document.getElementById('mobileMenu').classList.toggle('open');
});
document.querySelectorAll('.mobile-menu a').forEach(a => {
  a.addEventListener('click', () => document.getElementById('mobileMenu').classList.remove('open'));
});

document.getElementById('year').textContent = new Date().getFullYear();
document.getElementById('contactForm').addEventListener('submit', e => {
  e.preventDefault();
  const msg = document.getElementById('formMsg');
  msg.textContent = '✓ Message sent! I\'ll get back to you soon.';
  e.target.reset();
  setTimeout(() => msg.textContent = '', 4000);
});
