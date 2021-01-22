using System.Collections.Generic;
using PikeSafetyWebApp.Application.Reports;
using PikeSafetyWebApp.Application.User;
using PikeSafetyWebApp.Models;

namespace PikeSafetyWebApp.Application.Sites
{
    public class SiteDto
    {
        public SiteDto()
        {
        }

        public SiteDto(Site site)
        {
            this.Id = site.Id;
            this.Name = site.Name;
            this.Address = site.Address;
            this.CompanyId = site.CompanyId;
            this.CompanyName = site.CompanyName;
            this.Notes = site.Notes;
        }
        public long Id { get; set; }
        public string Name { get; set; }
        public string Address { get; set; }
        public string Notes { get; set; }
        public long CompanyId { get; set; }
        public string CompanyName { get; set; }
        public ICollection<ReportDto> Reports { get; set; }
        public ICollection<Profile> Users { get; set; }
    }
}