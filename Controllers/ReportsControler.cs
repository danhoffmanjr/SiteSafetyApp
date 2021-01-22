using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using PikeSafetyWebApp.Data;
using PikeSafetyWebApp.Models;
using PikeSafetyWebApp.DTO;
using System.Net.Http;
using System.Net;
using System.Web;
using Microsoft.AspNetCore.Authorization;
using PikeSafetyWebApp.Application.Reports;

namespace PikeSafetyWebApp.Controllers
{
    public class ReportsController : BaseController
    {
        [HttpGet]
        public async Task<ActionResult<List<ReportDto>>> List()
        {
            return await Mediator.Send(new List.Query());
        }

        // GET: api/Reports
        // [HttpGet]
        // public List<ReportListDTO> GetReportsAsync()
        // {
        //     var cs = _context.ReportSiteMappings.Include(x => x.Report).Include(x => x.Site).ToList();

        //     List<ReportListDTO> returnObj = new List<ReportListDTO>();

        //     foreach (var c in cs)
        //     {
        //         var reportSite = _context.ReportSiteMappings.Where(x => x.ReportId == c.ReportId).Select(x => x.SiteId).FirstOrDefault();
        //         var userID = _context.SiteUserMappings.Where(x => x.SiteId == reportSite).Select(x => x.AppUserId).FirstOrDefault();
        //         var user = _context.Users.Where(x => x.Id == userID).Select(x => x.UserName).FirstOrDefault();


        //         ReportListDTO obj = new ReportListDTO();
        //         obj.ReportId = c.Report.Id;
        //         obj.Company = c.Site.Name;
        //         obj.FormType = c.Report.FormType;
        //         obj.Sites = c.Report.LotNumber;
        //         obj.ViolationType = c.Report.ViolationType;
        //         obj.SubmittedBy = user;
        //         obj.SubContractor = c.Report.SubcontractorCompany;
        //         obj.CreatedOn = c.Report.CreatedAt;

        //         returnObj.Add(obj);
        //     }

        //     return returnObj;
        // }

        // // GET api/values/5
        // [HttpGet("{id}")]
        // public ReportDetailDTO Get(int id)
        // {
        //     var cs = _context.ReportSiteMappings.Include(x => x.Report).Include(x => x.Site).Where(x => x.Report.Id == id).FirstOrDefault();
        //     var reportSite = _context.ReportSiteMappings.Where(x => x.ReportId == id).Select(x => x.SiteId).FirstOrDefault();
        //     var reportCompany = _context.CompanySites.Where(x => x.SiteId == reportSite).Select(x => x.CompanyId).FirstOrDefault();
        //     var userID = _context.SiteUserMappings.Where(x => x.SiteId == reportSite).Select(x => x.AppUserId).FirstOrDefault();
        //     var user = _context.Users.Where(x => x.Id == userID).Select(x => x.UserName).FirstOrDefault();


        //     ReportDetailDTO obj = new ReportDetailDTO();
        //     obj.ReportId = cs.Report.Id;
        //     obj.Company = reportCompany;
        //     obj.FormType = cs.Report.FormType;
        //     obj.Site = reportSite;
        //     obj.LotNumber = cs.Report.LotNumber;
        //     obj.ViolationType = cs.Report.ViolationType;
        //     obj.SubmittedBy = user;
        //     obj.Narrative = cs.Report.Narrative;
        //     obj.CreatedAt = cs.Report.CreatedAt;
        //     obj.UpdatedAt = cs.Report.UpdatedAt;
        //     obj.SubcontractorCompany = cs.Report.SubcontractorCompany;
        //     obj.SubcontractorRepresentive = cs.Report.SubcontractorRepresentive;
        //     obj.CorrectiveActionTaken = cs.Report.CorrectiveActionTaken;
        //     obj.SiteAddress = cs.Site.Address;
        //     obj.Companies = GetCompanies();
        //     obj.Sites = GetSites(reportCompany);
        //     return obj;
        // }

        // // POST api/values
        // [HttpPost]
        // public string Post([FromBody] ReportDetailDTO report)
        // {
        //     if (!ModelState.IsValid)
        //     {
        //         string error = "Please try Again.";
        //         return error;
        //     }

        //     if (report.ReportId == 0)
        //     {

        //         var update = new Reports()
        //         {

