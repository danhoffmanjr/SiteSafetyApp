using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using PikeSafetyWebApp.Application.Errors;
using PikeSafetyWebApp.Application.Interfaces;
using PikeSafetyWebApp.Data;
using PikeSafetyWebApp.Models;

namespace PikeSafetyWebApp.Application.ReportImages
{
    public class Edit
    {
        public class Command : IRequest
        {
            public long Id { get; set; }
            public string FileName { get; set; }
            public string Description { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.Id).NotEmpty();
                RuleFor(x => x.FileName).NotEmpty();
            }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly UserManager<AppUser> userManager;
            private readonly IUserAccessor userAccessor;
            private readonly PikeSafetyDbContext context;
            public Handler(PikeSafetyDbContext context, UserManager<AppUser> userManager, IUserAccessor userAccessor)
            {
                this.context = context;
                this.userAccessor = userAccessor;
                this.userManager = userManager;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                var currentUser = await userManager.FindByIdAsync(userAccessor.GetCurrentUserId());
                var isAdmin = await userManager.IsInRoleAsync(currentUser, RoleNames.Admin);
                var userCompanyId = currentUser.CompanyId;

                var image = await context.ReportImages.FirstOrDefaultAsync(x => x.Id == request.Id);
                if (image == null) throw new RestException(HttpStatusCode.NotFound, new { Image = "Not found" });

                if (!isAdmin)
                {
                    var report = await context.Reports.FirstOrDefaultAsync(x => x.Id == image.ReportId);
                    if (report == null) throw new RestException(HttpStatusCode.NotFound, new { Report = "Not found" });

                    var site = await context.Sites.FirstOrDefaultAsync(x => x.Id == report.SiteId);
                    if (site == null) throw new RestException(HttpStatusCode.NotFound, new { Site = "Not found" });

                    var companyId = site.CompanyId;

                    if (userCompanyId != companyId)
                    {
                        throw new RestException(HttpStatusCode.Forbidden, new { Forbidden = "Permission Denied." });
                    }
                }

                //TODO: create Equals override in ReportImage class to compare objects
                image.FileName = request.FileName;
                image.Description = request.Description;

                context.Entry(image).State = EntityState.Modified;

                var success = await context.SaveChangesAsync() > 0;

                if (success) return Unit.Value;

                throw new Exception($"Problem updating {request.FileName}");
            }
        }
    }
}