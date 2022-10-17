using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SalviaServiceAPI
{
    /// <summary>
    /// A test run
    /// One run can include one to many single pages, therefore a test run has many children: (<see cref="TestResult"/>)
    /// A test run is always connected to a <see cref="TestCase>
    /// </summary>
    public class TestRun
    {
        [Key]
        public int? Id { get; set; }
        [ForeignKey("TestCaseId")]
        public int TestCaseId { get; set; }
        public TestRunJson Json { get; set; }
        public DateTime CreationTime { get; set; }
        public List<TestResult> TestResults { get; set; }
        public string Viewport { get; set; }
        public string Report { get; set; }
    }
}
