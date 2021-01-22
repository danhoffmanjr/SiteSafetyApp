using System;
using System.Collections.Generic;
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
using PikeSafetyWebApp.Application.Interfaces;
using PikeSafetyWebApp.Data;
using PikeSafetyWebApp.Models;

namespace PikeSafetyWebApp.Application.User
{
    public class InviteUser
    {
        public class Command : IRequest
        {
            public string FirstName { get; set; }
            public string LastName { get; set; }
            public string Email { get; set; }
            public long CompanyId { get; set; }
            public long? SiteId { get; set; }
            public string RoleName { get; set; }
            public string Origin { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.FirstName).NotEmpty();
                RuleFor(x => x.LastName).NotEmpty();
                RuleFor(x => x.Email).NotEmpty().EmailAddress();
                RuleFor(x => x.CompanyId).NotEmpty();
                RuleFor(x => x.RoleName).NotEmpty();
            }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly PikeSafetyDbContext context;
            private readonly UserManager<AppUser> userManager;
            private readonly ILogger<InviteUser> logger;
            private readonly IEmailService emailService;
            private readonly ITokenGenerator tokenGenerator;
            private readonly IUserAccessor userAccessor;
            private readonly IUserService userService;
            public Handler(
                PikeSafetyDbContext context,
                UserManager<AppUser> userManager,
                ITokenGenerator tokenGenerator,
                IUserAccessor userAccessor,
                IEmailService emailService,
                IUserService userService,
                ILogger<InviteUser> logger)
            {
                this.userAccessor = userAccessor;
                this.tokenGenerator = tokenGenerator;
                this.emailService = emailService;
                this.logger = logger;
                this.userManager = userManager;
                this.context = context;
                this.userService = userService;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                var currentUser = await userManager.FindByIdAsync(userAccessor.GetCurrentUserId());
                // ensure user initiating invite is in a role higher than Inspector level
                if (await userManager.IsInRoleAsync(currentUser, RoleNames.Inspector))
                {
                    throw new RestException(HttpStatusCode.Forbidden, new { Forbidden = "Permission denied." });
                }

                if (await context.Users.AnyAsync(x => x.Email == request.Email))
                {
                    throw new RestException(HttpStatusCode.BadRequest, new { Email = "Email already exists." });
                }

                var userToInvite = new AppUser
                {
                    UserName = request.Email,
                    Email = request.Email,
                    FirstName = request.FirstName,
                    LastName = request.LastName,
                    CompanyId = request.CompanyId,
                    IsActive = false
                };

                // Create the User
                var result = await userManager.CreateAsync(userToInvite, "Pa$$w0rd");

                if (!result.Succeeded) throw new Exception("Error creating User during invite registration.");

                logger.LogInformation($"An invite account was created for {userToInvite.FullName}.");

                var user = await userManager.FindByEmailAsync(userToInvite.Email);
                if (user == null) throw new Exception("Error getting new user.");

                // Add user to Site if one was selected on the invite form
                if (request.SiteId != null)
                {
                    var addToSiteResult = await userService.AddUserToSiteAsync(user, request.SiteId.GetValueOrDefault());
                    if (!addToSiteResult.Succeeded) throw new Exception("Error assigning user to site.");
                };

                // Add invite date to claims
                var inviteDateClaim = new Claim("InviteDate", DateTime.UtcNow.ToShortDateString());
                await userManager.AddClaimAsync(user, inviteDateClaim);

                // add to role
                await userManager.AddToRoleAsync(user, request.RoleName);

                // generate invite token
                var inviteTokenStr = await userManager.GenerateUserTokenAsync(user, TokenOptions.DefaultProvider, "InviteConfirmation");

                // email invite with confirmation link to user
                var EncodedInviteToken = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(inviteTokenStr));
                var verifyUrl = $"{request.Origin}/users/verifyInvite?token={EncodedInviteToken}&email={request.Email}";
                var emailBody = $"<h3>Pike Safety App User Invitation</h3><p>You have been invited to sign up for the Pike Saftey App!<p><br /><p>Please click the below link to confirm your email and invitation code:</p><p><a href='{verifyUrl}'>{verifyUrl}</a></p>";
                await emailService.SendAsync(request.Email, "Pike Safety App Invite Confirmation", emailBody, true);

                return Unit.Value;
            }
        }
    }
}