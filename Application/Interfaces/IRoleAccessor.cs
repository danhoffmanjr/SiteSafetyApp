using System.Threading.Tasks;
using PikeSafetyWebApp.Application.Roles;
using PikeSafetyWebApp.Models;

namespace PikeSafetyWebApp.Application.Interfaces
{
    public interface IRoleAccessor
    {
        Task<RoleDto> GetUserRoleAsync(AppUser user);
    }
}