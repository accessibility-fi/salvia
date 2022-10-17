using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using SalviaServiceAPI.Helpers;

namespace SalviaServiceAPI.Models
{
    /// <summary>
    /// Class for combining data from multiple classes to be delivered to UI
    /// </summary>
    public class ArchivedResult
    {
        public int? id { get; set; }
        public string domain { get; set; }
        public List<result> results { get; set; }

        public static ArchivedResult CreateArchivedResult(TestCase testCase)
        {
            var archivedResult = new ArchivedResult();

            var shortenedUrl = testCase.Url
                .Replace("http://", string.Empty)
                .Replace("https://", string.Empty)
                .Replace("www.", string.Empty)
                .TrimEnd('/');

            archivedResult.id = testCase.Id;
            archivedResult.domain = shortenedUrl;
            archivedResult.results = new List<result>();

            var tmpList = new List<result>();
            foreach (var testRun in testCase.TestRuns)
            {
                report report = new report
                {
                    id = String.IsNullOrEmpty(testRun.Report) ? "" : testRun.Report
                };
                
                var result = new result
                {
                    id = testRun.Id,
                    ts = TimeZoneHelper.UtcToFinnishTimeNoNull(testRun.CreationTime),
                    viewport = testRun.Viewport,
                    report = report
                };
                result.stats = new stat
                {
                    passed = testRun.TestResults.Sum(a => a.Passed),
                    warning = testRun.TestResults.Sum(a => a.Warning),
                    failed = testRun.TestResults.Sum(a => a.Failed),
                    pages = testRun.TestResults.Count
                };
                tmpList.Add(result);
            }
            archivedResult.results = tmpList.OrderByDescending(a => a.id).ToList();

            return archivedResult;
        }
    }
}

namespace SalviaServiceAPI
{
    public class result
    {
        public int? id { get; set; }
        public string viewport { get; set; }
        public report report { get; set; }
        public DateTime ts { get; set; }
        public stat stats { get; set; }
    }

    public class stat
    {
        public int passed { get; set; }
        public int warning { get; set; }
        public int failed { get; set; }
        public int pages { get; set; }
    }

    public class report
    {
        public string id { get; set; }
    }
}

