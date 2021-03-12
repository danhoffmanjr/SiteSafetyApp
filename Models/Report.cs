using System.Collections.Generic;

namespace PikeSafetyWebApp.Models
{
    public class Report : EntityBase
    {
        public string Title { get; set; }
        public long ReportTypeId { get; set; }
        public string ReportType { get; set; }
        public string ReportFields { get; set; } //stringified json object based on report type fields with additional value parameter
        public long CompanyId { get; set; }
        public string CompanyName { get; set; }
        public long SiteId { get; set; }
        public string SiteName { get; set; }
        public double CompletionPercentage { get; set; }
        public bool RequireImages { get; set; }
        public ICollection<ReportImage> Images { get; set; } = new List<ReportImage>();
    }
}
