using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Identity;

namespace PikeSafetyWebApp.Models
{
    public class AppUser : IdentityUser
    {
        public AppUser()
        {
            UserRoles = new HashSet<AppUserRole>();
        }

        public string Title { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string FullName
        {
            get { return $"{FirstName} {LastName}"; }
        }
        public bool IsActive { get; set; }
        public long CompanyId { get; set; }
        public ICollection<AppUserRole> UserRoles { get; set; }
        public ICollection<Report> Reports { get; set; }
        public List<UserSite> UserSites { get; set; }
    }
}