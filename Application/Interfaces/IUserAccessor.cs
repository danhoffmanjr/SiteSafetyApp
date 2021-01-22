using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using PikeSafetyWebApp.Models;

namespace PikeSafetyWebApp.Application.Interfaces
{
    public interface IUserAccessor
    {
        string GetCurrentUserId();
        Task<IdentityResult> ConfirmInviteAsync(AppUser user, UserManager<AppUser> userManager, string token);
        Task<IdentityResult> ConfirmRefreshTokenAsync(AppUser user, UserManager<AppUser> userManager, string token);
    }
}