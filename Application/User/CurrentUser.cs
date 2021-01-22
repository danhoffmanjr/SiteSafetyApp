using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Identity;
using PikeSafetyWebApp.Application.Interfaces;
using PikeSafetyWebApp.Application.Security;
using PikeSafetyWebApp.Models;

namespace PikeSafetyWebApp.Application.User
{
    public class CurrentUser
    {
        public class Query : IRequest<UserDto> { }

        public class Handler : IRequestHandler<Query, UserDto>
        {
            private readonly IUserAccessor userAccessor;
            private readonly ITokenGenerator tokenGenerator;
            private readonly UserManager<AppUser> userManager;
            private readonly IRoleAccessor roleAccessor;
            public Handler(UserManager<AppUser> userManager, IRoleAccessor roleAccessor, ITokenGenerator tokenGenerator, IUserAccessor userAccessor)
            {
                this.roleAccessor = roleAccessor;
                this.userManager = userManager;
                this.tokenGenerator = tokenGenerator;
                this.userAccessor = userAccessor;
            }

            public async Task<UserDto> Handle(Query request, CancellationToken cancellationToken)
            {
                var user = await userManager.FindByIdAsync(userAccessor.GetCurrentUserId());
                if (user == null) return null;

                var role = await roleAccessor.GetUserRoleAsync(user);

                var refreshToken = await userManager.GenerateUserTokenAsync(user, TokenOptions.DefaultProvider, "RefreshToken");

                return new UserDto(user, role, tokenGenerator, refreshToken);
            }
        }
    }
}