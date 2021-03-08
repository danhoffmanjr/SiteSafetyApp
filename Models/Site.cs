using System;
using System.Collections.Generic;

namespace PikeSafetyWebApp.Models
{
    public class Site : EntityBase
    {
        private string NormalizeName(string name) => name?.Trim() ?? string.Empty;
        private string NormalizeAddress(string address) => address?.Trim() ?? string.Empty;
        private string NormalizeNotes(string notes) => notes?.Trim() ?? string.Empty;

        public Site() { }
        public Site(string name, string address, string notes)
        {
            this.Name = NormalizeName(name);
            this.Address = NormalizeAddress(address);
            this.Notes = NormalizeNotes(notes);
        }

        public string Name { get; set; } = String.Empty;
        public string Address { get; set; } = String.Empty;
        public string Notes { get; set; } = String.Empty;
        public long CompanyId { get; set; }
        public string CompanyName { get; set; } = String.Empty;
        public ICollection<Report> Reports { get; set; } = new List<Report>();
        public ICollection<UserSite> UserSites { get; set; } = new List<UserSite>();

        public override int GetHashCode() =>
            this.Name.GetHashCode() ^
            this.Address.GetHashCode() ^
            this.Notes.GetHashCode();

        private bool Comparison(Site first, Site second) =>
            first.Name.Equals(second.Name, StringComparison.CurrentCultureIgnoreCase) &&
            first.Address.Equals(second.Address, StringComparison.CurrentCultureIgnoreCase) &&
            first.Notes.Equals(second.Notes, StringComparison.CurrentCultureIgnoreCase);

        public override bool Equals(object obj)
        {
            if ((object)this == obj)
                return true;

            var site = obj as Site;

            if ((object)site == null)
                return false;

            var isEqual = Comparison(this, site);
            return isEqual;
        }
    }
}
