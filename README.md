
# Using JavaScript in an ASP.NET World

## Description

Do you have an ASP.NET application that's in need of modernization? Are you
interested in doing more in the client/browser but you're reluctant to add
JavaScript to your project? Do you already have JavaScript in your project but
you're having a difficult time maintaining or updating that code?

C# developers are often dragged kicking and screaming into the world of
JavaScript, but it doesn't have to be that way. In this talk, you'll see how you
can add JavaScript to your ASP.NET projects and still feel good (and confident)
about the code you're writing. We'll start with a server-side rendered search
page and refactor it to use JavaScript to prevent page postbacks.

* Organize code using modules
* Improve code quality using linting and unit testing
* Use new language features with confidence by leveraging transpilers/compilers
* Improve page loading performance using minification and bundling

## About James

James is a self-confessed geek, who enjoys talking about programming and
learning new technologies. At the beginning of 2016, he joined the Treehouse
team as an instructor and is now excited to be working with App Academy as a
curriculum developer and instructor. James enjoys participating in the developer
community, presenting talks in Oregon, Washington, Idaho, Utah, Tennessee, and
Kentucky.

Twitter: [SmashDev](https://twitter.com/SmashDev)

## About This Talk

* We'll start with a simple Music Catalog server-side only web application that
  allows you to search your music by artist, title, or category
* Then we'll update the project to use a mix of client and server-side code
  * The goal will be to keep the page from reloading when a search is performed
  * We'll be using "vanilla" JS (no libraries like jQuery or frameworks like
    Angular or React)
  * After we get an initial version working, we'll look at how we can
    incrementally improve our approach
* We're going to cover a lot of things in this talk, most of which would be
  deserving of their own talk
  * That being said, please feel free to ask questions or to let me know if
    you'd like to know more about a particular bit

## Survey

* How often do you write JavaScript code?
  * Once a week?
  * Every day?
  * Rarely (or a long time ago)?
* Have you used…
  * Linting?
  * JS modules?
  * Webpack?
  * Babel?
  * TypeScript?
  * React/Angular/Vue?

## What We'll Cover

* Convert a server-side only search page to use a mix of client and server-side
  code (no page reloads)
  * No libraries… just "vanilla" JS
* Add support for...
  * Linting (ESLint)
  * Modules (Webpack)
  * Transpiling (Babel)

## Reviewing Our Application

* Started with the VS 2019 ASP.NET Core web application project template
* Removed the Privacy page
* Added an `Album` class
* Added a `Repository` class to provide in-memory data for the application
* Configured the `Repository` class as a service and updated the
  `HomeController` class constructor to accept an instance of that class
