namespace PikeSafetyWebApp.Models
{
    public class ReportImage : DbMetadata
    {
        public long Id { get; set; }
        public long ReportId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public byte[] ImageData { get; set; }
    }
}