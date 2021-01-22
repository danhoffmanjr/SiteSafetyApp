using System;
namespace PikeSafetyWebApp.DTO
{
    public class AddReportDTO
    {
        
            public string FormType { get; set; }
            public string LotNumber { get; set; }
            public string SubcontractorCompany { get; set; }
            public string SubcontractorRepresentive { get; set; }
            public string ViolationType { get; set; }
            public string CorrectiveActionTaken { get; set; }
            public string Narrative { get; set; }
    }
}
