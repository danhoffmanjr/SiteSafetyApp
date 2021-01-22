using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using PikeSafetyWebApp.Application.Errors;
using PikeSafetyWebApp.Application.Interfaces;
using PikeSafetyWebApp.Data;
using PikeSafetyWebApp.Models;

namespace PikeSafetyWebApp.Application.User
{
    public class List
    {
        public class Query : IRequest<List<Profile>> { }

        public class Handler : IRequestHandler<Query, List<Profile>>
        {
            private readonly PikeSafetyDbContext context;
            private readonly UserManager<AppUser> userManager;
            private readonly IUserAccessor userAccessor;
            private readonly IModelConverters modelConverters;

            public Handler(PikeSafetyDbContext context, UserManager<AppUser> userManager, IUserAccessor userAccessor, IModelConverters modelConverters)
            {
                this.modelConverters = modelConverters;

                this.userAccessor = userAccessor;
                this.userManager = userManager;
                this.context = context;
            }

            public async Task<List<Profile>> Handle(Query request, CancellationToken cancellationToken)
            {
                var currentUser = await userManager.FindByIdAsync(userAccessor.GetCurrentUserId());
                if (await userManager.IsInRoleAsync(currentUser, RoleNames.Inspector))
                {
                    throw new RestException(HttpStatusCode.Forbidden, new { Forbidden = "Permission denied." });
                }
                var isAdmin = await userManager.IsInRoleAsync(currentUser, RoleNames.Admin);

                var appUsers = context.Users.Include(x => x.UserRoles).Include(x => x.UserSites).ToList();
                var allAppRoles = context.Roles.Include(x => x.UserRoles).ToList(); //needed for nested data relationships, still faster than lazy loading.
                var activeSites = context.Sites.Where(x => x.IsActive == true).Include(x => x.UserSites).ToList(); //needed for nested data relationships, still faster than lazy loading.

                if (isAdmin) return Reduce(appUsers);

                var userCompanyId = currentUser.CompanyId;
                return Reduce(appUsers.Where(x => x.CompanyId == userCompanyId).ToList());
            }

            private List<Profile> Reduce(List<AppUser> records)
            {
                var profiles = records.ConvertAll(new Converter<AppUser, Profile>(modelConverters.AppUserToProfileWithSites));
                return profiles;
            }
        }
    }
}