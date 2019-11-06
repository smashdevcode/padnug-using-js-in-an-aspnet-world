
function getAlbumsHtml(albums) {
  let html = '';

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

    html = `
      <div class="columns is-multiline">
        ${albumsHtml.join('')}
      </div>
    `;
  } else {
    html = `
      <div>Sorry... no results were found that matched your search criteria.</div>
    `;
  }

  return html;
}

export default getAlbumsHtml;
