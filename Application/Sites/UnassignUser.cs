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

namespace PikeSafetyWebApp.Application.Sites
{
    public class UnassignUser
    {
        public class Command : IRequest
        {
            public string UserId { get; set; }
            public long SiteId { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.UserId).NotEmpty();
                RuleFor(x => x.SiteId).NotEmpty();
            }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly UserManager<AppUser> userManager;
            private readonly PikeSafetyDbContext context;
            private readonly IUserAccessor userAccessor;
            private readonly IUserService userService;
            public Handler(PikeSafetyDbContext context, UserManager<AppUser> userManager, IUserAccessor userAccessor, IUserService userService)
            {
                this.context = context;
                this.userManager = userManager;
                this.userAccessor = userAccessor;
                this.userService = userService;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                var currentUser = await userManager.FindByIdAsync(userAccessor.GetCurrentUserId());
                // ensure requester is in a role higher than Inspector level
                if (await userManager.IsInRoleAsync(currentUser, RoleNames.Inspector))
                {
                    throw new RestException(HttpStatusCode.Forbidden, new { Forbidden = "Permission denied." });
                }

                var forUser = await userManager.FindByIdAsync(request.UserId);

                var result = await userService.RemoveUserFromSiteAsync(forUser, request.SiteId);
                if (result < 1) throw new Exception("Error unassigning Site from user.");
                return Unit.Value;
            }
        }
    }
}