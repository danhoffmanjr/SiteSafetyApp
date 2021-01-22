using System;
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
    public class Create
    {
        public class Query : IRequest<SiteDto>
        {
            public long CompanyId { get; set; }
            public string Name { get; set; }
            public string Address { get; set; }
            public string Notes { get; set; }
        }

        public class QueryValidator : AbstractValidator<Query>
        {
            public QueryValidator()
            {
                RuleFor(x => x.CompanyId).NotEmpty();
                RuleFor(x => x.Name).NotEmpty();
                RuleFor(x => x.Address).NotEmpty();
            }
        }

        public class Handler : IRequestHandler<Query, SiteDto>
        {
            private readonly UserManager<AppUser> userManager;
            private readonly IUserAccessor userAccessor;
            private readonly ISiteService siteService;
            private readonly ICompanyService companyService;
            private readonly IModelConverters modelConverters;
            public Handler(UserManager<AppUser> userManager, IUserAccessor userAccessor, ISiteService siteService, ICompanyService companyService, IModelConverters modelConverters)
            {
                this.modelConverters = modelConverters;
                this.companyService = companyService;
                this.userAccessor = userAccessor;
                this.userManager = userManager;
                this.siteService = siteService;
            }

            public async Task<SiteDto> Handle(Query request, CancellationToken cancellationToken)
            {
                var currentUser = await userManager.FindByIdAsync(userAccessor.GetCurrentUserId());
                if (await userManager.IsInRoleAsync(currentUser, RoleNames.Inspector))
                {
                    throw new RestException(HttpStatusCode.Forbidden, new { Forbidden = "Permission Denied." });
                }
                var doesNameExist = siteService.CheckExistsByName(request.Name);
                if (doesNameExist) throw new RestException(HttpStatusCode.BadRequest, new { Name = "Site name already exists." });
                var doesAddressExist = siteService.CheckExistsByAddress(request.Address);
                if (doesAddressExist) throw new RestException(HttpStatusCode.BadRequest, new { Address = "Site address already exists." });

                var newSite = new Site
                {
                    CompanyId = request.CompanyId,
                    CompanyName = await companyService.GetCompanyNameByIdAsync(request.CompanyId),
                    Name = request.Name,
                    Address = request.Address,
                    Notes = request.Notes,
                    CreatedOn = DateTime.UtcNow,
                    CreatedBy = currentUser.FullName,
                    UpdatedOn = null,
                    UpdatedBy = null,
                    IsActive = true
                };

                var succeeded = await siteService.AddAsync(newSite);
                if (!succeeded) throw new Exception("Error Saving New Site.");

                var site = await siteService.FindByNameAsync(newSite.Name);

                return modelConverters.SiteToSiteDtoWithProfiles(site);
            }
        }
    }
}