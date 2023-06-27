`use strict`;

const learnMoreBtn = document.getElementById('btn__learnMore');
const learnMoreSection = document.getElementById('section__learnMore');
const sections = document.querySelectorAll('.section');
const tabContainer = document.getElementById('tabContainer');
const btnTabOne = document.getElementById('btn__tab-01');
const btnTabTwo = document.getElementById('btn__tab-02');
const btnTabThree = document.getElementById('btn__tab-03');
const btnTabFour = document.getElementById('btn__tab-04');
const tabBtns = document.querySelectorAll('.btn__tab');
const tabContents = document.querySelectorAll('.tabContent');
const slides = document.querySelectorAll('.slide');
const btnRight = document.getElementById('btn__right');
const btnLeft = document.getElementById('btn__left');
const btnSignup = document.getElementById('btn__signup');
const modalSignup = document.getElementById('modal__signup');
const overlay = document.getElementById('overlay');
const modalLogin = document.getElementById('modal__login');
const linkLogin = document.getElementById('link__login');
const linkSignup = document.getElementById('link__signup');
const maxSlide = slides.length - 1;
let curSlide = 0;

// Smooth Scrolling
learnMoreBtn.addEventListener('click', () => {
  learnMoreSection.scrollIntoView({ behavior: 'smooth' });
});

// IntersectionObserver:
const revealSection = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  else {
    entry.target.classList.remove('section__hidden');
    entry.target.classList.add('section__fade-in');
    observer.unobserve(entry.target);
  }
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

sections.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add('section__hidden');
});

// Tab Buttons and Contents
tabContainer.addEventListener('click', (e) => {
  const clicked = e.target.closest('.btn__tab');
  if (!clicked) return;
  tabBtns.forEach((tb) => tb.classList.remove('btn__active'));
  clicked.classList.add('btn__active');
  tabContents.forEach((tc) => tc.classList.add('hidden'));
  document
    .querySelector(`#tabContent__${clicked.dataset.tab}`)
    .classList.remove('hidden');
});

// Slider
const goToSlide = function (slide) {
  slides.forEach(
    (s, i) => (s.style.transform = `translateX(${(i - slide) * 100}%)`)
  );
};

goToSlide(0);

const nextSlide = function () {
  if (curSlide === maxSlide) {
    curSlide = 0;
  } else {
    curSlide++;
  }
  goToSlide(curSlide);
};

const prevSlide = function () {
  if (curSlide === 0) {
    curSlide = maxSlide;
  } else {
    curSlide--;
  }
  goToSlide(curSlide);
};

btnRight.addEventListener('click', nextSlide);
btnLeft.addEventListener('click', prevSlide);

document.addEventListener('keydown', function (e) {
  e.key === 'ArrowRight' && nextSlide();
  e.key === 'ArrowLeft' && prevSlide();
});

const openModal = (e) => {
  e.preventDefault();
  modalSignup.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = (e) => {
  e.preventDefault();
  modalSignup.classList.add('hidden');
  overlay.classList.add('hidden');
  modalLogin.classList.add('hidden');
};

btnSignup.addEventListener('click', openModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modalSignup.classList.contains('hidden')) {
    closeModal();
  }
});

linkLogin.addEventListener('click', (e) => {
  e.preventDefault();
  modalSignup.classList.add('hidden');
  modalLogin.classList.remove('hidden');
});

linkSignup.addEventListener('click', (e) => {
  e.preventDefault();
  modalSignup.classList.remove('hidden');
  modalLogin.classList.add('hidden');
});
