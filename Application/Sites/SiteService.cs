using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using MediatR;
using Microsoft.EntityFrameworkCore;
using PikeSafetyWebApp.Application.Errors;
using PikeSafetyWebApp.Application.Interfaces;
using PikeSafetyWebApp.Data;
using PikeSafetyWebApp.Models;
using static PikeSafetyWebApp.Application.Sites.Edit;

namespace PikeSafetyWebApp.Application.Sites
{
    public class SiteService : ISiteService
    {
        private readonly PikeSafetyDbContext context;
        public SiteService(PikeSafetyDbContext context)
        {
            this.context = context;
        }

        public async Task<bool> AddAsync(Site site)
        {
            context.Sites.Add(site);
            return await context.SaveChangesAsync() > 0;
        }

        public bool CheckExistsByName(string name)
        {
            ICollection<string> siteNames = context.Sites.Select(x => x.Name.ToLower()).ToList();
            var exists = siteNames.Any(siteName => siteName == name.ToLower());
            return exists;
        }

        public bool CheckExistsByAddress(string address)
        {
            ICollection<string> siteAddresses = context.Sites.Select(x => x.Address.ToLower()).ToList();
            var exists = siteAddresses.Any(siteAddress => siteAddress == address.ToLower());
            return exists;
        }

        public async Task<Site> FindByIdAsync(long id)
        {
            var site = await context.Sites.Where(x => x.Id == id).Include(x => x.UserSites).ThenInclude(us => us.User).Include(x => x.Reports).FirstOrDefaultAsync();
            if (site == null) throw new ArgumentNullException(nameof(site));
            return site;
        }

        public async Task<Site> FindByNameAsync(string name)
        {
            var site = await context.Sites.Where(x => x.Name.ToLower() == name.ToLower()).Include(x => x.UserSites).ThenInclude(us => us.User).FirstOrDefaultAsync();
            if (site == null) throw new ArgumentNullException(nameof(site));
            return site;
        }

        public async Task<string> GetSiteNameByIdAsync(long id)
        {
            var site = await context.Sites.FindAsync(id);
            if (site == null) throw new ArgumentNullException(nameof(site));
            return site.Name;
        }

        public async Task<Unit> DeleteAsync(long id)
        {
            var site = await context.Sites.FindAsync(id);
            if (site == null) throw new RestException(HttpStatusCode.NotFound, new { site = "Not found" });
            context.Remove(site);
            var success = await context.SaveChangesAsync() > 0;
            if (success) return Unit.Value;
            throw new Exception("Problem deleting site.");
        }

        public async Task<Unit> UpdateByIdAsync(Command request)
        {
            var siteToUpdate = await context.Sites.FindAsync(request.Id);

            if (siteToUpdate == null) throw new RestException(HttpStatusCode.NotFound, new { Site = "Not Found" });

            var requestSite = new Site(request.Name, request.Address, request.Notes);
            if (siteToUpdate.Equals(requestSite))
            {
                throw new RestException(HttpStatusCode.BadRequest, new { Data = "No Changes Found" });
            }

            siteToUpdate.Name = request.Name;
            siteToUpdate.Address = request.Address;
            siteToUpdate.Notes = request.Notes;

            context.Entry(siteToUpdate).State = EntityState.Modified;

            var success = await context.SaveChangesAsync() > 0;

            if (success) return Unit.Value;

            throw new Exception($"Problem updating {request.Name}");
        }
    }
}