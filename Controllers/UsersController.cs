using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using PikeSafetyWebApp.Data;
using PikeSafetyWebApp.Models;
using Microsoft.AspNetCore.Identity;
using PikeSafetyWebApp.Application.User;
using Microsoft.AspNetCore.Authorization;
using MediatR;
using Microsoft.AspNetCore.Http;
using System;
using PikeSafetyWebApp.Application.Roles;

namespace PikeSafetyWebApp.Controllers
{
    public class UsersController : BaseController
    {
        private readonly PikeSafetyDbContext _context;
        private readonly UserManager<AppUser> _userManager;
        private readonly RoleManager<AppRole> _roleManager;

        public UsersController(PikeSafetyDbContext context, UserManager<AppUser> userManager, RoleManager<AppRole> roleManager)
        {
            _roleManager = roleManager;
            _userManager = userManager;
            _context = context;
        }

        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(Login.Query query)
        {
            var user = await Mediator.Send(query);
            SetTokenCookie(user?.RefreshToken ?? "");
            return user;
        }

        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<ActionResult> Register(Register.Command command)
        {
            command.Origin = Request.Headers["origin"];
            await Mediator.Send(command);
            return Ok("Registration Successful - please check your email to confirm your email address.");
        }

        [HttpPost("sendInvite")]
        public async Task<ActionResult> Invite(InviteUser.Command command)
        {
            command.Origin = Request.Headers["origin"];
            await Mediator.Send(command);
            return Ok($"An invite has been successfully sent to {command.Email}");
        }

        [AllowAnonymous]
        [HttpPost("verifyInvite")]
        public async Task<ActionResult> VerifyEmail(ConfirmInvite.Command command)
        {
            var results = await Mediator.Send(command);
            if (!results.Succeeded) return BadRequest("Problem verifying user invitation.");
            return Ok("User invite confirmed - you can now login.");
        }

        [HttpGet("current")]
        public async Task<ActionResult<UserDto>> CurrentUser()
        {
            var user = await Mediator.Send(new CurrentUser.Query());
            SetTokenCookie(user?.RefreshToken ?? "");
            return user;
        }

        [HttpGet]
        public async Task<ActionResult<List<Profile>>> List()
        {
            return await Mediator.Send(new PikeSafetyWebApp.Application.User.List.Query());
        }

        [HttpGet("{username}")]
        public async Task<ActionResult<Profile>> Profile(string username)
        {
            return await Mediator.Send(new ProfileDetails.Query { Username = username });
        }

        [HttpGet("roles")]
        public async Task<ActionResult<List<RoleDto>>> GetRoles()
        {
            return await Mediator.Send(new PikeSafetyWebApp.Application.Roles.List.Query());
        }

        [HttpPut]
        public async Task<ActionResult<Unit>> Edit(Edit.Command command)
        {
            command.Origin = Request.Headers["origin"];
            return await Mediator.Send(command);
        }

        [HttpPut("manage/update")]
        public async Task<ActionResult<Unit>> EditUser(EditUser.Command command)
        {
            command.Origin = Request.Headers["origin"];
            return await Mediator.Send(command);
        }

        [AllowAnonymous]
        [HttpPost("verifyEmail")]
        public async Task<ActionResult> VerifyEmail(ConfirmEmail.Command command)
        {
            var results = await Mediator.Send(command);
            if (!results.Succeeded) return BadRequest("Problem verifying email address.");
            return Ok("Email address confirmed - you can now login.");
        }

        [AllowAnonymous]
        [HttpGet("resendEmailVerification")]
        public async Task<ActionResult> ResendEmailVerification([FromQuery] ConfirmEmailResend.Query query)
        {
            query.Origin = Request.Headers["origin"];
            await Mediator.Send(query);

            return Ok("Email verification link sent - please check your email.");
        }

        [AllowAnonymous]
        [HttpPost("forgotPassword")]
        public async Task<ActionResult> ForgotPassword(ForgotPassword.Command command)
        {
            command.Origin = Request.Headers["origin"];
            await Mediator.Send(command);
            return Ok($"Password reset link sent to {command.Email} - please check your email.");
        }

        [AllowAnonymous]
        [HttpPost("resetPassword")]
        public async Task<ActionResult> ResetPassword(ResetPassword.Command command)
        {
            var results = await Mediator.Send(command);
            if (!results.Succeeded) return BadRequest("Problem resetting password.");
            return Ok($"Your password has been reset - you can now login.");
        }

        [AllowAnonymous]
        [HttpPost("invite/createPassword")]
        public async Task<ActionResult> CreatePassword(CreatePassword.Command command)
        {
            var results = await Mediator.Send(command);
            if (!results.Succeeded) return BadRequest("Problem creating password.");
            return Ok($"Your password has been set - you can now login.");
        }

        [HttpPost("refreshToken")]
        public async Task<ActionResult<UserDto>> RefreshToken(Application.User.RefreshToken.Command command)
        {
            command.RefreshToken = Request.Cookies["refreshToken"];
            var user = await Mediator.Send(command);
            SetTokenCookie(user?.RefreshToken ?? "");
            return user;
        }

        private void SetTokenCookie(string refreshToken)
        {
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                SameSite = SameSiteMode.Strict,
                Expires = DateTime.UtcNow.AddDays(7)
            };

            Response.Cookies.Append("refreshToken", refreshToken, cookieOptions);
        }
    }
}
