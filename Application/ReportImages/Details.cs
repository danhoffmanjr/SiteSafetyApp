using System.Net;
using System.Threading;
using System.Threading.Tasks;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using PikeSafetyWebApp.Application.Errors;
using PikeSafetyWebApp.Application.Interfaces;
using PikeSafetyWebApp.Data;
using PikeSafetyWebApp.Models;

namespace PikeSafetyWebApp.Application.ReportImages
{
    public class Details
    {
        public class Query : IRequest<ReportImageDto>
        {
            public long Id { get; set; }
        }

        public class QueryValidator : AbstractValidator<Query>
        {
            public QueryValidator()
            {
                RuleFor(x => x.Id).NotEmpty();
            }
        }

        public class Handler : IRequestHandler<Query, ReportImageDto>
        {
            private readonly UserManager<AppUser> userManager;
            private readonly IUserAccessor userAccessor;
            private readonly IModelConverters modelConverters;
            private readonly IReportService reportService;
            private readonly PikeSafetyDbContext context;
            public Handler(PikeSafetyDbContext context, UserManager<AppUser> userManager, IUserAccessor userAccessor, IReportService reportService, IModelConverters modelConverters)
            {
                this.context = context;
                this.reportService = reportService;
                this.modelConverters = modelConverters;
                this.userAccessor = userAccessor;
                this.userManager = userManager;
            }

            public async Task<ReportImageDto> Handle(Query request, CancellationToken cancellationToken)
            {
                var currentUser = await userManager.FindByIdAsync(userAccessor.GetCurrentUserId());
                var isAdmin = await userManager.IsInRoleAsync(currentUser, RoleNames.Admin);
                var userCompanyId = currentUser.CompanyId;

                var image = await context.ReportImages.FirstOrDefaultAsync(x => x.Id == request.Id);
                if (image == null) throw new RestException(HttpStatusCode.NotFound, new { Image = "Not found" });

                if (!isAdmin)
                {
                    var report = await context.Reports.FirstOrDefaultAsync(x => x.Id == image.ReportId);
                    if (report == null) throw new RestException(HttpStatusCode.NotFound, new { Report = "Not found" });

                    var site = await context.Sites.FirstOrDefaultAsync(x => x.Id == report.SiteId);
                    if (site == null) throw new RestException(HttpStatusCode.NotFound, new { Site = "Not found" });

                    var companyId = site.CompanyId;

                    if (userCompanyId != companyId)
                    {
                        throw new RestException(HttpStatusCode.Forbidden, new { Forbidden = "Permission Denied." });
                    }
                }

                return modelConverters.ReportImageToReportImageDto(image);
            }
        }
    }
}