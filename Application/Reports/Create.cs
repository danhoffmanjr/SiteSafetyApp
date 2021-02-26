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

namespace PikeSafetyWebApp.Application.Reports
{
    public class Create
    {
        public class Command : IRequest
        {
            public Report Report { get; set; }
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

                var doesTitleExist = CheckExistsByTitle(request.Report.Title);
                if (doesTitleExist) throw new RestException(HttpStatusCode.BadRequest, new { Name = "Report title already exists." });

                var newReport = new Report
                {
                    Title = request.Report.Title,
                    CompanyName = request.Report.CompanyName,
                    CompanyId = request.Report.CompanyId,
                    SiteId = request.Report.SiteId,
                    SiteName = request.Report.SiteName,
                    ReportTypeId = request.Report.ReportTypeId,
                    ReportType = request.Report.ReportType,
                    ReportFields = request.Report.ReportFields,
                    IsActive = true,
                    CreatedOn = DateTime.UtcNow,
                    CreatedBy = currentUser.FullName,
                    UpdatedBy = "",
                    UpdatedOn = null
                };

                context.Reports.Add(newReport);
                await context.SaveChangesAsync();
                return Unit.Value;
            }

            private bool CheckExistsByTitle(string title)
            {
                ICollection<string> titles = context.Reports.Select(x => x.Title.ToLower()).ToList();
                var exists = titles.Any(t => t == title.ToLower());
                return exists;
            }
        }
    }
}