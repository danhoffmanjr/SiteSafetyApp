using System.Collections.Generic;

namespace PikeSafetyWebApp.Models
{
    public class Report : DbMetadata
    {
        public long Id { get; set; }
        public long ReportFormTypeId { get; set; }
        public string ReportType { get; set; }
        public string Title { get; set; }
        public string ReportFields { get; set; } //stringified json object based on report type fields with additional value parameter
        public virtual long CompanyId { get; set; }
        public virtual long SiteId { get; set; }
        public virtual ICollection<ReportImage> Images { get; set; } = new List<ReportImage>();
        public bool IsComplete { get; set; }
    }
}


// old model
// public class Report : DbMetadata
//     {
//         public long Id { get; set; }
//         public string FormType { get; set; }
//         public string LotNumber { get; set; }
//         public string SubcontractorCompany { get; set; }
//         public string SubcontractorRepresentive { get; set; }
//         public string ViolationType { get; set; }
//         public string CorrectiveActionTaken { get; set; }
//         public string Narrative { get; set; }
//         public virtual Site Site { get; set; }
//         public virtual AppUser User { get; set; }
//     }
