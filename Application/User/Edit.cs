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

namespace PikeSafetyWebApp.Application.User
{
    public class Edit
    {
        public class Command : IRequest
        {
            public string Id { get; set; }
            public string FirstName { get; set; }
            public string LastName { get; set; }
            public string Email { get; set; }
            public string ContactPhoneNumber { get; set; }
            public string Origin { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.Id).NotEmpty();
                RuleFor(x => x.Email).NotEmpty().EmailAddress();
                RuleFor(x => x.FirstName).NotEmpty();
                RuleFor(x => x.LastName).NotEmpty();
            }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly PikeSafetyDbContext context;
            private readonly IUserAccessor userAccessor;
            private readonly IUserService userService;
            private readonly UserManager<AppUser> userManager;

            public Handler(PikeSafetyDbContext context, IUserAccessor userAccessor, UserManager<AppUser> userManager, IUserService userService)
            {
                this.userManager = userManager;
                this.userService = userService;
                this.context = context;
                this.userAccessor = userAccessor;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await userManager.FindByIdAsync(userAccessor.GetCurrentUserId());

                if (user == null)
                    throw new RestException(HttpStatusCode.NotFound, new { User = "Not Found" });

                return await userService.UpdateProfileByIdAsync(request);
            }
        }
    }
}