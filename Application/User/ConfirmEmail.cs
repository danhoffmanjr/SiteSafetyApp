using System.Text;
using System.Threading;
using System.Threading.Tasks;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.WebUtilities;
using PikeSafetyWebApp.Models;

namespace PikeSafetyWebApp.Application.User
{
    public class ConfirmEmail
    {
        public class Command : IRequest<IdentityResult>
        {
            public string Token { get; set; }
            public string Email { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.Token).NotEmpty();
                RuleFor(x => x.Email).NotEmpty();
            }
        }

        public class Handler : IRequestHandler<Command, IdentityResult>
        {
            private readonly UserManager<AppUser> userManager;
            public Handler(UserManager<AppUser> userManager)
            {
                this.userManager = userManager;
            }

            public async Task<IdentityResult> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await userManager.FindByEmailAsync(request.Email);
                var tokenBytes = WebEncoders.Base64UrlDecode(request.Token);
                var decodedToken = Encoding.UTF8.GetString(tokenBytes);

                return await userManager.ConfirmEmailAsync(user, decodedToken);
            }
        }
    }
}