* Removed jQuery and Bootstrap
* Updated the `_Layout` view to use the Bulma CSS library (https://bulma.io/)
* Updated the `Home/Index` view with a simple HTML form and list of albums

## Using JavaScript to Search the Catalog

### Adding the API

* Add a class named `AlbumsController`
* Inherit from `ControllerBase` (not `Controller` which provides MVC view
  related methods)
* Add `ApiController` and `Route` attributes
* Add a constructor that accepts an instance of the `Repository` class
* Add an `HttpGet` `Get` action method that returns a list of albums
* Test the API using Postman

```csharp
[ApiController]
[Route("api/[controller]")]
public class AlbumsController : ControllerBase
{
    private readonly Repository _repository;

    public AlbumsController(Repository repository)
    {
        _repository = repository;
    }

    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public ActionResult<IList<Album>> Get([FromQuery] string searchQuery, [FromQuery] string searchCategory)
    {
        return Ok(_repository.GetAlbums(searchQuery, searchCategory));
    }
}
```

### Setting Up the Client-Side Search Page

* Add new Home controller action method named `ClientSide`
* Add new view model
* Add new view
  * Copy over the view HTML
  * Update the `@model` view directive
  * Update the page title
  * Add an `id` attribute to the "Search" button
  * Replace the "Clear" anchor tag with a `<button>` element
  * Replace the list rendering with an empty `<div>` element
* Add new JS file `search.js`
  * Update the view to render a `<script>` tag to the layout view's "Scripts"
    section
  * Add an `asp-append-version` script tag helper attribute
* Update the `Startup.cs` file to use the `ClientSide` action as the route
  parameter default

```csharp
public IActionResult ClientSide(string searchQuery, string searchCategory)
{
    HomeClientSideViewModel viewModel = new HomeClientSideViewModel();

    viewModel.SearchQuery = searchQuery;
    viewModel.SearchCategory = searchCategory;
    viewModel.Categories = _repository.GetCategories();

    return View(viewModel);
}
```

```csharp
public class HomeClientSideViewModel
{
    public string SearchQuery { get; set; }
    public string SearchCategory { get; set; }
    public IList<string> Categories { get; set; }

    public SelectList CategorySelectList => new SelectList(Categories);
}
```

```html
@model HomeClientSideViewModel

@{
    ViewData["Title"] = "Music Catalog (Client-Side)";
}

<div class="columns">
    <div class="column">
        <form method="get">
            <div class="columns">
                <div class="column">
                    <input asp-for="SearchQuery" class="input is-medium" placeholder="Enter search query..." />
                </div>
                <div class="column is-narrow">
                    <div class="select is-medium">
                        <select asp-for="SearchCategory" asp-items="Model.CategorySelectList">
                            <option value="">Select a category...</option>
                        </select>
                    </div>
                </div>
                <div class="column is-narrow">
                    <button id="Search" class="button is-primary is-medium" type="submit">Search</button>&nbsp;
                    <button id="Clear" class="button is-warning is-medium">Clear</button>
                </div>
            </div>
        </form>
    </div>
</div>

<div id="SearchResults"></div>

@section Scripts {
    <script src="~/js/search.js" asp-append-version="true"></script>
}
```

### Our Plan

* First iteration: Call the API on page load and render the list of albums
  returned from the API
* Second iteration: Handle "Search" and "Clear" button clicks
* Third iteration: Handle URL state properly

### First Iteration

* Get references to the DOM elements
* Call the API when the page loads and render the initial list
  * Use `fetch` to call the API
  * Render the data to HTML
  * `innerHTML` vs creating DOM elements
  * Generally speaking using `innerHTML` is often faster (or at least not
    slower) than creating DOM elements (see
    https://www.quirksmode.org/dom/innerhtml.html and
    https://segdeha.com/experiments/innerhtml/)

```javascript
const searchResultsDiv = document.getElementById('SearchResults');
const searchQueryInput = document.getElementById('SearchQuery');
const searchCategorySelect = document.getElementById('SearchCategory');
const searchButton = document.getElementById('Search');
const clearButton = document.getElementById('Clear');

// Call the API on load and render the list.
fetch('api/Albums')
  .then(response => response.json())
  .then(data => {
    const albumsHtml = data.map(album => `
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
  });
```

### Second Iteration

* Refactor the API interaction and DOM rendering into their own functions
  * `getAlbums()`
  * `renderAlbums()`
* Define `search()` function
* Handle "Search" button clicks
* Handle "Clear" button clicks

```javascript
const searchResultsDiv = document.getElementById('SearchResults');
const searchQueryInput = document.getElementById('SearchQuery');
const searchCategorySelect = document.getElementById('SearchCategory');
const searchButton = document.getElementById('Search');
const clearButton = document.getElementById('Clear');

function getAlbums(searchQuery, searchCategory) {
  let url = 'api/Albums';

  if (searchQuery || searchCategory) {
    url += encodeURI(`?SearchQuery=${searchQuery}&SearchCategory=${searchCategory}`);
  }

  return fetch(url)
    .then(response => response.json());
}

