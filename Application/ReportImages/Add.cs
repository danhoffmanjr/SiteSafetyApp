using System;
using System.IO;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using PikeSafetyWebApp.Application.Interfaces;
using PikeSafetyWebApp.Data;
using PikeSafetyWebApp.Models;

namespace PikeSafetyApp.Application.ReportImages
{
    public class Add
    {
        public class Command : IRequest<ReportImage>
        {
            public IFormFile File { get; set; }
            public string Filename { get; set; }
        }

        public class handler : IRequestHandler<Command, ReportImage>
        {
            private readonly PikeSafetyDbContext context;
            private readonly IUserAccessor userAccessor;
            public handler(PikeSafetyDbContext context, IUserAccessor userAccessor)
            {
                this.userAccessor = userAccessor;
                this.context = context;
            }

            public async Task<ReportImage> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await context.Users.FirstOrDefaultAsync(x => x.Id == userAccessor.GetCurrentUserId());

                if (user == null) return null;

                var file = request.File;
                if (file.Length > 0)
                {
                    using var ms = new MemoryStream();
                    file.CopyTo(ms);
                    var fileBytes = ms.ToArray();

                    var newImage = new ReportImage
                    {
                        ImageData = fileBytes,
                        FileName = request.Filename,
                        FileType = file.ContentType,
                        Size = file.Length,
                        ReportId = 1
                    };

                    await context.ReportImages.AddAsync(newImage);

                    var result = await context.SaveChangesAsync() > 0;

                    return newImage;

                }

                return null;

            }
        }
    }
}