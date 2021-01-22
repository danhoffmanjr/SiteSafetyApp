using System.Linq;
using Microsoft.AspNetCore.Identity;
using PikeSafetyWebApp.Models;

namespace PikeSafetyWebApp.Application.Roles
{
    public class RoleDto
    {
        public RoleDto()
        {
        }

        public RoleDto(AppRole role)
        {
            this.Name = role.Name;
            this.PrivilegeLevel = role.PrivilegeLevel;
        }

        public string Name { get; set; }
        public int PrivilegeLevel { get; set; }
    }
}