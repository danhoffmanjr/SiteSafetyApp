using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using PikeSafetyWebApp.Application.Reports;

namespace PikeSafetyWebApp.Controllers
{
    public class ReportsController : BaseController
    {
        [HttpGet]
        public async Task<ActionResult<List<ReportDto>>> List()
        {
            return await Mediator.Send(new List.Query());
        }
    }
}
