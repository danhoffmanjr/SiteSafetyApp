using System;
using System.Collections.Generic;

namespace PikeSafetyWebApp.Models
{
    public partial class ActiveStorageBlobs : DbMetadata
    {
        public long Id { get; set; }
        public string Key { get; set; }
        public string Filename { get; set; }
        public string ContentType { get; set; }
        public string Metadata { get; set; }
        public long ByteSize { get; set; }
        public string Checksum { get; set; }
    }
}
