using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.EntityFrameworkCore;
using NETCore.MailKit.Core;
using PikeSafetyWebApp.Application.Errors;
using PikeSafetyWebApp.Application.Interfaces;
using PikeSafetyWebApp.Data;
using PikeSafetyWebApp.Models;
using static PikeSafetyWebApp.Application.User.EditUser;

namespace PikeSafetyWebApp.Application.User
{
    public class UserService : IUserService
    {
        private readonly PikeSafetyDbContext context;
        private readonly UserManager<AppUser> userManager;
        private readonly IEmailService emailService;
        public UserService(PikeSafetyDbContext context, UserManager<AppUser> userManager, IEmailService emailService)
        {
            this.emailService = emailService;
            this.userManager = userManager;
            this.context = context;
        }

        public async Task<IdentityResult> AddUserToSiteAsync(AppUser user, long siteId)
        {
            if (user is null)
            {
                throw new System.ArgumentNullException(nameof(user));
            }

            if (user.UserSites == null)
            {
                var usersites = new List<UserSite>();
                usersites.Add(new UserSite
                {
                    AppUserId = user.Id,
                    SiteId = siteId
                });

                user.UserSites = usersites;
                return await userManager.UpdateAsync(user);
            }
            else
            {
                user.UserSites.Add(new UserSite
                {
                    AppUserId = user.Id,
                    SiteId = siteId
                });

                return await userManager.UpdateAsync(user);
            }
        }

        public async Task<int> RemoveUserFromSiteAsync(AppUser user, long siteId)
        {
            if (user is null)
            {
                throw new System.ArgumentNullException(nameof(user));
            }

            var toRemove = await context.UserSites.FirstAsync((x => x.AppUserId == user.Id && x.SiteId == siteId));
            if (toRemove != null)
            {
                context.UserSites.Remove(toRemove);
                return await context.SaveChangesAsync();
            }

            return 0;
        }

        public async Task<Unit> UpdateProfileByIdAsync(Edit.Command request)
        {
            var userToUpdate = await context.Users.FindAsync(request.Id);
            var allAppRoles = await context.Roles.Include(x => x.UserRoles).ToListAsync(); //needed for nested data relationships, still faster than lazy loading.
            var userToUpdateRole = userToUpdate.UserRoles?.First().Role.Name;

            if (userToUpdate == null) throw new RestException(HttpStatusCode.NotFound, new { User = "Not Found" });
            if (
                userToUpdate.FirstName.ToLower().Trim() == request.FirstName.ToLower().Trim() &&
                userToUpdate.LastName.ToLower().Trim() == request.LastName.ToLower().Trim() &&
                userToUpdate.Email.ToLower().Trim() == request.Email.ToLower().Trim() &&
                userToUpdate.PhoneNumber?.ToLower().Trim() == request.ContactPhoneNumber?.ToLower().Trim()
                )
            {
                throw new RestException(HttpStatusCode.BadRequest, new { Data = "No Changes Found" });
            }
            if (userToUpdate.NormalizedEmail != request.Email.ToUpper() && await context.Users.AnyAsync(x => x.NormalizedEmail == request.Email.ToUpper()))
            {
                throw new RestException(HttpStatusCode.BadRequest, new { Email = "Email already exists." });
            }

            // Change email
            if (userToUpdate.NormalizedEmail != request.Email.ToUpper())
            {
                userToUpdate.Email = request.Email;
                userToUpdate.NormalizedEmail = request.Email.ToUpper();
                userToUpdate.UserName = request.Email;
                userToUpdate.NormalizedUserName = request.Email.ToUpper();
                userToUpdate.EmailConfirmed = false;
                await SendValidateNewEmailLinkAsync(userToUpdate, request.Origin);
            }

            userToUpdate.FirstName = request.FirstName ?? userToUpdate.FirstName;
            userToUpdate.LastName = request.LastName ?? userToUpdate.LastName;
            userToUpdate.PhoneNumber = request.ContactPhoneNumber ?? userToUpdate.PhoneNumber;

            var success = await context.SaveChangesAsync() > 0;

            if (success) return Unit.Value;

            throw new Exception($"Problem Updating {userToUpdate.FullName}");
        }

