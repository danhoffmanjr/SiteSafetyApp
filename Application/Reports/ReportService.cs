using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using PikeSafetyWebApp.Application.Interfaces;
using PikeSafetyWebApp.Data;
using PikeSafetyWebApp.Models;

namespace PikeSafetyWebApp.Application.Reports
{
    public class ReportService : IReportService
    {
        private readonly PikeSafetyDbContext context;
        public ReportService(PikeSafetyDbContext context)
        {
            this.context = context;
        }
        public async Task<long> GetIdByTitleAsync(string name)
        {
            var report = await context.Reports.FirstOrDefaultAsync(x => x.Title.ToLower() == name.ToLower());
            if (report == null) throw new ArgumentNullException(nameof(report));
            return report.Id;
        }
    }
}