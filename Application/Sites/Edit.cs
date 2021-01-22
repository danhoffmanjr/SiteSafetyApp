using System.Net;
using System.Threading;
using System.Threading.Tasks;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Identity;
using PikeSafetyWebApp.Application.Errors;
using PikeSafetyWebApp.Application.Interfaces;
using PikeSafetyWebApp.Models;

namespace PikeSafetyWebApp.Application.Sites
{
    public class Edit
    {
        public class Command : IRequest
        {
            public long Id { get; set; }
            public string Name { get; set; }
            public string Address { get; set; }
            public string Notes { get; set; }
            public long CompanyId { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.Id).NotEmpty();
                RuleFor(x => x.Name).NotEmpty();
                RuleFor(x => x.Address).NotEmpty();
                RuleFor(x => x.CompanyId).NotEmpty();
            }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly UserManager<AppUser> userManager;
            private readonly IUserAccessor userAccessor;
            private readonly ISiteService siteService;
            private readonly IModelConverters modelConverters;
            public Handler(UserManager<AppUser> userManager, IUserAccessor userAccessor, ISiteService siteService, IModelConverters modelConverters)
            {
                this.modelConverters = modelConverters;
                this.siteService = siteService;
                this.userAccessor = userAccessor;
                this.userManager = userManager;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                var currentUser = await userManager.FindByIdAsync(userAccessor.GetCurrentUserId());
                var isAdmin = await userManager.IsInRoleAsync(currentUser, RoleNames.Admin);
                var userCompanyId = currentUser.CompanyId;

                if (!isAdmin)
                {
                    if (request.CompanyId != userCompanyId)
                    {
                        throw new RestException(HttpStatusCode.Forbidden, new { Forbidden = "Permission Denied." });
                    }
                }

                return await siteService.UpdateByIdAsync(request);
            }
        }
    }
}