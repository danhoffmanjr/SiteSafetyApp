using System.Net;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using NETCore.MailKit.Core;
using PikeSafetyWebApp.Application.Errors;
using PikeSafetyWebApp.Data;
using PikeSafetyWebApp.Models;

namespace PikeSafetyWebApp.Application.User
{
    public class ForgotPassword
    {
        public class Command : IRequest
        {
            public string Email { get; set; }
            public string Origin { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.Email).NotEmpty().EmailAddress();
            }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly ILogger<ForgotPassword> logger;
            private readonly IEmailService emailService;
            private readonly UserManager<AppUser> userManager;
            private readonly PikeSafetyDbContext context;
            public Handler(PikeSafetyDbContext context, UserManager<AppUser> userManager, IEmailService emailService, ILogger<ForgotPassword> logger)
            {
                this.context = context;
                this.userManager = userManager;
                this.emailService = emailService;
                this.logger = logger;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                logger.LogInformation($"{request.Email} requested a password reset link.");
                
                var user = await userManager.FindByEmailAsync(request.Email);
                if (user == null)
                {
                    // If no user exists for the provided email, we send the user to the confirmation page anyway for security reasons.
                    return Unit.Value;
                }

                var passwordToken = await userManager.GeneratePasswordResetTokenAsync(user);
                passwordToken = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(passwordToken));

                var resetUrl = $"{request.Origin}/users/resetPassword?token={passwordToken}&email={request.Email}";

                var emailBody = $"<h3>Password Reset Request</h3><p>Please click the below link to update your account password:</p><p><a href='{resetUrl}'>{resetUrl}</a></p>";

                await emailService.SendAsync(request.Email, "Password Reset", emailBody, true);

                return Unit.Value;
            }
        }
    }
}