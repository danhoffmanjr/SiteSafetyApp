using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Identity;
using PikeSafetyWebApp.Application.Errors;
using PikeSafetyWebApp.Application.Interfaces;
using PikeSafetyWebApp.Data;
using PikeSafetyWebApp.Models;

namespace PikeSafetyWebApp.Application.ReportTypes
{
    public class Create
    {
        public class Command : IRequest
        {
            public ReportType ReportType { get; set; }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly PikeSafetyDbContext context;
            private readonly IUserAccessor userAccessor;
            private readonly UserManager<AppUser> userManager;
            public Handler(PikeSafetyDbContext context, UserManager<AppUser> userManager, IUserAccessor userAccessor)
            {
                this.userManager = userManager;
                this.userAccessor = userAccessor;
                this.context = context;

            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                var currentUser = await userManager.FindByIdAsync(userAccessor.GetCurrentUserId());

                var doesTitleExist = CheckExistsByTitle(request.ReportType.Title);
                if (doesTitleExist) throw new RestException(HttpStatusCode.BadRequest, new { Name = "Report Type title already exists." });

                var newReportType = new ReportType
                {
                    Title = request.ReportType.Title,
                    Fields = request.ReportType.Fields,
                    IsActive = true,
                    CreatedOn = DateTime.UtcNow,
                    CreatedBy = currentUser.FullName,
                    UpdatedBy = "",
                    UpdatedOn = null
                };

                context.ReportTypes.Add(newReportType);
                await context.SaveChangesAsync();
                return Unit.Value;
            }

            private bool CheckExistsByTitle(string title)
            {
                ICollection<string> titles = context.ReportTypes.Select(x => x.Title.ToLower()).ToList();
                var exists = titles.Any(t => t == title.ToLower());
                return exists;
            }
        }
    }
}