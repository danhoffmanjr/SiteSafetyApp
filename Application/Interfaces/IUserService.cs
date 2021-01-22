using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Identity;
using PikeSafetyWebApp.Models;

namespace PikeSafetyWebApp.Application.Interfaces
{
    public interface IUserService
    {
        Task<IdentityResult> AddUserToSiteAsync(AppUser user, long siteId);
        Task<int> RemoveUserFromSiteAsync(AppUser user, long siteId);
        Task<Unit> UpdateProfileByIdAsync(PikeSafetyWebApp.Application.User.Edit.Command request);
        Task<Unit> UpdateUserByIdAsync(PikeSafetyWebApp.Application.User.EditUser.Command request);
    }
}