using System.Threading.Tasks;
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
    }
}