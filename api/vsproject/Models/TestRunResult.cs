using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;

namespace SalviaServiceAPI.Models
{
    /// <summary>
    /// Class for combining data from multiple classes to be delivered to UI
    /// </summary>
    public class TestRunResult
    {
        public string domain { get; set; }
        public int id { get; set; }
        public List<string> urls { get; set; }
        public DateTime ts { get; set; }
        public string json { get; set; }
        public string viewport { get; set; }
        public string report { get; set; }
    }
}

