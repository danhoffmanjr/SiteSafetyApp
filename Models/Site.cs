using System;
using System.Collections.Generic;

namespace PikeSafetyWebApp.Models
{
    public class Site : DbMetadata
    {
        public long Id { get; set; }
        public string Name { get; set; }
        public string Address { get; set; }
        public string Notes { get; set; }
        public virtual long CompanyId { get; set; }
        public string CompanyName { get; set; }
        public virtual ICollection<Report> Reports { get; set; }
        public virtual ICollection<UserSite> UserSites { get; set; }
    }
}
