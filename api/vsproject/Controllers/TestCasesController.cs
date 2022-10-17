using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using SalviaServiceAPI.Models;

namespace SalviaServiceAPI.Controllers
{
    /// <summary>
    /// <see cref="TestCase"/>-related endpoints
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class TestCasesController : ControllerBase
    {
        private readonly SalviaDbContext _context;

        public TestCasesController(SalviaDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Gets all archived test results from the database
        /// </summary>
        /// <returns>Deserialized set of <see cref="ArchivedResult"/>-objects</returns>
        [HttpGet]
        public IActionResult GetTestCases()
        {
            try
            {
                using SalviaService salviaService = new SalviaService();
                {
                    return Ok(SalviaService.GetArchivedResults(_context));
                }
            }
            catch (Exception e)
            {
                string palaute = e.Message;
                if (e.InnerException != null)
                {
                    palaute += ";" + e.InnerException.Message;
                }

                Console.WriteLine(e);
                return Problem(palaute);
            }

        }

        /// <summary>
        /// Saves a test run to database
        /// </summary>
        /// <param name="testCase">Tested url and test report</param>
        /// <returns>Id of a created <see cref="TestRun"/>-object</returns>
        [HttpPost]
        public async Task<IActionResult> PostTestCase([FromBody] JObject testCase)
        {
            int? id;
            try
            {
                using var salviaService = new SalviaService();
                id = await SalviaService.SaveTestCase(testCase, _context);
            }
            catch (Exception e)
            {
                string palaute = e.Message;
                if (e.InnerException != null)
                {
                    palaute += ";" + e.InnerException.Message;
                }

                Console.WriteLine(e);
                return Problem(palaute);
            }

            return Ok(id);
        }
    }
}

