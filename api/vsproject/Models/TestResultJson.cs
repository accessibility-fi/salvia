using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SalviaServiceAPI
{
    /// <summary>
    /// /// json-report of the result of a single page. This is always connected to a <see cref="TestResult"/>
    /// </summary>
    public class TestResultJson
    {
        [Key]
        public int? Id { get; set; }
        [ForeignKey("TestResultId")]
        public int TestResultId { get; set; }
        public string Data { get; set; }
        public DateTime CreationTime { get; set; }
    }
}
