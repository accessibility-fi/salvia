using System;
using Microsoft.AspNetCore.Mvc;

namespace SalviaServiceAPI.Controllers
{
    /// <summary>
    /// <see cref="TestRun"/>-related endpoints
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class TestRunsController : ControllerBase
    {
        private readonly SalviaDbContext _context;

        public TestRunsController(SalviaDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Returns the json-report for a given test run
        /// </summary>
        /// <param name="id"><see cref="TestRun"/>-id</param>
        /// <returns>json-report</returns>
        [Route("{id:int}/json")]
        [HttpGet]
        public IActionResult GetTestRunJson(int id)
        {
            try
            {
                using SalviaService salviaService = new SalviaService();
                {
                    var json = SalviaService.GetTestRunJson(id, _context);
                    if (string.IsNullOrEmpty(json))
                    {
                        return NotFound(id);
                    }
                    return Ok(json);
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                return Problem();
            }
        }

        /// <summary>
        /// Returns a single test run
        /// </summary>
        /// <param name="id">Id of the test run</param>
        /// <returns>Imformation about a given test run (deserialized <see cref="TestRunResult"/>-object)</returns>
        [Route("{id:int}")]
        [HttpGet]
        public IActionResult GetTestRun(int id)
        {
            try
            {
                using SalviaService salviaService = new SalviaService();
                {
                    var testRun = SalviaService.GetTestRun(id, _context);
                    if (testRun == null)
                    {
                        return NotFound(id);
                    }
                    return Ok(testRun);
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                return Problem(e.Message);
            }
        }
    }
}

