using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using PikeSafetyWebApp.Application.Reports;
using PikeSafetyWebApp.Models;

namespace PikeSafetyWebApp.Controllers
{
    public class ReportsController : BaseController
    {
        [HttpGet]
        public async Task<ActionResult<List<ReportDto>>> List()
        {
            return await Mediator.Send(new List.Query());
        }

        [HttpPost("create")]
        public async Task<IActionResult> Create(Report report)
        {
            return Ok(await Mediator.Send(new Create.Command { Report = report }));
        }
    }
}
