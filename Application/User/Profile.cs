using System.Collections.Generic;
using System.Linq;
using PikeSafetyWebApp.Application.Interfaces;
using PikeSafetyWebApp.Application.Reports;
using PikeSafetyWebApp.Application.Sites;
using PikeSafetyWebApp.Models;

namespace PikeSafetyWebApp.Application.User
{
    public class Profile
    {
        public Profile() { }

        public Profile(AppUser user, ICompanyService companyService)
        {
            Id = user.Id;
            FirstName = user.FirstName;
            LastName = user.LastName;
            FullName = user.FullName;
            Email = user.Email;
            CompanyName = companyService.GetCompanyNameByIdAsync(user.CompanyId).Result;
            CompanyId = user.CompanyId;
            Role = user.UserRoles.SingleOrDefault().Role.Name;
        }
        public string Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public string CompanyName { get; set; }
        public long CompanyId { get; set; }
        public string ContactPhoneNumber { get; set; }
        public string Role { get; set; }
        public bool IsActive { get; set; }
        public ICollection<SiteDto> Sites { get; set; }
        public ICollection<ReportDto> Reports { get; set; }
    }
}