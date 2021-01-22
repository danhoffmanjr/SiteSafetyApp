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
using PikeSafetyWebApp.Application.Validators;
using PikeSafetyWebApp.Models;

namespace PikeSafetyWebApp.Application.User
{
    public class ResetPassword
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
            private readonly ILogger<ResetPassword> logger;
            private readonly UserManager<AppUser> userManager;
            public Handler(UserManager<AppUser> userManager, ILogger<ResetPassword> logger)
            {
                this.userManager = userManager;
                this.logger = logger;
            }

            public async Task<IdentityResult> Handle(Command request, CancellationToken cancellationToken)
            {             
                var user = await userManager.FindByEmailAsync(request.Email);
                
                var tokenBytes = WebEncoders.Base64UrlDecode(request.Token);
                var decodedToken = Encoding.UTF8.GetString(tokenBytes);

                var datetime = DateTime.UtcNow.ToString("f", CultureInfo.CreateSpecificCulture("en-US"));

                logger.LogInformation($"{user.Email} reset their password on {datetime}.");

                return await userManager.ResetPasswordAsync(user, decodedToken, request.Password);
            }
        }
    }
}