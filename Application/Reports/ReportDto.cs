using System;
using System.Collections.Generic;
using PikeSafetyApp.Application.ReportImages;
using PikeSafetyWebApp.Models;

namespace PikeSafetyWebApp.Application.Reports
{
    public class ReportDto
    {
        public long Id { get; set; }
        public string Title { get; set; }
        public string ReportType { get; set; }
        public long ReportTypeId { get; set; }
        public ICollection<ReportField> ReportFields { get; set; }
        public ICollection<ReportImageDto> Images { get; set; }
        public bool IsComplete { get; set; }
        public long CompanyId { get; set; }
        public string CompanyName { get; set; }
        public long SiteId { get; set; }
        public string SiteName { get; set; }
        public DateTime CreatedOn { get; set; }
        public DateTime? UpdatedOn { get; set; }
        public string CreatedBy { get; set; }
        public string UpdatedBy { get; set; }
        public bool IsActive { get; set; }
    }
}