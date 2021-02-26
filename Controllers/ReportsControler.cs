using System.Collections.Generic;
using System.Threading.Tasks;
using MediatR;
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
        public async Task<long> Create(Report report)
        {
            return await Mediator.Send(new Create.Command { Report = report });
        }

        [HttpDelete("delete/{id}")]
        public async Task<ActionResult<Unit>> Delete(long id)
        {
            return await Mediator.Send(new Delete.Command { Id = id });
        }
    }
}
