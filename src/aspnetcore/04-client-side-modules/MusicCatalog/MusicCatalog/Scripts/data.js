
async function getAlbums(searchQuery, searchCategory) {
  let url = 'api/Albums';

  if (searchQuery || searchCategory) {
    url += encodeURI(`?SearchQuery=${searchQuery}&SearchCategory=${searchCategory}`);
  }

  const response = await fetch(url);
  return response.json();
}

export default getAlbums;
