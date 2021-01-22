using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using PikeSafetyWebApp.Application.Interfaces;
using System.Collections.Generic;
using System;
using PikeSafetyWebApp.Models;

namespace PikeSafetyWebApp.Application.Security
{
    public class UserAccessor : IUserAccessor
    {
        private readonly IHttpContextAccessor httpContextAccessor;
        private readonly IdentityErrorDescriber errors;
        public UserAccessor(IHttpContextAccessor httpContextAccessor, IdentityErrorDescriber errors)
        {
            this.errors = errors;
            this.httpContextAccessor = httpContextAccessor;
        }

        public string GetCurrentUserId()
        {
            var user = httpContextAccessor.HttpContext.User;
            if (user == null) throw new ArgumentNullException(nameof(user));

            var userId = user?.Claims?.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier)?.Value;
            return userId == null ? string.Empty : userId;
        }

        public async Task<IdentityResult> ConfirmInviteAsync(AppUser user, UserManager<AppUser> userManager, string token)
        {
            if (user == null)
            {
                throw new ArgumentNullException(nameof(user));
            }

            if (!await userManager.VerifyUserTokenAsync(user, TokenOptions.DefaultProvider, "InviteConfirmation", token))
            {
                return IdentityResult.Failed(errors.InvalidToken());
            }

            user.IsActive = true;
            user.EmailConfirmed = true;

            return await userManager.UpdateAsync(user);
        }

        public async Task<IdentityResult> ConfirmRefreshTokenAsync(AppUser user, UserManager<AppUser> userManager, string token)
        {
            if (user == null)
            {
                throw new ArgumentNullException(nameof(user));
            }

            if (!await userManager.VerifyUserTokenAsync(user, TokenOptions.DefaultProvider, "RefreshToken", token))
            {
                return IdentityResult.Failed(errors.InvalidToken());
            }

            user.IsActive = true;
            user.EmailConfirmed = true;

            return await userManager.UpdateAsync(user);
        }
    }
}