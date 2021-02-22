using System.Collections.Generic;

namespace PikeSafetyWebApp.Models
{
    public class Report : DbMetadata
    {
        public long Id { get; set; }
        public long ReportTypeId { get; set; }
        public string ReportType { get; set; }
        public string Title { get; set; }
        public string ReportFields { get; set; } //stringified json object based on report type fields with additional value parameter
        public virtual long CompanyId { get; set; }
        public virtual long SiteId { get; set; }
        public virtual ICollection<ReportImage> Images { get; set; } = new List<ReportImage>();
        public bool IsComplete { get; set; }
    }
}
