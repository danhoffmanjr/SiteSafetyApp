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
    public class Login
    {
        public class Query : IRequest<UserDto>
        {
            public string Email { get; set; }
            public string Password { get; set; }
        }

        public class QueryValidator : AbstractValidator<Query>
        {
            public QueryValidator()
            {
                RuleFor(x => x.Email).NotEmpty();
                RuleFor(x => x.Password).NotEmpty();
            }
        }

        public class Handler : IRequestHandler<Query, UserDto>
        {
            private readonly UserManager<AppUser> userManager;
            private readonly SignInManager<AppUser> signInManager;
            private readonly ITokenGenerator tokenGenerator;
            private readonly IRoleAccessor roleAccessor;
            public Handler(UserManager<AppUser> userManager, IRoleAccessor roleAccessor, SignInManager<AppUser> signInManager, ITokenGenerator tokenGenerator)
            {
                this.roleAccessor = roleAccessor;
                this.tokenGenerator = tokenGenerator;
                this.signInManager = signInManager;
                this.userManager = userManager;
            }

            public async Task<UserDto> Handle(Query request, CancellationToken cancellationToken)
            {
                var user = await userManager.FindByEmailAsync(request.Email);
                if (user == null) throw new RestException(HttpStatusCode.NotFound, new { error = "User not found. Check email address and try again." });
                if (!user.EmailConfirmed) throw new RestException(HttpStatusCode.BadRequest, new { email = "Email is not confirmed." });

                var result = await signInManager.CheckPasswordSignInAsync(user, request.Password, false);

                if (result.Succeeded)
                {
                    var role = await roleAccessor.GetUserRoleAsync(user);

                    var refreshToken = await userManager.GenerateUserTokenAsync(user, TokenOptions.DefaultProvider, "RefreshToken");

                    return new UserDto(user, role, tokenGenerator, refreshToken);
                }

                throw new RestException(HttpStatusCode.Unauthorized, new { error = "Email or password is invalid." });
            }
        }
    }
}