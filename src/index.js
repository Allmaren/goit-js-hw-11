import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import FetchData from './js/fetchImage';
import { onTop } from './js/buttonUp';

const inputRequest = new FetchData();
const form = document.querySelector('.search-form');
const btnMore = document.querySelector('.load-more');
const gallery = document.querySelector('.gallery');
const footer = document.querySelector('.footer');
const onTopButton = document.querySelector('.up_button');

form.addEventListener('submit', onSearchPhoto);
btnMore.addEventListener('click', onLoadMore);
// onTopButton.addEventListener('click', onTop());

function simpleLightBox() {
  let lightbox = new SimpleLightbox('.gallery a', {
    captions: false,
    captionDelay: 250,
    scrollZoom: false,
    enableKeyboard: true,
    doubleTapZoom: 5,
  });
  lightbox.refresh();
}
/*fetch*/
async function onSearchPhoto(event) {
  event.preventDefault();
  gallery.innerHTML = '';

  const searchQuery = event.currentTarget.searchQuery.value;
  if (!searchQuery || searchQuery.length < 3) {
    Notify.warning(
      'Warning! Search must not be empty and includes more then 2 letters'
    );
    return;
  }
  inputRequest.resetPage();
  inputRequest.searchQuery = searchQuery;
  await inputRequest.fetchPhoto().then(onLoadPhotos).catch(onError);
}

/*error handlers*/
function onError(error) {
  if (error.response) {
    Notify.failure(
      `Sorry, an error occurred - ${error.response.status}. Try again`
    );
    footer.classList.add('is-hidden');
  } else if (error.request) {
    Notify.failure(
      'Sorry, the request was made, but no response was received. Try again'
    );
    btnMore.classList.add('visually-hidden');
  }
}

function reachedEndSearch() {
  Notify.warning(
    `We're sorry, but you've reached the end of search "${inputRequest.searchQuery.toUpperCase()}". Please start a new search`
  );
  btnMore.classList.add('visually-hidden');
}

function onLoadPhotos(response) {
  let totalHits = response.data.totalHits;

  if (totalHits < 40) {
    console.log(totalHits);
    btnMore.classList.add('visually-hidden');
  }
  if (totalHits === 0) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again'
    );
    btnMore.classList.add('visually-hidden');
    return;
  }

  if (totalHits !== 0 && totalHits > 40) {
    Notify.success(`Hooray! We found ${totalHits} images`);
    btnMore.classList.remove('visually-hidden');
  }

  let photos = response.data.hits;
  renderEvents(photos);
  simpleLightBox.refresh();
}

/*render*/
function renderEvents(events) {
  const markup = events
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `  <div class="photo-card">
                <a href="${largeImageURL}">
                <img src="${webformatURL}" alt="${tags}" class="gallery-image" loading="lazy" />
                <div class="info">
                  <p class="info-item">
                    <b>Likes ${likes}</b>
                  </p>
                  <p class="info-item">
                    <b>Views ${views}</b>
                  </p>
                  <p class="info-item">
                    <b>Comments ${comments}</b>
                  </p>
                  <p class="info-item">
                    <b>Downloads ${downloads}</b>
                  </p>
                </div>
              </div>
                `;
      }
    )
    .join('');

  gallery.insertAdjacentHTML('beforeend', markup);
  footer.classList.remove('is-hidden');

  simpleLightBox();
}

/*morePhotos*/
async function onLoadMore() {
  if (inputRequest.totalHits < inputRequest.perPage) {
    reachedEndSearch();
    return;
  }

  await inputRequest.fetchPhoto().then(onLoadPhotos).catch(onError);
}
