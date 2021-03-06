using System.Collections.Generic;
using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using PikeSafetyWebApp.Application.ReportTypes;
using PikeSafetyWebApp.Models;

namespace PikeSafetyWebApp.Controllers
{
    public class ReportTypesController : BaseController
    {
        [HttpGet]
        public async Task<ActionResult<List<ReportTypeDto>>> List()
        {
            return await Mediator.Send(new List.Query());
        }

        [HttpPost("create")]
        public async Task<IActionResult> Create(ReportType reportType)
        {
            return Ok(await Mediator.Send(new Create.Command { ReportType = reportType }));
        }

        [HttpDelete("delete/{id}")]
        public async Task<ActionResult<Unit>> Delete(long id)
        {
            return await Mediator.Send(new Delete.Command { Id = id });
        }
    }
}