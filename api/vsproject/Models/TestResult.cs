using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SalviaServiceAPI
{
    /// <summary>
    /// Test result of a single page. A test result is always connected to a <see cref="TestRun"/>
    /// </summary>
    public class TestResult
    {
        [Key]
        public int? Id { get; set; }
        [ForeignKey("TestRunId")]
        public int TestRunId { get; set; }
        public string Description { get; set; }
        public int Passed { get; set; }
        public int Warning { get; set; }
        public int Failed { get; set; }
        public int Inapplicable { get; set; }
        public DateTime CreationTime { get; set; }
    }
}
