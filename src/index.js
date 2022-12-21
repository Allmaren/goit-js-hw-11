import { Notify } from 'notiflix/build/notiflix-notify-aio';

// const { all } = require('axios');

const refs = {
  form: document.querySelector('.search-form'),
  btnMore: document.querySelector('.more'),
  gallery: document.querySelector('.gallery'),
};

const API_KEY = '32132732-163b27f3205d6aad07e142ebf';
const BASE_URL = 'https://pixabay.com/api/';

let page = 1;
let elements = '';

function fetchEvents(page, keyword) {
  const params = new URLSearchParams({
    key: API_KEY,
    q: keyword,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    page,
    per_page: 40,
  });
  return fetch(`${BASE_URL}?${params}`)
    .then(response => {
      if (response.status !== 200) {
        throw new Error(response.status);
      }
      return response.json();
    })
    .catch(error => {
      console.log(error);
    });
}

function getEvents(page, keyWord) {
  fetchEvents(page, keyWord).then(result => {
    console.log('res:', result);
    if (result.total === 0) {
      refs.btnMore.classList.add('btn_hidden');
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }
    if (page === result.totalHits) {
      refs.btnMore.classList.add('btn_hidden');
      Notify.warning(
        "We're sorry, but you've reached the end of search results."
      );
      return;
    }

    const images = result.hits;
    renderEvents(images);
    if (result.totalHits > 1) {
      refs.btnMore.classList.remove('btn_hidden');
    }
  });
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
  <img src="${webformatURL}" alt="${tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes ${likes}</b>
    </p>
    <p class="info-item">
      <b>Views ${views}</b>
    </p>
    <p class="info-item">
      <b>Comment s${comments}</b>
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

  refs.gallery.insertAdjacentHTML('beforeend', markup);
}

refs.form.addEventListener('submit', event => {
  event.preventDefault();
  const elements = event.currentTarget.searchQuery.value;
  page = 1;
  refs.gallery.innerHTML = '';
  getEvents(page, elements);
});

refs.btnMore.addEventListener('click', () => {
  page += 1;
  getEvents(page, elements);
});
