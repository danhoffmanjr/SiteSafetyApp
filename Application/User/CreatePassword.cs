using System;
using System.Globalization;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Extensions.Logging;
using PikeSafetyWebApp.Application.Interfaces;
using PikeSafetyWebApp.Application.Validators;
using PikeSafetyWebApp.Models;

namespace PikeSafetyWebApp.Application.User
{
    public class CreatePassword
    {
        public class Command : IRequest<IdentityResult>
        {
            public string Email { get; set; }
            public string Token { get; set; }
            public string Password { get; set; }
            public string ConfirmPassword { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.Email).NotEmpty().EmailAddress();
                RuleFor(x => x.Token).NotEmpty();
                RuleFor(x => x.Password).NotEmpty().Password();
                RuleFor(x => x.ConfirmPassword).NotEmpty().Password().Equal(x => x.Password).WithMessage("Password and Confirmation Password do not match.");
            }
        }

        public class Handler : IRequestHandler<Command, IdentityResult>
        {
            private readonly ILogger<CreatePassword> logger;
            private readonly UserManager<AppUser> userManager;
            private readonly IUserAccessor userAccessor;
            public Handler(UserManager<AppUser> userManager, IUserAccessor userAccessor, ILogger<CreatePassword> logger)
            {
                this.userAccessor = userAccessor;
                this.userManager = userManager;
                this.logger = logger;
            }

            public async Task<IdentityResult> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await userManager.FindByEmailAsync(request.Email);
                var tokenBytes = WebEncoders.Base64UrlDecode(request.Token);
                var decodedToken = Encoding.UTF8.GetString(tokenBytes);

                var confirmInviteResult = await userAccessor.ConfirmInviteAsync(user, userManager, decodedToken);
                if (!confirmInviteResult.Succeeded) throw new Exception("Error - invalid invite token.");

                var passwordToken = await userManager.GeneratePasswordResetTokenAsync(user);

                var datetime = DateTime.UtcNow.ToString("f", CultureInfo.CreateSpecificCulture("en-US"));
                logger.LogInformation($"{user.Email} created their password on {datetime}.");

                return await userManager.ResetPasswordAsync(user, passwordToken, request.Password);
            }
        }
    }
}