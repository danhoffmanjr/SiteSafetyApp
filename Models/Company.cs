using System;
using System.Collections.Generic;

namespace PikeSafetyWebApp.Models
{
    public class Company : DbMetadata
    {
        public long Id { get; set; }
        public string Name { get; set; }

        public virtual ICollection<AppUser> Users { get; set; }
        public virtual ICollection<Site> Sites { get; set; }
    }
}
