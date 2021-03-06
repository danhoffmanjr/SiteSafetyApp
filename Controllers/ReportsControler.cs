﻿using System.Collections.Generic;
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
        public async Task<long> Create(Create.Command command)
        {
            return await Mediator.Send(command);
        }

        [HttpGet("manage/{id}")]
        public async Task<ActionResult<ReportDto>> Report(long id)
        {
            return await Mediator.Send(new Details.Query { Id = id });
        }

        [HttpDelete("delete/{id}")]
        public async Task<ActionResult<Unit>> Delete(long id)
        {
            return await Mediator.Send(new Delete.Command { Id = id });
        }
    }
}
