using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using PikeSafetyWebApp.Data;
using PikeSafetyWebApp.Application.Companies;
using MediatR;

namespace PikeSafetyWebApp.Controllers
{
    [Route("api/Companies")]
    public class CompaniesController : BaseController
    {
        [HttpGet]
        public async Task<ActionResult<List<CompanyDto>>> List()
        {
            return await Mediator.Send(new List.Query());
        }

        [HttpPost("create")]
        public async Task<ActionResult<CompanyDto>> Create(Create.Query query)
        {
            return await Mediator.Send(query);
        }

        [HttpDelete("delete/{id}")]
        public async Task<ActionResult<Unit>> Delete(long id)
        {
            return await Mediator.Send(new Delete.Command { Id = id });
        }
    }
}
