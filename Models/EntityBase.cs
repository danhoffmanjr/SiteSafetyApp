using System;
using PikeSafetyWebApp.Models.Interfaces;

namespace PikeSafetyWebApp.Models
{
    public class EntityBase : IEntityBase
    {
        public long Id { get; set; }
        public string CreatedBy { get; set; }
        public string UpdatedBy { get; set; }
        public DateTime CreatedOn { get; set; }
        public DateTime? UpdatedOn { get; set; }
        public bool IsActive { get; set; } = true;
    }
}