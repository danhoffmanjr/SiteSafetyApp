using System.Threading.Tasks;
using PikeSafetyWebApp.Application.ReportTypes;
using PikeSafetyWebApp.Application.Reports;
using PikeSafetyWebApp.Application.Sites;
using PikeSafetyWebApp.Application.User;
using PikeSafetyWebApp.Models;
using PikeSafetyWebApp.Application.ReportImages;

namespace PikeSafetyWebApp.Application.Interfaces
{
    public interface IModelConverters
    {
        SiteDto SiteToSiteDto(Site site);
        SiteDto SiteToSiteDtoWithProfiles(Site site);
        Profile AppUserToProfile(AppUser user);
        Profile AppUserToProfileWithSites(AppUser user);
        ReportDto ReportToReportDto(Report report);
        ReportTypeDto ReportTypeToReportTypeDto(ReportType type);
        ReportImageDto ReportImageToReportImageDto(ReportImage image);
    }
}