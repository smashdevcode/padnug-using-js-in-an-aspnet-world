
import getAlbums from './data';
import getAlbumsHtml from './albums';

const searchResultsDiv = document.getElementById('SearchResults');
const searchQueryInput = document.getElementById('SearchQuery');
const searchCategorySelect = document.getElementById('SearchCategory');
const searchButton = document.getElementById('Search');
const clearButton = document.getElementById('Clear');

async function search(updateUrl) {
  const searchQuery = searchQueryInput.value;
  const searchCategory = searchCategorySelect.value;

  if (updateUrl) {
    let newUrl = '/';
    if (searchQuery || searchCategory) {
      newUrl += encodeURI(`?SearchQuery=${searchQuery}&SearchCategory=${searchCategory}`);
    }
    window.history.pushState({ searchQuery, searchCategory }, null, newUrl);
  }

  const albums = await getAlbums(searchQuery, searchCategory);
  searchResultsDiv.innerHTML = getAlbumsHtml(albums);
}

// Handle browser back button clicks.
window.onpopstate = (event) => {
  let searchQuery = '';
  let searchCategory = '';

  if (event.state !== null) {
    ({ searchQuery, searchCategory } = event.state);
  }

  searchQueryInput.value = searchQuery;
  searchCategorySelect.value = searchCategory;

  search(false);
};

// Handle search button clicks.
searchButton.addEventListener('click', (event) => {
  event.preventDefault();
  search(true);
});

// Handle clear button clicks.
clearButton.addEventListener('click', (event) => {
  event.preventDefault();
  searchQueryInput.value = '';
  searchCategorySelect.selectedIndex = 0;
  search(true);
});

// Call the API on load and render the list.
search(false);
