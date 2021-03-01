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
            private readonly IUserAccessor userAccessor;
            private readonly IModelConverters modelConverters;

            public Handler(PikeSafetyDbContext context, UserManager<AppUser> userManager, IUserAccessor userAccessor, IModelConverters modelConverters)
            {
                this.modelConverters = modelConverters;
                this.userAccessor = userAccessor;
                this.userManager = userManager;
                this.context = context;
            }

            public async Task<Profile> Handle(Query request, CancellationToken cancellationToken)
            {
                var currentUser = await userManager.FindByIdAsync(userAccessor.GetCurrentUserId());
                if (request.Username != currentUser.Email) throw new RestException(HttpStatusCode.Forbidden, new { Forbidden = "Permission denied." });
                var user = await context.Users.Include(x => x.UserRoles).Include(x => x.UserSites).ThenInclude(us => us.Site).FirstOrDefaultAsync(x => x.Id == currentUser.Id);

                if (user == null) throw new RestException(HttpStatusCode.Unauthorized, new { Profile = "User Not Found" });

                var userReports = await context.Reports.Where(x => x.CreatedBy == user.FullName).ToListAsync();
                user.Reports = userReports;

                return modelConverters.AppUserToProfileWithSites(user);
            }
        }
    }
}