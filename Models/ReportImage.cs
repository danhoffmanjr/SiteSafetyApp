using System;

namespace PikeSafetyWebApp.Models
{
    public class ReportImage : EntityBase
    {
        public long ReportId { get; set; }
        public string FileName { get; set; }
        public string FileType { get; set; }
        public string Description { get; set; } = String.Empty;
        public long Size { get; set; }
        public byte[] ImageData { get; set; }

        public string ImageDataUrl
        {
            get
            {
                string imageBase64Data = Convert.ToBase64String(this.ImageData);
                return string.Format("data:image/png;base64,{0}", imageBase64Data);
            }
        }
    }
}