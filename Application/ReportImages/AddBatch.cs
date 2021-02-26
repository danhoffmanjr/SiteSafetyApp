using System;
using System.Collections.Generic;
using System.IO;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using PikeSafetyWebApp.Application.Interfaces;
using PikeSafetyWebApp.Data;
using PikeSafetyWebApp.Models;

namespace PikeSafetyWebApp.Application.ReportImages
{
    public class AddBatch
    {
        public class Command : IRequest
        {
            public List<IFormFile> Files { get; set; }
            public long ReportId { get; set; }
        }

        public class handler : IRequestHandler<Command>
        {
            private readonly PikeSafetyDbContext context;
            private readonly IUserAccessor userAccessor;
            public handler(PikeSafetyDbContext context, IUserAccessor userAccessor)
            {
                this.userAccessor = userAccessor;
                this.context = context;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await context.Users.FirstOrDefaultAsync(x => x.Id == userAccessor.GetCurrentUserId());

                if (user == null) return Unit.Value;

                if (request.Files.Count > 0)
                {
                    var images = new List<ReportImage>();

                    foreach (var image in request.Files)
                    {
                        using var ms = new MemoryStream();
                        image.CopyTo(ms);
                        var fileBytes = ms.ToArray();

                        images.Add(new ReportImage
                        {
                            ImageData = fileBytes,
                            FileName = image.FileName,
                            FileType = image.ContentType,
                            Size = image.Length,
                            ReportId = request.ReportId
                        });
                    }

                    await context.ReportImages.AddRangeAsync(images);

                    var succeeded = await context.SaveChangesAsync() > 0;
                    if (!succeeded) throw new Exception("Error Saving Report Images.");

                    return Unit.Value;

                }

                return Unit.Value;
            }
        }
    }
}