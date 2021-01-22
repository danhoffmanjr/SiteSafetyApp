using System.Text;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.WebUtilities;
using NETCore.MailKit.Core;
using PikeSafetyWebApp.Models;

namespace PikeSafetyWebApp.Application.User
{
    public class ConfirmEmailResend
    {
        public class Query : IRequest
        {
            public string Email { get; set; }
            public string Origin { get; set; }
        }

        public class Handler : IRequestHandler<Query>
        {
            private readonly UserManager<AppUser> userManager;
            private readonly IEmailService emailService;
            public Handler(UserManager<AppUser> userManager, IEmailService emailService)
            {
                this.emailService = emailService;
                this.userManager = userManager;
            }

            public async Task<Unit> Handle(Query request, CancellationToken cancellationToken)
            {
                var user = await userManager.FindByEmailAsync(request.Email);

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