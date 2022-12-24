export { onTop, onScroll };

const onTopButton = document.querySelector('.up_button');

window.addEventListener('scroll', onScroll);
onTopButton.addEventListener('click', onTop);

function onScroll() {
  const scrolled = window.pageYOffset;
  const coords = document.documentElement.clientHeight;

  if (scrolled > coords) {
    onTopButton.classList.remove('visually-hidden');
  }
  if (scrolled < coords) {
    onTopButton.classList.add('visually-hidden');
  }
}

function onTop() {
  if (window.pageYOffset > 0) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
