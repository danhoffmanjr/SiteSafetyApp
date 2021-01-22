using Microsoft.AspNetCore.Authorization;

namespace PikeSafetyWebApp.Application.Security
{
    public class CustomAuthAttributes : AuthorizeAttribute
    {
        public void AuthorizeHigherThanInspector() => Roles = PikeSafetyWebApp.Models.RoleNames.Admin;
    }
}