/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./Scripts/search.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./Scripts/albums.js":
/*!***************************!*\
  !*** ./Scripts/albums.js ***!
  \***************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\nfunction getAlbumsHtml(albums) {\n  var html = '';\n\n  if (albums.length > 0) {\n    var albumsHtml = albums.map(function (album) {\n      return \"\\n      <div class=\\\"column is-half\\\">\\n          <div class=\\\"box\\\">\\n              <div class=\\\"columns\\\">\\n                  <div class=\\\"column\\\">\\n                      <figure class=\\\"image is-square\\\">\\n                          <img src=\\\"img/\".concat(album.id, \".png\\\" alt=\\\"\").concat(album.title, \"\\\" />\\n                      </figure>\\n                  </div>\\n                  <div class=\\\"column\\\">\\n                      <h2 class=\\\"title\\\">\").concat(album.title, \"</h2>\\n                      <h3 class=\\\"subtitle\\\">\").concat(album.artist, \"</h3>\\n                      <div>\\n                          Category: \").concat(album.category, \"\\n                      </div>\\n                  </div>\\n              </div>\\n          </div>\\n      </div>\\n    \");\n    });\n    html = \"\\n      <div class=\\\"columns is-multiline\\\">\\n        \".concat(albumsHtml.join(''), \"\\n      </div>\\n    \");\n  } else {\n    html = \"\\n      <div>Sorry... no results were found that matched your search criteria.</div>\\n    \";\n  }\n\n  return html;\n}\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (getAlbumsHtml);\n\n//# sourceURL=webpack:///./Scripts/albums.js?");

/***/ }),

/***/ "./Scripts/data.js":
/*!*************************!*\
  !*** ./Scripts/data.js ***!
  \*************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\nfunction getAlbums(searchQuery, searchCategory) {\n  var url, response;\n  return regeneratorRuntime.async(function getAlbums$(_context) {\n    while (1) {\n      switch (_context.prev = _context.next) {\n        case 0:\n          url = 'api/Albums';\n\n          if (searchQuery || searchCategory) {\n            url += encodeURI(\"?SearchQuery=\".concat(searchQuery, \"&SearchCategory=\").concat(searchCategory));\n          }\n\n          _context.next = 4;\n          return regeneratorRuntime.awrap(fetch(url));\n\n        case 4:\n          response = _context.sent;\n          return _context.abrupt(\"return\", response.json());\n\n        case 6:\n        case \"end\":\n          return _context.stop();\n      }\n    }\n  });\n}\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (getAlbums);\n\n//# sourceURL=webpack:///./Scripts/data.js?");

/***/ }),

/***/ "./Scripts/search.js":
/*!***************************!*\
  !*** ./Scripts/search.js ***!
  \***************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _data__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./data */ \"./Scripts/data.js\");\n/* harmony import */ var _albums__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./albums */ \"./Scripts/albums.js\");\n\n\nvar searchResultsDiv = document.getElementById('SearchResults');\nvar searchQueryInput = document.getElementById('SearchQuery');\nvar searchCategorySelect = document.getElementById('SearchCategory');\nvar searchButton = document.getElementById('Search');\nvar clearButton = document.getElementById('Clear');\n\nfunction search(updateUrl) {\n  var searchQuery, searchCategory, newUrl, albums;\n  return regeneratorRuntime.async(function search$(_context) {\n    while (1) {\n      switch (_context.prev = _context.next) {\n        case 0:\n          searchQuery = searchQueryInput.value;\n          searchCategory = searchCategorySelect.value;\n\n          if (updateUrl) {\n            newUrl = '/';\n\n            if (searchQuery || searchCategory) {\n              newUrl += encodeURI(\"?SearchQuery=\".concat(searchQuery, \"&SearchCategory=\").concat(searchCategory));\n            }\n\n            window.history.pushState({\n              searchQuery: searchQuery,\n              searchCategory: searchCategory\n            }, null, newUrl);\n          }\n\n          _context.next = 5;\n          return regeneratorRuntime.awrap(Object(_data__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(searchQuery, searchCategory));\n\n        case 5:\n          albums = _context.sent;\n          searchResultsDiv.innerHTML = Object(_albums__WEBPACK_IMPORTED_MODULE_1__[\"default\"])(albums);\n\n        case 7:\n        case \"end\":\n          return _context.stop();\n      }\n    }\n  });\n} // Handle browser back button clicks.\n\n\nwindow.onpopstate = function (event) {\n  var searchQuery = '';\n  var searchCategory = '';\n\n  if (event.state !== null) {\n    var _event$state = event.state;\n    searchQuery = _event$state.searchQuery;\n    searchCategory = _event$state.searchCategory;\n  }\n\n  searchQueryInput.value = searchQuery;\n  searchCategorySelect.value = searchCategory;\n  search(false);\n}; // Handle search button clicks.\n\n\nsearchButton.addEventListener('click', function (event) {\n  event.preventDefault();\n  search(true);\n}); // Handle clear button clicks.\n\nclearButton.addEventListener('click', function (event) {\n  event.preventDefault();\n  searchQueryInput.value = '';\n  searchCategorySelect.selectedIndex = 0;\n  search(true);\n}); // Call the API on load and render the list.\n\nsearch(false);\n\n//# sourceURL=webpack:///./Scripts/search.js?");

/***/ })

/******/ });