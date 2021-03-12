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
        public class Command : IRequest<long>
        {
            public string Title { get; set; }
            public long ReportTypeId { get; set; }
            public string ReportType { get; set; }
            public string ReportFields { get; set; } //stringified json object based on report type fields with additional value parameter
            public long CompanyId { get; set; }
            public string CompanyName { get; set; }
            public long SiteId { get; set; }
            public string SiteName { get; set; }
            public double CompletionPercentage { get; set; }
            public bool RequireImages { get; set; }
        }

        public class Handler : IRequestHandler<Command, long>
        {
            private readonly PikeSafetyDbContext context;
            private readonly IUserAccessor userAccessor;
            private readonly UserManager<AppUser> userManager;
            private readonly IReportService reportService;
            public Handler(PikeSafetyDbContext context, UserManager<AppUser> userManager, IUserAccessor userAccessor, IReportService reportService)
            {
                this.reportService = reportService;
                this.userManager = userManager;
                this.userAccessor = userAccessor;
                this.context = context;
            }

            public async Task<long> Handle(Command request, CancellationToken cancellationToken)
            {
                var currentUser = await userManager.FindByIdAsync(userAccessor.GetCurrentUserId());

                var doesTitleExist = CheckExistsByTitle(request.Title);
                if (doesTitleExist) throw new RestException(HttpStatusCode.BadRequest, new { Name = "Report title already exists." });

                var newReport = new Report
                {
                    Title = request.Title,
                    CompanyName = request.CompanyName,
                    CompanyId = request.CompanyId,
                    SiteId = request.SiteId,
                    SiteName = request.SiteName,
                    ReportTypeId = request.ReportTypeId,
                    ReportType = request.ReportType,
                    ReportFields = request.ReportFields,
                    CompletionPercentage = request.CompletionPercentage,
                    RequireImages = request.RequireImages,
                    IsActive = true,
                    CreatedOn = DateTime.UtcNow,
                    CreatedBy = currentUser.FullName,
                    UpdatedBy = "",
                    UpdatedOn = null
                };

                context.Reports.Add(newReport);
                var succeeded = await context.SaveChangesAsync() > 0;

                if (!succeeded) throw new Exception("Error Saving New Report.");

                return await reportService.GetIdByTitleAsync(newReport.Title);
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