using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using PikeSafetyWebApp.Application.Interfaces;
using PikeSafetyWebApp.Application.Roles;
using PikeSafetyWebApp.Models;

namespace PikeSafetyWebApp.Application.Security
{
    public class RoleAccessor : IRoleAccessor
    {
        private readonly RoleManager<AppRole> roleManager;
        private readonly UserManager<AppUser> userManager;
        public RoleAccessor(RoleManager<AppRole> roleManager, UserManager<AppUser> userManager)
        {
            this.userManager = userManager;
            this.roleManager = roleManager;
        }

        public async Task<RoleDto> GetUserRoleAsync(AppUser user)
        {
            var roleName = await userManager.GetRolesAsync(user);
            var appRole = roleManager.Roles.FirstOrDefault(x => x.Name == roleName.First());
            var role = new RoleDto
            {
                Name = appRole.Name,
                PrivilegeLevel = appRole.PrivilegeLevel
            };

            return role;
        }
    }
}