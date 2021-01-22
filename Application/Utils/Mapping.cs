using System.Linq;
using AutoMapper;
using PikeSafetyWebApp.Application.Sites;
using PikeSafetyWebApp.Models;

namespace PikeSafetyWebApp.Application.Utils
{
    public class Mapping : Profile
    {
        public Mapping()
        {
            CreateMap<AppUser, PikeSafetyWebApp.Application.User.Profile>();
            CreateMap<Site, SiteDto>().ForMember(d => d.Users, opt => opt.MapFrom(s => s.UserSites.Select(x => x.User)));
        }
    }
}