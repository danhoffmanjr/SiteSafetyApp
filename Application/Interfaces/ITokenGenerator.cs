using PikeSafetyWebApp.Models;

namespace PikeSafetyWebApp.Application.Interfaces
{
    public interface ITokenGenerator
    {
        string CreateToken(AppUser user);
    }
}