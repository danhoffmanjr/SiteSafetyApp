using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace PikeSafetyWebApp.DTO
{

    public class ReportDetailDTO
    {
        public long ReportId { get; set; }
        public long? Company { get; set; }
        public string FormType { get; set; }
        public long? Site { get; set; }
        public string LotNumber { get; set; }
        public string ViolationType { get; set; }
        public string SubmittedBy { get; set; }
        public string Narrative { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public string SubcontractorCompany { get; set; }
        public string SubcontractorRepresentive { get; set; }
        public string CorrectiveActionTaken { get; set; }
        public string SiteAddress { get; set; }
        public List<DropDownDTO> Companies { get; set; }
        public List<DropDownDTO> Sites { get; set; }
    }
}
