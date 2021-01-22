namespace PikeSafetyWebApp.Models
{
    public class Report : DbMetadata
    {
        public long Id { get; set; }
        public string Title { get; set; }
        public string FormType { get; set; }
        public string FormDetails { get; set; } //stringified json object based on form type
        public bool IsComplete { get; set; }
        public virtual long CompanyId { get; set; }
        public virtual long SiteId { get; set; }
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
