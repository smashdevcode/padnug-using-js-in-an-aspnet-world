
(async () => {
  const searchResultsDiv = document.getElementById('SearchResults');
  const searchQueryInput = document.getElementById('SearchQuery');
  const searchCategorySelect = document.getElementById('SearchCategory');
  const searchButton = document.getElementById('Search');
  const clearButton = document.getElementById('Clear');

  async function getAlbums(searchQuery, searchCategory) {
    let url = 'api/Albums';

    if (searchQuery || searchCategory) {
      url += encodeURI(`?SearchQuery=${searchQuery}&SearchCategory=${searchCategory}`);
    }

    const response = await fetch(url);
    return response.json();
  }

  function renderAlbums(albums) {
    if (albums.length > 0) {
      const albumsHtml = albums.map((album) => `
        <div class="column is-half">
            <div class="box">
                <div class="columns">
                    <div class="column">
                        <figure class="image is-square">
                            <img src="img/${album.id}.png" alt="${album.title}" />
                        </figure>
                    </div>
                    <div class="column">
                        <h2 class="title">${album.title}</h2>
                        <h3 class="subtitle">${album.artist}</h3>
                        <div>
                            Category: ${album.category}
                        </div>
                    </div>
                </div>
            </div>
        </div>
      `);

      searchResultsDiv.innerHTML = `
        <div class="columns is-multiline">
          ${albumsHtml.join('')}
        </div>
      `;
    } else {
      searchResultsDiv.innerHTML = `
        <div>Sorry... no results were found that matched your search criteria.</div>
      `;
    }
  }

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
    renderAlbums(albums);
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
})();
