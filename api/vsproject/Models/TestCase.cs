using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace SalviaServiceAPI
{
    /// <summary>
    /// A test case, which is basically a URL.
    /// Same URL can be executed several times, therefore a test case has many children: (<see cref="TestRun"/>)
    /// </summary>
    public class TestCase
    {
        [Key]
        public int? Id { get; set; }
        public string Url { get; set; }
        public DateTime CreationTime { get; set; }

        public List<TestRun> TestRuns { get; set; }
    }
}
