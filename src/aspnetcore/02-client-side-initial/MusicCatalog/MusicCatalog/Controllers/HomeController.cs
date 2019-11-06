using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using MusicCatalog.Data;
using MusicCatalog.Models;

namespace MusicCatalog.Controllers
{
    public class HomeController : Controller
    {
        private readonly Repository _repository;

        public HomeController(Repository repository)
        {
            _repository = repository;
        }

        public IActionResult Index(string searchQuery, string searchCategory)
        {
            HomeIndexViewModel viewModel = new HomeIndexViewModel();

            viewModel.Albums = _repository.GetAlbums(searchQuery, searchCategory);
            viewModel.Categories = _repository.GetCategories();

            return View(viewModel);
        }

        public IActionResult ClientSide(string searchQuery, string searchCategory)
        {
            HomeClientSideViewModel viewModel = new HomeClientSideViewModel();

            viewModel.SearchQuery = searchQuery;
            viewModel.SearchCategory = searchCategory;
            viewModel.Categories = _repository.GetCategories();

            return View(viewModel);
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
