using System;
using System.Collections.Generic;
namespace PikeSafetyWebApp.DTO
{
    public class CompaniesDTO
    {
        public long Id { get; set; }
        public string Name { get; set; }
        public List<SitesDTO> Sites {get; set;}
    }

    public class SitesDTO
    {
        public long Id { get; set; }
        public string SiteName { get; set; }
        public string Address { get; set; }
    }

    public class NewSitesDTO
    {
        public string CompanyName { get; set; }
        public string SiteName { get; set; }
        public string SiteAddress { get; set; }
        public string LotNumber { get; set; }
        public string Notes { get; set; }
    }
}
