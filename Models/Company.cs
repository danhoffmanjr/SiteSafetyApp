using System;
using System.Collections.Generic;

namespace PikeSafetyWebApp.Models
{
    public class Company : EntityBase
    {
        public string Name { get; set; }
        public virtual ICollection<AppUser> Users { get; set; }
        public virtual ICollection<Site> Sites { get; set; }
    }
}
