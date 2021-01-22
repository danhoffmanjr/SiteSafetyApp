using System;
using System.Net;
using System.Security.Claims;
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
using PikeSafetyWebApp.Application.Validators;
using PikeSafetyWebApp.Data;
using PikeSafetyWebApp.Models;

namespace PikeSafetyWebApp.Application.User
{
    public class Register
    {
        public class Command : IRequest
        {
            public string FirstName { get; set; }
            public string LastName { get; set; }
            public string Email { get; set; }
            public string Password { get; set; }
            public string ConfirmPassword { get; set; }
            public string Origin { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.FirstName).NotEmpty();
                RuleFor(x => x.LastName).NotEmpty();
                RuleFor(x => x.Email).NotEmpty().EmailAddress();
                RuleFor(x => x.Password).NotEmpty().Password();
                RuleFor(x => x.ConfirmPassword).NotEmpty().Password().Equal(x => x.Password).WithMessage("Password and Confirmation Password do not match.");
            }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly PikeSafetyDbContext context;
            private readonly UserManager<AppUser> userManager;
            private readonly ILogger<Register> logger;
            private readonly IEmailService emailService;
            public Handler(PikeSafetyDbContext context, UserManager<AppUser> userManager, IEmailService emailService, ILogger<Register> logger)
            {
                this.emailService = emailService;
                this.logger = logger;
                this.userManager = userManager;
                this.context = context;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                if (await context.Users.AnyAsync(x => x.Email == request.Email))
                {
                    throw new RestException(HttpStatusCode.BadRequest, new { Email = "Email already exists." });
                }

                var user = new AppUser
                {
                    UserName = request.Email,
                    Email = request.Email,
                    FirstName = request.FirstName,
                    LastName = request.LastName
                };

                var result = await userManager.CreateAsync(user, request.Password);

                if (!result.Succeeded) throw new Exception("Error creating User during Registration.");

                logger.LogInformation($"{user.FullName} created a new account with password.");
                var newUser = await userManager.FindByEmailAsync(user.Email);

                // Default User Claims Setup
                var registrationDateClaim = new Claim("RegistrationDate", DateTime.UtcNow.ToShortDateString());
                await userManager.AddClaimAsync(user, registrationDateClaim);

                await userManager.AddToRoleAsync(newUser, RoleNames.Inspector);

                var emailToken = await userManager.GenerateEmailConfirmationTokenAsync(user);
                emailToken = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(emailToken));

                var verifyUrl = $"{request.Origin}/users/verifyEmail?token={emailToken}&email={request.Email}";

                var emailBody = $"<h3>VERIFY EMAIL</h3><p>Thanks for registering!<p><br /><p>Please click the below link to verify your email address:</p><p><a href='{verifyUrl}'>{verifyUrl}</a></p>";

                await emailService.SendAsync(request.Email, "Confirm your email", emailBody, true);

                return Unit.Value;
            }
        }
    }
}