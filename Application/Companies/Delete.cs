using System.Net;
using System.Threading;
using System.Threading.Tasks;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Identity;
using PikeSafetyWebApp.Application.Errors;
using PikeSafetyWebApp.Application.Interfaces;
using PikeSafetyWebApp.Models;

namespace PikeSafetyWebApp.Application.Companies
{
    public class Delete
    {
        public class Command : IRequest
        {
            public long Id { get; set; }
        }

        public class QueryValidator : AbstractValidator<Command>
        {
            public QueryValidator()
            {
                RuleFor(x => x.Id).NotEmpty();
            }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly UserManager<AppUser> userManager;
            private readonly IUserAccessor userAccessor;
            private readonly ICompanyService companyService;
            public Handler(UserManager<AppUser> userManager, IUserAccessor userAccessor, ICompanyService companyService)
            {
                this.companyService = companyService;
                this.userAccessor = userAccessor;
                this.userManager = userManager;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                var currentUser = await userManager.FindByIdAsync(userAccessor.GetCurrentUserId());
                if (await userManager.IsInRoleAsync(currentUser, RoleNames.Inspector))
                {
                    throw new RestException(HttpStatusCode.Forbidden, new { Forbidden = "Permission Denied." });
                }

                return await companyService.DeleteAsync(request.Id);
            }
        }
    }
}