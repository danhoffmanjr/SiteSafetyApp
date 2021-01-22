using System.Net;
using System.Threading;
using System.Threading.Tasks;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Identity;
using PikeSafetyWebApp.Application.Errors;
using PikeSafetyWebApp.Application.Interfaces;
using PikeSafetyWebApp.Models;

namespace PikeSafetyWebApp.Application.User
{
    public class EditUser
    {
        public class Command : IRequest
        {
            public string Id { get; set; }
            public string FirstName { get; set; }
            public string LastName { get; set; }
            public string Email { get; set; }
            public string Role { get; set; }
            public string ContactPhoneNumber { get; set; }
            public long CompanyId { get; set; }
            public bool IsActive { get; set; }
            public string Origin { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.Id).NotEmpty();
                RuleFor(x => x.FirstName).NotEmpty();
                RuleFor(x => x.LastName).NotEmpty();
                RuleFor(x => x.Email).NotEmpty();
                RuleFor(x => x.Role).NotEmpty();
                RuleFor(x => x.IsActive).NotNull();
                RuleFor(x => x.CompanyId).NotEmpty();
            }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly UserManager<AppUser> userManager;
            private readonly IUserAccessor userAccessor;
            private readonly IUserService userService;
            public Handler(UserManager<AppUser> userManager, IUserAccessor userAccessor, IUserService userService)
            {
                this.userService = userService;
                this.userAccessor = userAccessor;
                this.userManager = userManager;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                var currentUser = await userManager.FindByIdAsync(userAccessor.GetCurrentUserId());
                var isAdmin = await userManager.IsInRoleAsync(currentUser, RoleNames.Admin);
                var userCompanyId = currentUser.CompanyId;

                if (await userManager.IsInRoleAsync(currentUser, RoleNames.Inspector)) throw new RestException(HttpStatusCode.Forbidden, new { Forbidden = "Permission Denied." });

                if (!isAdmin)
                {
                    if (request.CompanyId != userCompanyId)
                    {
                        throw new RestException(HttpStatusCode.Forbidden, new { Forbidden = "Permission Denied." });
                    }
                }

                return await userService.UpdateUserByIdAsync(request);
            }
        }
    }
}