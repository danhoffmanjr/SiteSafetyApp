using System;
using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using PikeSafetyWebApp.Application.Errors;
using PikeSafetyWebApp.Data;
using PikeSafetyWebApp.Models;
using PikeSafetyWebApp.Application.Interfaces;

namespace PikeSafetyWebApp.Application.User
{
    public class ProfileDetails
    {
        public class Query : IRequest<Profile>
        {
            public string Username { get; set; }
        }

        public class Handler : IRequestHandler<Query, Profile>
        {
            private readonly PikeSafetyDbContext context;
            private readonly UserManager<AppUser> userManager;
            private readonly IRoleAccessor roleAccessor;
            private readonly IModelConverters modelConverters;

            public Handler(PikeSafetyDbContext context, UserManager<AppUser> userManager, IRoleAccessor roleAccessor, IModelConverters modelConverters)
            {
                this.modelConverters = modelConverters;
                this.roleAccessor = roleAccessor;
                this.userManager = userManager;
                this.context = context;
            }

            public async Task<Profile> Handle(Query request, CancellationToken cancellationToken)
            {
                var allAppRoles = await context.Roles.Include(x => x.UserRoles).ToListAsync(); //needed for nested data relationships, still faster than lazy loading.
                var activeSites = await context.Sites.Where(x => x.IsActive == true).Include(x => x.UserSites).ToListAsync(); //needed for nested data relationships, still faster than lazy loading.
                var user = await context.Users.Where(x => x.UserName == request.Username).Include(x => x.UserRoles).Include(x => x.UserSites).Include(x => x.Reports).FirstOrDefaultAsync();
                if (user == null) throw new RestException(HttpStatusCode.Unauthorized, new { Profile = "User Not Found" });

                var reports = await context.Reports.Where(x => x.CreatedBy == user.Id).ToListAsync();
                user.Reports = reports;

                return modelConverters.AppUserToProfileWithSites(user);
            }
        }
    }
}