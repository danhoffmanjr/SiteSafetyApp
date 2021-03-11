using System.Collections.Generic;

namespace PikeSafetyWebApp.Models
{
    public class ReportType : EntityBase
    {
        public string Title { get; set; }
        public bool RequireImages { get; set; }
        public string Fields { get; set; }
        public virtual ICollection<Report> Reports { get; set; }
    }
}