function renderAlbums(albums) {
  if (albums.length > 0) {
    const albumsHtml = albums.map(album => `
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

function search() {
  const searchQuery = searchQueryInput.value;
  const searchCategory = searchCategorySelect.value;

  getAlbums(searchQuery, searchCategory)
    .then(albums => renderAlbums(albums));
}

// Handle search button clicks.
searchButton.addEventListener('click', (event) => {
  event.preventDefault();
  search();
});

// Handle clear button clicks.
clearButton.addEventListener('click', (event) => {
  event.preventDefault();
  searchQueryInput.value = '';
  searchCategorySelect.selectedIndex = 0;
  search();
});

// Call the API on load and render the list.
search();
```

### Third Iteration

* Set the input and select element initial values when the page loads
  * This is already working!
* Update the URL query string when a search is performed

```javascript
const searchResultsDiv = document.getElementById('SearchResults');
const searchQueryInput = document.getElementById('SearchQuery');
const searchCategorySelect = document.getElementById('SearchCategory');
const searchButton = document.getElementById('Search');
const clearButton = document.getElementById('Clear');

function getAlbums(searchQuery, searchCategory) {
  let url = 'api/Albums';

  if (searchQuery || searchCategory) {
    url += encodeURI(`?SearchQuery=${searchQuery}&SearchCategory=${searchCategory}`);
  }

  return fetch(url)
    .then(response => response.json());
}

function renderAlbums(albums) {
  if (albums.length > 0) {
    const albumsHtml = albums.map(album => `
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

function search(updateUrl) {
  const searchQuery = searchQueryInput.value;
  const searchCategory = searchCategorySelect.value;

  if (updateUrl) {
    let newUrl = '/';
    if (searchQuery || searchCategory) {
      newUrl += encodeURI(`?SearchQuery=${searchQuery}&SearchCategory=${searchCategory}`);
    }
    history.pushState({ searchQuery, searchCategory }, null, newUrl);
  }

  getAlbums(searchQuery, searchCategory)
    .then(albums => renderAlbums(albums));
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
```

## How Are We Doing?

* From an end user perspective, we've done our job
  * Search occurs on the client without a page reload
  * The URL in the address bar even updates!
* For some use cases, our single JS file approach works fine
* What are some of the downsides of our current approach?
* How can we improve our code?

## Not Polluting the Global Context

* We're currently defining all of our variables and functions in the global
  context
* Use an IIFE to keep our code out of the global context

```javascript
(() => {
  // Code goes here...
})();
```

## Using Async/Await

* Anywhere that we have promises, we can rewrite to use async/await

```javascript
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
      const albumsHtml = albums.map(album => `
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
      history.pushState({ searchQuery, searchCategory }, null, newUrl);
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
```

## Cleaner Code with Linting

* Linting your code can help you to find…
  * Syntax errors or potential runtime errors
  * Deviations from coding styles
* ESLint is enabled by default in VS 2017+ (version 15.8+)
  * Default configuration is probably not what you want to use
  * Unable to determine what version is being used
* Let's switch to using VS Code for editing JS
  * Who's already primarily using VS Code for coding JS?
  * Works great with JS
  * Lots of great extensions

### Setting up ESLint

In the root of the ASP.NET Core project, initialize NPM…

```
npm init -y
```

Install ESLint locally as a dev dependency...

```
npm install eslint --save-dev
```

Configure ESLint…

```
npx eslint --init
```

Now you'll have an `.eslintrc.json` file in your project!

*Helpful resource for getting started with ESLint:
[https://eslint.org/docs/user-guide/getting-started](https://eslint.org/docs/user-guide/getting-started)*

### Writing Code with a Linter

* A list of ESLint rules is available at: https://eslint.org/docs/rules/
* You can enable optional rules or disable default rules in the `.eslintrc.json`
  configuration file
* You can ignore entire files or individual lines of code
  * Place `/* eslint-disable */` at the top of the file to disable linting of
    the entire file
  * Place `// eslint-disable-next-line` or `/* eslint-disable-next-line */`
    before a line of code to disable linting of that line
* You can also ignore just specific rules within a file or for a specific line
  of code
* Complete ESLint configuration information available at:
  https://eslint.org/docs/user-guide/configuring

## Organizing Code Using Modules (Bundling and Minification Too!)

* Why use modules?
  * Easiest way to keep your code out of the global context
  * You don't have to worry about which scripts to load
  * You don't have to worry about script loading order
* Why bundle and minify?
  * Using modules will introduce more files into your project
  * Bundling reduces the number of requests that a client needs to make
  * Minification reduces the payload the size of each request
* Why not use MVC's bundling and minification?
  * Works okay for some scenarios
  * Using a tool like Webpack will give us some additional flexibility later on

### Module Bundler Options

* There have been many options over the years
* Parcel
  * Relatively new library
  * Easy to get started with
* Webpack
  * Widely used
  * Lots of changes across versions (seems to have stabilized a bit over the
    last year or so)
* Native JS modules
  * Evergreen browsers now support JS modules natively
  * Still too early to use IMO

### Setting Up Webpack

Install Webpack and Webpack CLI:

```
npm install webpack webpack-cli --save-dev
```

Update the `scripts` section in the `package.json`:

```json
"scripts": {
  "build-prod": "webpack --mode production",
  "build-dev": "webpack --mode development",
  "build-watch": "webpack --mode development --watch"
}
```

Add a Webpack configuration file named `webpack.config.js` in the root of your
project:

```javascript
const path = require('path');

module.exports = {
  entry: {
    search: './Scripts/search.js',
  },
  output: {
    path: path.resolve(__dirname, './wwwroot/js'),
    filename: '[name]-bundle.js',
  },
};
```

### Refactoring Our JS

* Move the `search.js` file over to a new `Scripts` folder
* Split code into modules
  * `albums.js`
  * `data.js`
* Import the functions from the new modules into the `search.js` file
* Remove the IIFE

```javascript
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
```

```javascript
async function getAlbums(searchQuery, searchCategory) {
  let url = 'api/Albums';

  if (searchQuery || searchCategory) {
    url += encodeURI(`?SearchQuery=${searchQuery}&SearchCategory=${searchCategory}`);
  }

  const response = await fetch(url);
  return response.json();
}

export default getAlbums;
```

```javascript
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
```

Update the view to reference the bundle file:

```html
@section Scripts {
    <script src="~/js/search-bundle.js" asp-append-version="true"></script>
}
```

### Supporting Multiple Entry Points

Configure Webpack to generate a bundle for each page in your web application:

```javascript
const path = require('path');

module.exports = {
  entry: {
    search: './Scripts/search.js',
    test: './Scripts/test.js',
  },
  output: {
    path: path.resolve(__dirname, './wwwroot/js'),
    filename: '[name]-bundle.js',
  },
};
```

### Installing the NPM Task Runner

Install the NPM Task Runner VS extension:
https://marketplace.visualstudio.com/items?itemName=MadsKristensen.NPMTaskRunner

Then in VS, use the Task Runner Explorer to bind NPM scripts to build events.

*Note: See this Stack Overflow post for ideas on how to vary the target NPM
script per the VS build configuration:
[https://stackoverflow.com/questions/31712324/detect-release-debug-in-gulp-using-visual-studio-2015](https://stackoverflow.com/questions/31712324/detect-release-debug-in-gulp-using-visual-studio-2015)*

### File Watching

From a terminal window run the following command or right-click on the task in
the Task Runner Explorer and select "Run":

```
npm run build-watch
```

Now you can leave VS running, make changes to JS files, and simply reload the
page to preview/test.

### Resources

*Good resource for understanding how Webpack works:
[https://medium.com/ag-grid/webpack-tutorial-understanding-how-it-works-f73dfa164f01](https://medium.com/ag-grid/webpack-tutorial-understanding-how-it-works-f73dfa164f01)*

*MDN web docs has an excellent guide on JS modules:
[https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)*

## Doing More with Webpack

### Linting

We already have ESLint installed and configured, so let's configure Webpack to
lint our code before it bundles our modules.

Install `eslint-loader`:

```
npm install eslint-loader --save-dev
```

Update the Webpack configuration:

```javascript
const path = require('path');

module.exports = {
  entry: {
    search: './Scripts/search.js',
  },
  output: {
    path: path.resolve(__dirname, './wwwroot/js'),
    filename: '[name]-bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
        options: {
          failOnError: true,
        },
      },
    ],
  },
};
```

### Transpilation

* Async/await may or may not be supported in your user's browsers
* Let's use Babel to transpile our JS to a more widely supported version

Install Babel presets, Babel Webpack loader, and Babel polyfill:

```
npm install @babel/core @babel/preset-env babel-loader babel-polyfill --save-dev
```

Add a `.babelrc` configuration file to the root of your VS project:

```json
{
  "presets": ["@babel/preset-env"]
}
```

Sidenote, if no targets are specified, @babel/preset-env will transform all
ECMAScript 2015+ code by default.

Update the Webpack configuration:

```javascript
const path = require('path');

module.exports = {
  entry: {
    babelpolyfill: 'babel-polyfill',
    search: './Scripts/search.js',
  },
  output: {
    path: path.resolve(__dirname, './wwwroot/js'),
    filename: '[name]-bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
          },
          {
            loader: 'eslint-loader',
            options: {
              failOnError: true,
            },
          },
        ],
      },
    ],
  },
};
```

Update the layout view:

```html
<script src="~/js/babelpolyfill-bundle.js" asp-append-version="true"></script>
```

## What's Next?

* TypeScript?
* Unit Testing?
* Components (not SPAs)?
* SPAs?
