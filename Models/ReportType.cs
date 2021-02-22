using System.Collections.Generic;

namespace PikeSafetyWebApp.Models
{
    public class ReportType : DbMetadata
    {
        public long Id { get; set; }
        public string Title { get; set; }
        public string Fields { get; set; }
        public virtual ICollection<Report> Reports { get; set; }
    }
}