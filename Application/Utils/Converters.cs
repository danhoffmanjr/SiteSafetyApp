using Microsoft.AspNetCore.Identity;
using PikeSafetyWebApp.Application.Interfaces;
using PikeSafetyWebApp.Application.Sites;
using PikeSafetyWebApp.Application.User;
using PikeSafetyWebApp.Models;

namespace PikeSafetyWebApp.Application.Utils
{
    public static class Converters
    {
        public static SiteDto SiteToDto(Site site)
        {
            return new SiteDto(site);
        }
    }
}