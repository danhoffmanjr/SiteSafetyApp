using System;
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
    public class Create
    {
        public class Query : IRequest<CompanyDto>
        {
            public string Name { get; set; }
        }

        public class QueryValidator : AbstractValidator<Query>
        {
            public QueryValidator()
            {
                RuleFor(x => x.Name).NotEmpty();
            }
        }

        public class Handler : IRequestHandler<Query, CompanyDto>
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

            public async Task<CompanyDto> Handle(Query request, CancellationToken cancellationToken)
            {
                var currentUser = await userManager.FindByIdAsync(userAccessor.GetCurrentUserId());
                if (await userManager.IsInRoleAsync(currentUser, RoleNames.Inspector))
                {
                    throw new RestException(HttpStatusCode.Forbidden, new { Forbidden = "Permission Denied." });
                }
                var doesExist = companyService.CheckExistsByName(request.Name);
                if (doesExist) throw new RestException(HttpStatusCode.BadRequest, new { Name = "Company name already exists." });

                var newCompany = new Company
                {
                    Name = request.Name,
                    CreatedOn = DateTime.UtcNow,
                    CreatedBy = currentUser.FullName,
                    UpdatedOn = null,
                    UpdatedBy = null,
                    IsActive = true
                };

                var succeeded = await companyService.AddAsync(newCompany);
                if (!succeeded) throw new Exception("Error Saving New Company.");

                var company = await companyService.FindByNameAsync(newCompany.Name);

                return new CompanyDto(company);
            }
        }
    }
}