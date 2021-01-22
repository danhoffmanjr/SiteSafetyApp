using System;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.WebUtilities;
using PikeSafetyWebApp.Application.Errors;
using PikeSafetyWebApp.Application.Interfaces;
using PikeSafetyWebApp.Application.Security;
using PikeSafetyWebApp.Models;

namespace PikeSafetyWebApp.Application.User
{
    public class RefreshToken
    {
        public class Command : IRequest<UserDto>
        {
            public string RefreshToken { get; set; }
        }

        public class Handler : IRequestHandler<Command, UserDto>
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

            public async Task<UserDto> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await userManager.FindByIdAsync(userAccessor.GetCurrentUserId());
                if (user == null) return null;

                var role = await roleAccessor.GetUserRoleAsync(user);

                var tokenBytes = WebEncoders.Base64UrlDecode(request.RefreshToken);
                var decodedToken = Encoding.UTF8.GetString(tokenBytes);
                var result = await userAccessor.ConfirmRefreshTokenAsync(user, userManager, decodedToken);
                if (!result.Succeeded) throw new RestException(HttpStatusCode.Unauthorized);

                var newRefreshToken = await userManager.GenerateUserTokenAsync(user, TokenOptions.DefaultProvider, "RefreshToken");

                return new UserDto(user, role, tokenGenerator, newRefreshToken);
            }
        }
    }
}