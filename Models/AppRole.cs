using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Identity;

namespace PikeSafetyWebApp.Models
{
    public class AppRole : IdentityRole
    {
        public string Description { get; set; }
        public int PrivilegeLevel { get; set; }
        [JsonIgnore]
        public virtual ICollection<AppUserRole> UserRoles { get; set; }
    }
}
