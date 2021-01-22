using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace PikeSafetyWebApp.DTO
{
    
    public class ReportListDTO
    {
        public long ReportId { get; set; }
        public string Company { get; set; }
        public string FormType { get; set; }
        public string Sites { get; set; }
        public string ViolationType { get; set; }
        public string SubmittedBy { get; set; }
        public string SubContractor { get; set; }
        public DateTime CreatedOn { get; set; }
        public string Narrative { get; set; }
    }
}
