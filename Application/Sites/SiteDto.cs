using System;
using System.Collections.Generic;
using PikeSafetyWebApp.Application.Reports;
using PikeSafetyWebApp.Application.User;
using PikeSafetyWebApp.Models;

namespace PikeSafetyWebApp.Application.Sites
{
    public class SiteDto
    {
        private string NormalizeName(string name) => name?.Trim() ?? string.Empty;
        private string NormalizeAddress(string address) => address?.Trim() ?? string.Empty;
        private string NormalizeNotes(string notes) => notes?.Trim() ?? string.Empty;

        public SiteDto() { }
        public SiteDto(Site site)
        {
            this.Id = site.Id;
            this.CompanyId = site.CompanyId;
            this.CompanyName = site.CompanyName;
            this.Name = NormalizeName(site.Name);
            this.Address = NormalizeAddress(site.Address);
            this.Notes = NormalizeNotes(site.Notes);
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