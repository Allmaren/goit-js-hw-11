import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import FetchData from './js/fetchImage';

const inputRequest = new FetchData();
const form = document.querySelector('.search-form');
// const btnMore = document.querySelector('.load-more');
const gallery = document.querySelector('.gallery');
const scrollUpBtn = document.getElementById('scrollUp');

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

form.addEventListener('submit', onSearchPhoto);
scrollUpBtn.addEventListener('click', onLoadMore);

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

function onError(error) {
  if (error.response) {
    Notify.failure(
      `Sorry, an error occurred - ${error.response.status}. Try again`
    );
  } else if (error.request) {
    Notify.failure(
      'Sorry, the request was made, but no response was received. Try again'
    );
  }
}

function onLoadPhotos(response) {
  let totalHits = response.data.totalHits;

  if (totalHits === 0) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again'
    );
    return;
  }

  if (totalHits !== 0) {
    Notify.success(`Hooray! We found ${totalHits} images`);
  }

  let photos = response.data.hits;
  renderEvents(photos);
  simpleLightBox.refresh();
}

async function onLoadMore() {
  if (inputRequest.totalHits < inputRequest.perPage) {
    reachedEndSearch();
    return;
  }
  await inputRequest.fetchPhoto().then(onLoadPhotos).catch(onError);
}

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
                <img src="${webformatURL}" alt="${tags}" loading="lazy" />
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
  simpleLightBox();
}

function reachedEndSearch() {
  Notify.warning(
    `We're sorry, but you've reached the end of search "${inputRequest.searchQuery.toUpperCase()}". Please start a new search`
  );
}
