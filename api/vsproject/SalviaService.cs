using System;
using System.Collections.Generic;
using System.Linq;
using Newtonsoft.Json.Linq;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System.Threading.Tasks;
using SalviaServiceAPI.Models;
using SalviaServiceAPI.Helpers;
using Microsoft.AspNetCore.Mvc;

namespace SalviaServiceAPI
{
    /// <summary>
    /// Class for service methods, link between controllers and model-classes
    /// </summary>
    internal class SalviaService : IDisposable
    {
        /// <summary>
        /// Saves a test result to the database
        /// </summary>
        /// <param name="testCase">Tested url and evaluation result from QualWeb (json)</param>
        /// <param name="reportGuid">GUID of the report formed from the tested url</param>
        /// <param name="dbContext"><see cref="SalviaDbContext"/> -object containing existing data</param>
        /// <returns>Id of the created <see cref="TestRun"/>-object</returns>
        //internal static Task<int?> SaveTestCase(JObject testCase, SalviaDbContext dbContext)
        internal static async Task<int?> SaveTestCase(JObject testCase, SalviaDbContext dbContext)
        {
            var domain = testCase["domain"];
            var viewport = testCase["viewport"];
            var report = testCase["report"];
            var reportId = testCase["report"]["reportId"];

            JObject parsedObject;

            try
            {
                parsedObject = JObject.Parse(report.ToString());
            }
            catch (Exception)
            {
                throw new ArgumentException("Invalid JSON string.", nameof(testCase));
            }

            bool isValid = Guid.TryParse(reportId.ToString(), out Guid goodGuid);
            if (!isValid)
            {
                throw new ArgumentException("Invalid Guid.", nameof(testCase));
            }

            // All timestamps are saved as UTC
            var utcDatetime = DateTime.Now.ToUniversalTime();

            // Create a new TestRun-object
            var newTestRun = new TestRun
            {
                CreationTime = utcDatetime,
                Viewport = viewport.ToString(),
                Report = reportId.ToString(),
            };

            var newTestRunJson = new TestRunJson
            {
                Data = report.ToString(Formatting.None),
                CreationTime = utcDatetime
            };
            newTestRun.Json = newTestRunJson;

            // Create a set of new TestResult-objects and add them to the TestRun
            List<TestResult> newTestResults = new();

            foreach (var singlePageResult in parsedObject["data"])
            {
                var newTestResult = new TestResult
                {
                    Passed = (int)((JProperty)singlePageResult).Value["metadata"]?["passed"],
                    Description = ((JProperty)singlePageResult).Value["system"]?["url"]?["inputUrl"].ToString(),
                    Warning = (int)((JProperty)singlePageResult).Value["metadata"]?["warning"],
                    Failed = (int)((JProperty)singlePageResult).Value["metadata"]?["failed"],
                    Inapplicable = (int)((JProperty)singlePageResult).Value["metadata"]?["inapplicable"],
                    CreationTime = utcDatetime
                };

                newTestResults.Add(newTestResult);
            }
            
            newTestRun.TestResults = newTestResults;

            // Check if a test case already exists in the database
            var existingTestCase = dbContext.TestCase
                .Include(p => p.TestRuns)
                .Include("TestRuns.TestResults")
                .FirstOrDefault(a => a.Url == domain.ToString());

            // Add the new test result to an existing test case or create a new test case
            if (existingTestCase != null)
            {
                existingTestCase.TestRuns.Add(newTestRun);
            }
            else
            {
                TestCase newTestCase = new()
                {
                    Url = domain.ToString(),
                    CreationTime = utcDatetime,
                    TestRuns = new List<TestRun>()
                };

                newTestCase.TestRuns.Add(newTestRun);
                dbContext.TestCase.Add(newTestCase);
            }

            // Save changes and return the id of the newly created TestRun
            // Saving of large json-strings can take minutes, therefore the SetCommandTimeout
            dbContext.Database.SetCommandTimeout(500);
            await dbContext.SaveChangesAsync();
            return newTestRun.Id;
        }

        /// <summary>
        /// Returns all QualWeb-test results stored in the database
        /// </summary>
        /// <param name="dbContext"><see cref="SalviaDbContext"/> -object containing the data</param>
        /// <returns>Serialized set of <see cref="ArchivedResult"/>-objects</returns>
        internal static string GetArchivedResults(SalviaDbContext dbContext)
        {
            var archivedResults = new List<ArchivedResult>();

            foreach (var testCase in dbContext.TestCase.OrderBy(parent => parent.Url)
                    .Include(parent => parent.TestRuns)
                    .Include("TestRuns.TestResults"))
            {
                archivedResults.Add(ArchivedResult.CreateArchivedResult(testCase));
            }

            foreach (ArchivedResult archivedResult in archivedResults)
            {
                var oldestResult = archivedResults.
                    FirstOrDefault(a => a.domain == archivedResult.domain && 
                    a.id < archivedResult.id &&
                    a.id == archivedResults.Where(a => a.domain == archivedResult.domain).Min(b=> b.id));

                if (oldestResult != null)
                {
                    foreach (var result in archivedResult.results)
                    {
                        oldestResult.results.Add(result);
                    }
                    archivedResult.results.Clear();
                }
            }

            var tmp = archivedResults.Where(a => a.results.Any());

            foreach (var result in tmp)
            {
                result.results = result.results.OrderByDescending(a => a.ts).ToList();
            }
            
            return JsonConvert.SerializeObject(tmp.OrderBy(a => a.domain));
        }

        /// <summary>
        /// Returns a single test run
        /// </summary>
        /// <param name="id">Id of the test run</param>
        /// <param name="dbContext"><see cref="SalviaDbContext"/> -object containing the data</param>
        /// <returns>Imformation about a given test run (serialized <see cref="TestRunResult"/>-object)</returns>
        internal static string GetTestRun(int id, SalviaDbContext dbContext)
        {
            var testRunResult = new TestRunResult();

            var testRun = dbContext.TestRun.Include("Json").Include("TestResults").FirstOrDefault(a => a.Id == id);

            if (testRun == null)
                return null;
                        
            testRunResult.id = id;
            /// FindSystemTimeZoneById value changes based on OS definitons:
            /// Windows: "FLE Standard Time"
            /// Linux: "Europe/Helsinki"
            testRunResult.ts = TimeZoneHelper.UtcToFinnishTimeNoNull(testRun.CreationTime);
            testRunResult.json = testRun.Json.Data;
            testRunResult.domain = dbContext.TestCase.FirstOrDefault(a => a.Id == testRun.TestCaseId).Url;
            testRunResult.urls = testRun.TestResults.Select(a => a.Description).ToList();
            testRunResult.viewport = testRun.Viewport;
            testRunResult.report = testRun.Report;

            return JsonConvert.SerializeObject(testRunResult);
        }

        /// <summary>
        /// Returns then json of a single test run
        /// </summary>
        /// <param name="id">Id of the test run</param>
        /// <param name="dbContext"><see cref="SalviaDbContext"/> -object containing the data</param>
        /// <returns>json-report from the given test run</returns>
        internal static string GetTestRunJson(int id, SalviaDbContext dbContext)
        {
            var testRun = dbContext.TestRun.Include(a => a.Json).FirstOrDefault(a => a.Id == id);
            return testRun.Json.Data;
        }

        public void Dispose()
        {
        }
    }
}

