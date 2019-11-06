using Microsoft.AspNetCore.Mvc.Rendering;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MusicCatalog.Models
{
    public class HomeClientSideViewModel
    {
        public string SearchQuery { get; set; }
        public string SearchCategory { get; set; }
        public IList<string> Categories { get; set; }

        public SelectList CategorySelectList => new SelectList(Categories);
    }
}
