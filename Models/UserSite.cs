using System.Text.Json.Serialization;

namespace PikeSafetyWebApp.Models
{
    public class UserSite
    {
        public string AppUserId { get; set; }
        public AppUser User { get; set; }
        public long SiteId { get; set; }
        public Site Site { get; set; }
    }
}