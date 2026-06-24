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

// Navbar border opacity bump on scroll (same gold tint as the resting border).
const nav = document.getElementById('nav');
if (nav) {
  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 12);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}
