using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using Microsoft.AspNetCore.Identity;
using PikeSafetyWebApp.Application.ReportImages;
using PikeSafetyWebApp.Application.ReportTypes;
using PikeSafetyWebApp.Application.Interfaces;
using PikeSafetyWebApp.Application.Reports;
using PikeSafetyWebApp.Application.Sites;
using PikeSafetyWebApp.Application.User;
using PikeSafetyWebApp.Models;
using System.Text.Json.Serialization;
using Newtonsoft.Json;

namespace PikeSafetyWebApp.Application.Utils
{
    public class ModelConverters : IModelConverters
    {
        private readonly UserManager<AppUser> userManager;
        private readonly ICompanyService companyService;
        private readonly ISiteService siteService;
        public ModelConverters(UserManager<AppUser> userManager, ICompanyService companyService, ISiteService siteService)
        {
            this.siteService = siteService;
            this.companyService = companyService;
            this.userManager = userManager;
        }

        public SiteDto SiteToSiteDtoWithProfiles(Site site)
        {
            var profiles = new List<Profile>();
            var appUsers = new List<AppUser>();

            if (site.UserSites?.Count > 0)
            {
                appUsers = site.UserSites.Select(x => x.User).ToList();
                profiles = appUsers.ConvertAll(new Converter<AppUser, Profile>(AppUserToProfile));
            }

            return new SiteDto
            {
                Id = site.Id,
                CompanyId = site.CompanyId,
                CompanyName = site.CompanyName ?? companyService.GetCompanyNameByIdAsync(site.CompanyId).Result,
                Name = site.Name,
                Address = site.Address,
                Notes = site.Notes,
                Users = profiles,
                Reports = site.Reports?.ToList().ConvertAll(new Converter<Report, ReportDto>(ReportToReportDto))
            };
        }

        public SiteDto SiteToSiteDto(Site site)
        {
            return new SiteDto
            {
                Id = site.Id,
                CompanyId = site.CompanyId,
                CompanyName = site.CompanyName ?? companyService.GetCompanyNameByIdAsync(site.CompanyId).Result,
                Name = site.Name,
                Address = site.Address,
                Notes = site.Notes
            };
        }

        public Profile AppUserToProfileWithSites(AppUser user)
        {
            var sites = new List<Site>();
            var siteDtos = new List<SiteDto>();

            if (user.UserSites?.Count > 0)
            {
                sites = user.UserSites.Select(x => x.Site).ToList();
                siteDtos = sites.ConvertAll(new Converter<Site, SiteDto>(SiteToSiteDto));
            }

            var role = userManager.GetRolesAsync(user).Result.First();

            return new Profile
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                FullName = user.FullName,
                Email = user.Email,
                ContactPhoneNumber = user.PhoneNumber,
                CompanyName = companyService.GetCompanyNameByIdAsync(user.CompanyId).Result,
                CompanyId = user.CompanyId,
                Role = role,
                IsActive = user.IsActive,
                Sites = siteDtos,
                Reports = user.Reports?.ToList().ConvertAll(new Converter<Report, ReportDto>(ReportToReportDto)) ?? null
            };
        }

        public Profile AppUserToProfile(AppUser user)
        {
            var role = userManager.GetRolesAsync(user).Result.First();

            return new Profile
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                FullName = user.FullName,
                Email = user.Email,
                ContactPhoneNumber = user.PhoneNumber,
                CompanyName = companyService.GetCompanyNameByIdAsync(user.CompanyId).Result,
                CompanyId = user.CompanyId,
                Role = role,
                IsActive = user.IsActive
            };
        }

        public ReportDto ReportToReportDto(Report report)
        {
            var fields = JsonConvert.DeserializeObject<List<ReportField>>(report.ReportFields);

            var reportDto = new ReportDto
            {
                Id = report.Id,
                Title = report.Title,
                ReportTypeId = report.ReportTypeId,
                ReportType = report.ReportType,
                ReportFields = fields,
                CompletionPercentage = report.CompletionPercentage,
                CompanyId = report.CompanyId,
                CompanyName = report.CompanyName,
                SiteId = report.SiteId,
                SiteName = report.SiteName,
                CreatedBy = report.CreatedBy,
                CreatedOn = report.CreatedOn,
                UpdatedBy = report.UpdatedBy,
                UpdatedOn = report.UpdatedOn,
                IsActive = report.IsActive,
                RequireImages = report.RequireImages,
                Images = report.Images?.ToList().ConvertAll(new Converter<ReportImage, ReportImageDto>(ReportImageToReportImageDto))
            };

            return reportDto;
        }

        public ReportImageDto ReportImageToReportImageDto(ReportImage image)
        {
            return new ReportImageDto
            {
                Id = image.Id,
                ReportId = image.ReportId,
                FileName = image.FileName,
                FileType = image.FileType,
                Description = image.Description,
                Size = image.Size,
                ImageDataUrl = image.ImageDataUrl
            };
        }

        public ReportTypeDto ReportTypeToReportTypeDto(ReportType type)
        {
            var fields = JsonConvert.DeserializeObject<List<ReportTypeField>>(type.Fields);
            fields.ForEach(field => field.Value = "");

            var reportTypeDto = new ReportTypeDto
            {
                Id = type.Id,
                Title = type.Title,
                Fields = fields,
                CreatedBy = type.CreatedBy,
                CreatedOn = type.CreatedOn,
                UpdatedBy = type.UpdatedBy,
                UpdatedOn = type.UpdatedOn,
                IsActive = type.IsActive,
                RequireImages = type.RequireImages
            };

            return reportTypeDto;
        }
    }
}