        //             FormType = report.FormType,
        //             CreatedAt = DateTime.Now,
        //             UpdatedAt = DateTime.Now,
        //             LotNumber = report.LotNumber,
        //             SubcontractorCompany = report.SubcontractorCompany,
        //             SubcontractorRepresentive = report.SubcontractorRepresentive,
        //             ViolationType = report.ViolationType,
        //             CorrectiveActionTaken = report.CorrectiveActionTaken,
        //             Narrative = report.Narrative,
        //             //ReportSiteMappings = siteMapping,
        //             //ReportUserMappings = userMapping
        //         };
        //         _context.Reports.Add(update);
        //         _context.SaveChanges();

        //         var reportSite = new ReportSiteMappings()
        //         {
        //             ReportId = update.Id,
        //             SiteId = report.Site,
        //             CreatedAt = DateTime.Now,
        //             UpdatedAt = DateTime.Now
        //         };

        //         _context.ReportSiteMappings.Add(reportSite);
        //         _context.SaveChanges();
        //     }
        //     else
        //     {

        //         var siteMapping = _context.ReportSiteMappings.Where(x => x.ReportId == report.ReportId).FirstOrDefault();
        //         var userMapping = _context.ReportUserMappings.Where(x => x.ReportId == report.ReportId).FirstOrDefault();

        //         var reportUpdate = new Reports()
        //         {
        //             Id = report.ReportId,
        //             FormType = report.FormType,
        //             CreatedAt = report.CreatedAt,
        //             UpdatedAt = DateTime.Now,
        //             LotNumber = report.LotNumber,
        //             SubcontractorCompany = report.SubcontractorCompany,
        //             SubcontractorRepresentive = report.SubcontractorRepresentive,
        //             ViolationType = report.ViolationType,
        //             CorrectiveActionTaken = report.CorrectiveActionTaken,
        //             Narrative = report.Narrative,
        //             ReportSiteMappings = siteMapping,
        //             ReportUserMappings = userMapping
        //         };


        //         _context.Update(reportUpdate);

        //     }

        //     //_context.Reports.Add(new Reports()
        //     // {
        //     //     FormType = report.FormType,
        //     //     CreatedAt = DateTime.Now,
        //     //     UpdatedAt = DateTime.Now,
        //     //     LotNumber = report.LotNumber,
        //     //     SubcontractorCompany = report.SubcontractorCompany,
        //     //     SubcontractorRepresentive = report.SubcontractorRepresentive,
        //     //     ViolationType = report.ViolationType,
        //     //     CorrectiveActionTaken = report.CorrectiveActionTaken,
        //     //     Narrative = report.Narrative,
        //     // });

        //     _context.SaveChanges();
        //     return "Report Added!";
        // }

        // // PUT api/values/5
        // [HttpPut("{id}")]
        // public void Put(int id, [FromBody] string value)
        // {
        // }

        // // DELETE api/values/5
        // [HttpDelete("{id}")]
        // public string Delete(int id)
        // {
        //     if (id <= 0)
        //     {
        //         return "Report Cannot Be Deleted. Please try again.";
        //     }

        //     _context.Remove(_context.Reports.Single(x => x.Id == id));
        //     _context.SaveChanges();

        //     return "Report Id: " + id + " has been deleted.";
        // }

        // [Route("getSites/{companyId}")]
        // [HttpGet]
        // public List<DropDownDTO> GetSites(long? companyId)
        // {
        //     var companySites = _context.CompanySites.Where(x => x.CompanyId == companyId).ToList();

        //     List<DropDownDTO> dd = new List<DropDownDTO>();

        //     foreach (var c in companySites)
        //     {
        //         var newItem = _context.Sites.Where(x => x.Id == c.SiteId).Select(x => new DropDownDTO { Id = x.Id.ToString(), Name = x.Name }).FirstOrDefault();
        //         dd.Add(newItem);
        //     }

        //     return dd;


        // }

        // [Route("getCompanies")]
        // [HttpGet]
        // public List<DropDownDTO> GetCompanies()
        // {
        //     return _context.Companies.Select(x => new DropDownDTO { Id = x.Id.ToString(), Name = x.Name }).ToList();
        // }

        // [Route("getUsers")]
        // [HttpGet]
        // public async Task<List<DropDownDTO>> getUsers()
        // {
        //     return await _context.Users.Select(x => new DropDownDTO { Id = x.Id, Name = x.UserName }).ToListAsync();
        // }

        // [Route("SiteAddress/{siteId}")]
        // [HttpGet]
        // public async Task<string> GetSiteAddress(int siteId)
        // {
        //     return await _context.Sites.Where(x => x.Id == siteId).Select(x => x.Address).FirstOrDefaultAsync();
        // }
    }
}
