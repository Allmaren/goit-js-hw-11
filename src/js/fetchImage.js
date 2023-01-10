import axios from 'axios';

const API_KEY = '32132732-163b27f3205d6aad07e142ebf';
const BASE_URL = 'https://pixabay.com/api/';

export default class FetchData {
  constructor() {
    this.searchQuery = '';
    this.perPage = 40;
    this.page = 1;
    this.totalHits;
  }

  async fetchPhoto() {
    const params = new URLSearchParams({
      key: API_KEY,
      q: this.searchQuery,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      page: this.page,
      per_page: this.perPage,
    });
    const url = `${BASE_URL}/?${params}`;
    const res = await axios.get(url);
    this.totalHits = res.data.totalHits;
    this.incrementPage();
    return res;
  }
  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQueary = newQuery;
  }
}
