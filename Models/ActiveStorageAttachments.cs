using System;
using System.Collections.Generic;

namespace PikeSafetyWebApp.Models
{
    public partial class ActiveStorageAttachments : DbMetadata
    {
        public long Id { get; set; }
        public string Name { get; set; }
        public string RecordType { get; set; }
        public long RecordId { get; set; }
        public long BlobId { get; set; }
    }
}
