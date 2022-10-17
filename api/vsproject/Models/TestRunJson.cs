using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SalviaServiceAPI
{
    /// <summary>
    /// json-report of the test run. This is always connected to a <see cref="TestRun"/>
    /// </summary>
    public class TestRunJson
    {
        [Key]
        public int? Id { get; set; }
        [ForeignKey("TestRunId")]
        public int TestRunId { get; set; }
        public string Data { get; set; }
        public DateTime CreationTime { get; set; }        
    }
}
