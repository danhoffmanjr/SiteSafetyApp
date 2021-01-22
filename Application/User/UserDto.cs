using System.Text.Json.Serialization;
using PikeSafetyWebApp.Application.Interfaces;
using PikeSafetyWebApp.Application.Roles;
using PikeSafetyWebApp.Models;

namespace PikeSafetyWebApp.Application.User
{
    public class UserDto
    {
        public UserDto(AppUser user, RoleDto role, ITokenGenerator tokenGenerator, string refreshToken)
        {
            Id = user.Id;
            FirstName = user.FirstName;
            LastName = user.LastName;
            Email = user.Email;
            Token = tokenGenerator.CreateToken(user);
            Role = role;
            RefreshToken = refreshToken;
        }

        public string Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Token { get; set; }
        public RoleDto Role { get; set; }

        [JsonIgnore]
        public string RefreshToken { get; set; }
    }
}