using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using PikeSafetyWebApp.Application.Interfaces;
using PikeSafetyWebApp.Data;
using PikeSafetyWebApp.Models;

namespace PikeSafetyWebApp.Application.Reports
{
    public class List
    {
        public class Query : IRequest<List<ReportDto>> { }

        public class Handler : IRequestHandler<Query, List<ReportDto>>
        {
            private readonly PikeSafetyDbContext context;
            private readonly UserManager<AppUser> userManager;
            private readonly IUserAccessor userAccessor;
            private readonly IModelConverters modelConverters;
            private readonly RoleManager<AppRole> roleManager;

            public Handler(PikeSafetyDbContext context, UserManager<AppUser> userManager, RoleManager<AppRole> roleManager, IUserAccessor userAccessor, IModelConverters modelConverters)
            {
                this.roleManager = roleManager;
                this.modelConverters = modelConverters;
                this.userAccessor = userAccessor;
                this.userManager = userManager;
                this.context = context;
            }

            public async Task<List<ReportDto>> Handle(Query request, CancellationToken cancellationToken)
            {
                var roles = await context.Roles.ToListAsync(); //needed for nested data relationships, still faster than lazy loading.
                var currentUser = await context.Users.Where(x => x.Id == userAccessor.GetCurrentUserId()).Include(x => x.UserRoles).FirstOrDefaultAsync();
                var userRole = currentUser.UserRoles.First().Role.Name;
                var recordsForRole = new Dictionary<string, Func<Task<List<Report>>>>();
                recordsForRole[PikeSafetyWebApp.Models.RoleNames.Admin] = async () => { return await context.Reports.ToListAsync(); };
                recordsForRole[PikeSafetyWebApp.Models.RoleNames.Inspector] = async () => { return await context.Reports.Where(x => x.CreatedBy == currentUser.Id).ToListAsync(); };
                recordsForRole[PikeSafetyWebApp.Models.RoleNames.AreaManager] = async () => { return await context.Reports.Where(x => x.CompanyId == currentUser.CompanyId).ToListAsync(); };
                recordsForRole[PikeSafetyWebApp.Models.RoleNames.ConstructionSupervisor] = async () => { return await context.Reports.Where(x => x.CompanyId == currentUser.CompanyId).ToListAsync(); };
                recordsForRole[PikeSafetyWebApp.Models.RoleNames.Executive] = async () => { return await context.Reports.Where(x => x.CompanyId == currentUser.CompanyId).ToListAsync(); };

                List<Report> records = await recordsForRole[userRole]?.Invoke();

                return Reduce(records);
            }

            private List<ReportDto> Reduce(List<Report> records)
            {
                return records.ConvertAll(new Converter<Report, ReportDto>(modelConverters.ReportToReportDto));
            }
        }
    }
}