        public async Task<Unit> UpdateUserByIdAsync(Command request)
        {
            var userToUpdate = await context.Users.FindAsync(request.Id);
            var allAppRoles = await context.Roles.Include(x => x.UserRoles).ToListAsync(); //needed for nested data relationships, still faster than lazy loading.
            var userToUpdateRole = userToUpdate.UserRoles?.First().Role.Name;

            if (userToUpdate == null) throw new RestException(HttpStatusCode.NotFound, new { User = "Not Found" });
            if (userToUpdate.CompanyId != request.CompanyId) throw new RestException(HttpStatusCode.BadRequest, new { Company = "Company change is not currently supported" });
            if (
                userToUpdate.FirstName.ToLower().Trim() == request.FirstName.ToLower().Trim() &&
                userToUpdate.LastName.ToLower().Trim() == request.LastName.ToLower().Trim() &&
                userToUpdate.Email.ToLower().Trim() == request.Email.ToLower().Trim() &&
                userToUpdate.PhoneNumber?.ToLower().Trim() == request.ContactPhoneNumber?.ToLower().Trim() &&
                userToUpdateRole.ToLower().Trim() == request.Role.ToLower().Trim() &&
                userToUpdate.IsActive == request.IsActive
                )
            {
                throw new RestException(HttpStatusCode.BadRequest, new { Data = "No Changes Found" });
            }
            if (userToUpdate.NormalizedEmail != request.Email.ToUpper() && await context.Users.AnyAsync(x => x.NormalizedEmail == request.Email.ToUpper()))
            {
                throw new RestException(HttpStatusCode.BadRequest, new { Email = "Email already exists." });
            }

            // Change email
            if (userToUpdate.NormalizedEmail != request.Email.ToUpper())
            {
                userToUpdate.Email = request.Email;
                userToUpdate.NormalizedEmail = request.Email.ToUpper();
                userToUpdate.UserName = request.Email;
                userToUpdate.NormalizedUserName = request.Email.ToUpper();
                userToUpdate.EmailConfirmed = false;
                await SendValidateNewEmailLinkAsync(userToUpdate, request.Origin);
            }

            userToUpdate.FirstName = request.FirstName ?? userToUpdate.FirstName;
            userToUpdate.LastName = request.LastName ?? userToUpdate.LastName;
            userToUpdate.PhoneNumber = request.ContactPhoneNumber ?? userToUpdate.PhoneNumber;
            userToUpdate.IsActive = request.IsActive;

            var isRoleChange = userToUpdateRole != request.Role;
            if (isRoleChange)
            {
                var removeFromRoleResult = await userManager.RemoveFromRoleAsync(userToUpdate, userToUpdateRole);
                if (!removeFromRoleResult.Succeeded) throw new Exception($"Problem removing user from '{userToUpdateRole}' role");
                var addUserToRoleResult = await userManager.AddToRoleAsync(userToUpdate, request.Role);
                if (!addUserToRoleResult.Succeeded) throw new Exception($"Problem adding user to '{request.Role}' role");
            }

            var success = await context.SaveChangesAsync() > 0 || isRoleChange;

            if (success) return Unit.Value;

            throw new Exception($"Problem Updating {userToUpdate.FullName}");
        }

        public async Task SendValidateNewEmailLinkAsync(AppUser user, string origin)
        {
            // generate invite token
            var inviteTokenStr = await userManager.GenerateEmailConfirmationTokenAsync(user);

            // email confirmation link to user at new address
            var EncodedInviteToken = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(inviteTokenStr));
            var verifyUrl = $"{origin}/users/verifyEmailChange?token={EncodedInviteToken}&email={user.Email}";
            var emailBody = $"<h3>Pike Safety App - Email Change</h3><p>A request has been made to change the email address associated with your Pike Safety App account.<p><br />"
                            + $"<p>Please click the below link to confirm your new email:</p>"
                            + $"<p><a href='{verifyUrl}'>{verifyUrl}</a></p>"
                            + $"<p><strong>You will not be able to login to the Pike Safety App with this new email until verified via the link above.</strong></p>";
            await emailService.SendAsync(user.Email, "Pike Safety App Email Address Change", emailBody, true);
        }
    }
}