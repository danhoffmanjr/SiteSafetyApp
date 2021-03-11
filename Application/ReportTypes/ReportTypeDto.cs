using System;
using System.Collections.Generic;
using PikeSafetyWebApp.Models;

namespace PikeSafetyWebApp.Application.ReportTypes
{
    public class ReportTypeDto
    {
        public long Id { get; set; }
        public string Title { get; set; }
        public bool RequireImages { get; set; }
        public ICollection<ReportTypeField> Fields { get; set; } = new List<ReportTypeField>();
        public DateTime CreatedOn { get; set; }
        public DateTime? UpdatedOn { get; set; }
        public string CreatedBy { get; set; }
        public string UpdatedBy { get; set; }
        public bool IsActive { get; set; }
    }
}