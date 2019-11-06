using MusicCatalog.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MusicCatalog.Data
{
    public class Repository
    {
        public IList<string> GetCategories()
        {
            return new List<string>()
            {
                "Alternative",
                "Folk",
                "Metal",
                "Rock",
            };
        }

        private static IList<Album> _albums = new List<Album>()
        {
            new Album()
            {
                Id = 1,
                Title = "Operation: Mindcrime",
                Artist = "Queensryche",
                Category = "Metal",
            },
            new Album()
            {
                Id = 2,
                Title = "Document",
                Artist = "R.E.M.",
                Category = "Alternative",
            },
            new Album()
            {
                Id = 3,
                Title = "Wasting Light",
                Artist = "Foo Fighters",
                Category = "Rock",
            },
            new Album()
            {
                Id = 4,
                Title = "Helplessness Blues",
                Artist = "Fleet Foxes",
                Category = "Folk",
            },
            new Album()
            {
                Id = 5,
                Title = "The Historical Conquests of Josh Ritter",
                Artist = "Josh Ritter",
                Category = "Folk",
            },
            new Album()
            {
                Id = 6,
                Title = "OK Computer OKNOTOK 1997 2017",
                Artist = "Radiohead",
                Category = "Alternative",
            },
        };

        public IList<Album> GetAlbums()
        {
            return _albums;
        }

        public IList<Album> GetAlbums(string searchQuery, string searchCategory)
        {
            IQueryable<Album> albums = _albums.AsQueryable();

            if (!string.IsNullOrWhiteSpace(searchQuery))
            {
                searchQuery = searchQuery.ToLower();

                albums = albums.Where(a => 
                    a.Title.ToLower().Contains(searchQuery) ||    
                    a.Artist.ToLower().Contains(searchQuery));
            }

            if (!string.IsNullOrWhiteSpace(searchCategory))
            {
                albums = albums.Where(a => a.Category.Equals(searchCategory, StringComparison.OrdinalIgnoreCase));
            }

            return albums.ToList();
        }
    }
}
