using System.Collections.Generic;
using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using PikeSafetyWebApp.Application.Sites;
using PikeSafetyWebApp.Data;
using PikeSafetyWebApp.Models;

namespace PikeSafetyWebApp.Controllers
{
    public class SitesController : BaseController
    {
        [HttpGet]
        public async Task<ActionResult<List<SiteDto>>> List()
        {
            return await Mediator.Send(new List.Query());
        }

        [HttpPost("create")]
        public async Task<ActionResult<SiteDto>> Create(Create.Query query)
        {
            return await Mediator.Send(query);
        }

        [HttpGet("manage/{id}")]
        public async Task<ActionResult<SiteDto>> Profile(long id)
        {
            return await Mediator.Send(new Details.Query { Id = id });
        }

        [HttpPut("edit")]
        public async Task<ActionResult<Unit>> Edit(Edit.Command command)
        {
            return await Mediator.Send(command);
        }

        [HttpDelete("delete/{id}")]
        public async Task<ActionResult<Unit>> Delete(long id)
        {
            return await Mediator.Send(new Delete.Command { Id = id });
        }

        [HttpPost("assign")]
        public async Task<ActionResult<SiteDto>> Assign(AssignUser.Command command)
        {
            return await Mediator.Send(command);
        }

        [HttpPost("unassign")]
        public async Task<ActionResult<Unit>> Unassign(UnassignUser.Command command)
        {
            return await Mediator.Send(command);
        }
    }
}