// Mobile burger menu
const burger = document.getElementById('burger');
const navMobile = document.getElementById('navMobile');

if (burger && navMobile) {
  burger.addEventListener('click', () => {
    navMobile.classList.toggle('open');
  });
  navMobile.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => navMobile.classList.remove('open'));
  });
}

// Subtle navbar shadow on scroll
const nav = document.getElementById('nav');
if (nav) {
  const onScroll = () => {
    if (window.scrollY > 12) {
      nav.style.boxShadow = '0 1px 0 rgba(201, 168, 76, 0.15)';
    } else {
      nav.style.boxShadow = 'none';
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}
