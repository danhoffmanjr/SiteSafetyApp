using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Identity;

namespace PikeSafetyWebApp.Models
{
    public class AppUserRole : IdentityUserRole<string>
    {
        [JsonIgnore]
        public virtual AppUser User { get; set; }
        [JsonIgnore]
        public virtual AppRole Role { get; set; }
    }
}