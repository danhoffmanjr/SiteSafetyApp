using System.Net;
using System.Threading;
using System.Threading.Tasks;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Identity;
using PikeSafetyWebApp.Application.Errors;
using PikeSafetyWebApp.Application.Interfaces;
using PikeSafetyWebApp.Models;

namespace PikeSafetyWebApp.Application.Reports
{
    public class Details
    {
        public class Query : IRequest<ReportDto>
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

        public class Handler : IRequestHandler<Query, ReportDto>
        {
            private readonly UserManager<AppUser> userManager;
            private readonly IUserAccessor userAccessor;
            private readonly IModelConverters modelConverters;
            private readonly IReportService reportService;
            public Handler(UserManager<AppUser> userManager, IUserAccessor userAccessor, IReportService reportService, IModelConverters modelConverters)
            {
                this.reportService = reportService;
                this.modelConverters = modelConverters;
                this.userAccessor = userAccessor;
                this.userManager = userManager;
            }

            public async Task<ReportDto> Handle(Query request, CancellationToken cancellationToken)
            {
                var currentUser = await userManager.FindByIdAsync(userAccessor.GetCurrentUserId());
                var isAdmin = await userManager.IsInRoleAsync(currentUser, RoleNames.Admin);
                var userCompanyId = currentUser.CompanyId;

                var report = await reportService.FindByIdAsync(request.Id);
                if (!isAdmin)
                {
                    if (report.CompanyId != userCompanyId)
                    {
                        throw new RestException(HttpStatusCode.Forbidden, new { Forbidden = "Permission Denied." });
                    }
                }

                return modelConverters.ReportToReportDto(report);
            }
        }
    }
}