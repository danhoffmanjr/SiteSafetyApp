using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using PikeSafetyWebApp.Application.Interfaces;
using PikeSafetyWebApp.Data;
using PikeSafetyWebApp.Models;

namespace PikeSafetyWebApp.Application.Roles
{
    public class List
    {
        public class Query : IRequest<List<RoleDto>> { }

        public class Handler : IRequestHandler<Query, List<RoleDto>>
        {
            private readonly PikeSafetyDbContext context;
            private readonly UserManager<AppUser> userManager;
            private readonly IUserAccessor userAccessor;
            private readonly RoleManager<AppRole> roleManager;

            public Handler(PikeSafetyDbContext context, UserManager<AppUser> userManager, RoleManager<AppRole> roleManager, IUserAccessor userAccessor)
            {
                this.roleManager = roleManager;
                this.userAccessor = userAccessor;
                this.userManager = userManager;
                this.context = context;
            }

            public async Task<List<RoleDto>> Handle(Query request, CancellationToken cancellationToken)
            {
                var currentUser = await userManager.FindByIdAsync(userAccessor.GetCurrentUserId());
                var isAdmin = await userManager.IsInRoleAsync(currentUser, RoleNames.Admin);
                var appRoles = roleManager.Roles.ToList();

                if (isAdmin)
                {
                    return Reduce(appRoles);
                }
                else
                {
                    var companyId = currentUser.CompanyId;
                    return Reduce(appRoles.Where(x => x.Name != "Admin").ToList());
                }
            }

            private List<RoleDto> Reduce(List<AppRole> records)
            {
                var roles = new List<RoleDto>();
                foreach (var record in records)
                {
                    roles.Add(new RoleDto(record));
                }
                return roles;
            }
        }
    }
}