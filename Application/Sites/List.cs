using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using PikeSafetyWebApp.Application.Interfaces;
using PikeSafetyWebApp.Application.Utils;
using PikeSafetyWebApp.Data;
using PikeSafetyWebApp.Models;

namespace PikeSafetyWebApp.Application.Sites
{
    public class List
    {
        public class Query : IRequest<List<SiteDto>> { }

        public class Handler : IRequestHandler<Query, List<SiteDto>>
        {
            private readonly PikeSafetyDbContext context;
            private readonly UserManager<AppUser> userManager;
            private readonly IUserAccessor userAccessor;
            private readonly IModelConverters modelConverters;

            public Handler(PikeSafetyDbContext context, UserManager<AppUser> userManager, IUserAccessor userAccessor, IModelConverters modelConverters)
            {
                this.modelConverters = modelConverters;
                this.userAccessor = userAccessor;
                this.userManager = userManager;
                this.context = context;
            }

            public async Task<List<SiteDto>> Handle(Query request, CancellationToken cancellationToken)
            {
                var currentUser = await userManager.FindByIdAsync(userAccessor.GetCurrentUserId());
                var isAdmin = await userManager.IsInRoleAsync(currentUser, RoleNames.Admin);

                var allUsers = context.Users.Include(x => x.UserRoles).ToList(); //needed for nested data relationships, still faster than lazy loading.
                var allAppRoles = context.Roles.Include(x => x.UserRoles).ToList(); //needed for nested data relationships, still faster than lazy loading.
                var activeSites = context.Sites.Where(x => x.IsActive == true).Include(x => x.UserSites).Include(x => x.Reports).ToList();

                if (isAdmin) return Reduce(activeSites);

                var userCompanyId = currentUser.CompanyId;
                return Reduce(activeSites.Where(x => x.Id == userCompanyId).ToList());
            }

            private List<SiteDto> Reduce(List<Site> records)
            {
                return records.ConvertAll(new Converter<Site, SiteDto>(modelConverters.SiteToSiteDtoWithProfiles));
            }
        }
    }
}

// Stopwatch stopwatch = new Stopwatch();
//                 stopwatch.Start();
//                 var siteDtos = records.ConvertAll(new Converter<Site, SiteDto>(modelConverters.SiteToSiteDto));
//                 var timeSpan = stopwatch.Elapsed;
//                 stopwatch.Stop();
//                 return siteDtos;

// Stopwatch stopwatch = new Stopwatch();
//                 stopwatch.Start();
//                 var siteDtos = new List<SiteDto>();
//                 foreach (var record in records)
//                 {
//                     siteDtos.Add(mapper.Map<Site, SiteDto>(record));
//                 }
//                 stopwatch.Stop();
//                 var timeSpan = stopwatch.Elapsed;
//                 return siteDtos;