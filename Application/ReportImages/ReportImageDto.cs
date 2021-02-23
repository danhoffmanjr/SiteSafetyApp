namespace PikeSafetyWebApp.Application.ReportImages
{
    public class ReportImageDto
    {
        public long Id { get; set; }
        public long ReportId { get; set; }
        public string FileName { get; set; }
        public string FileType { get; set; }
        public string Description { get; set; }
        public long Size { get; set; }
        public string ImageDataUrl { get; set; }
    }
}