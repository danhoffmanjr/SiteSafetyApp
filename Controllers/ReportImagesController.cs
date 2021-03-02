using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using PikeSafetyWebApp.Application.ReportImages;
using PikeSafetyWebApp.Models;

namespace PikeSafetyWebApp.Controllers
{
    public class ReportImagesController : BaseController
    {
        [HttpPost]
        public async Task<ReportImage> Add([FromForm] Add.Command command)
        {
            return await Mediator.Send(command);
        }

        [HttpPost("batch")]
        public async Task<IActionResult> AddBatch([FromForm] AddBatch.Command command)
        {
            return Ok(await Mediator.Send(command));
        }

        [HttpGet("manage/{id}")]
        public async Task<ReportImageDto> GetImageDtoAsync(long id)
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
    }
}