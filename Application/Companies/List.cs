using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using PikeSafetyWebApp.Application.Interfaces;
using PikeSafetyWebApp.Application.Sites;
using PikeSafetyWebApp.Application.User;
using PikeSafetyWebApp.Data;
using PikeSafetyWebApp.Models;

namespace PikeSafetyWebApp.Application.Companies
{
    public class List
    {
        public class Query : IRequest<List<CompanyDto>> { }

        public class Handler : IRequestHandler<Query, List<CompanyDto>>
        {
            private readonly UserManager<AppUser> userManager;
            private readonly IUserAccessor userAccessor;
            private readonly ICompanyService companyService;

            public Handler(UserManager<AppUser> userManager, IUserAccessor userAccessor, ICompanyService companyService)
            {
                this.companyService = companyService;
                this.userAccessor = userAccessor;
                this.userManager = userManager;
            }

            public async Task<List<CompanyDto>> Handle(Query request, CancellationToken cancellationToken)
            {
                var currentUser = await userManager.FindByIdAsync(userAccessor.GetCurrentUserId());
                var isAdmin = await userManager.IsInRoleAsync(currentUser, RoleNames.Admin);
                var activeCompanies = await companyService.GetActiveCompanies();

                if (isAdmin)
                {
                    return Reduce(activeCompanies);
                }
                else
                {
                    var companyId = currentUser.CompanyId;
                    return Reduce(activeCompanies.Where(x => x.Id == companyId).ToList());
                }
            }

            private List<CompanyDto> Reduce(List<Company> records)
            {
                var companyDtos = new List<CompanyDto>();
                foreach (var record in records)
                {
                    var sites = new List<SiteDto>();
                    foreach (var site in record.Sites)
                    {
                        sites.Add(new SiteDto(site));
                    }

                    companyDtos.Add(new CompanyDto
                    {
                        Id = record.Id,
                        Name = record.Name,
                        Sites = sites.OrderBy(x => x.Name).ToList(),
                        Users = null
                    });
                }

                return companyDtos;
            }
        }
    }
}