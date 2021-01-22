using System.Net;
using System.Threading;
using System.Threading.Tasks;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Identity;
using PikeSafetyWebApp.Application.Errors;
using PikeSafetyWebApp.Application.Interfaces;
using PikeSafetyWebApp.Models;

namespace PikeSafetyWebApp.Application.Sites
{
    public class Details
    {
        public class Query : IRequest<SiteDto>
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

        public class Handler : IRequestHandler<Query, SiteDto>
        {
            private readonly UserManager<AppUser> userManager;
            private readonly IUserAccessor userAccessor;
            private readonly ISiteService siteService;
            private readonly IModelConverters modelConverters;
            public Handler(UserManager<AppUser> userManager, IUserAccessor userAccessor, ISiteService siteService, IModelConverters modelConverters)
            {
                this.modelConverters = modelConverters;
                this.siteService = siteService;
                this.userAccessor = userAccessor;
                this.userManager = userManager;
            }

            public async Task<SiteDto> Handle(Query request, CancellationToken cancellationToken)
            {
                var currentUser = await userManager.FindByIdAsync(userAccessor.GetCurrentUserId());
                var isAdmin = await userManager.IsInRoleAsync(currentUser, RoleNames.Admin);
                var userCompanyId = currentUser.CompanyId;

                var site = await siteService.FindByIdAsync(request.Id);
                if (!isAdmin)
                {
                    if (site.CompanyId != userCompanyId)
                    {
                        throw new RestException(HttpStatusCode.Forbidden, new { Forbidden = "Permission Denied." });
                    }
                }

                return modelConverters.SiteToSiteDtoWithProfiles(site);
            }
        }
    }
}