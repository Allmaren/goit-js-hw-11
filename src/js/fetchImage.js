const API_KEY = '32132732-163b27f3205d6aad07e142ebf';
const BASE_URL = 'https://pixabay.com/api/';

function fetchImage(page, query) {
  const params = new URLSearchParams({
    key: API_KEY,
    page: (page = 1),
    g: query,
    per_page: 40,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
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
