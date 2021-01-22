using System;
using System.Collections.Generic;
using System.Linq;
using PikeSafetyWebApp.Application.Sites;
using PikeSafetyWebApp.Application.User;
using PikeSafetyWebApp.Models;
using PikeSafetyWebApp.Application.Utils;

namespace PikeSafetyWebApp.Application.Companies
{
    public class CompanyDto
    {
        public CompanyDto()
        {
        }

        public CompanyDto(Company company)
        {
            this.Id = company.Id;
            this.Name = company.Name;
            this.Sites = company.Sites?.ToList().ConvertAll(new Converter<Site, SiteDto>(Converters.SiteToDto));
        }

        public long Id { get; set; }
        public string Name { get; set; }
        public List<SiteDto> Sites { get; set; }
        public List<Profile> Users { get; set; }
    }
}