using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using PikeSafetyWebApp.Application.Errors;
using PikeSafetyWebApp.Application.Interfaces;
using PikeSafetyWebApp.Data;
using PikeSafetyWebApp.Models;

namespace PikeSafetyWebApp.Application.Companies
{
    public class CompanyService : ICompanyService
    {
        private readonly PikeSafetyDbContext context;
        private readonly UserManager<AppUser> userManager;
        public CompanyService(PikeSafetyDbContext context, UserManager<AppUser> userManager)
        {
            this.userManager = userManager;
            this.context = context;
        }

        public async Task<string> GetCompanyNameByIdAsync(long id)
        {
            var company = await context.Companies.FindAsync(id);
            if (company == null) throw new ArgumentNullException(nameof(company));
            return company.Name;
        }

        public async Task<Company> FindByNameAsync(string name)
        {
            var company = await context.Companies.FirstOrDefaultAsync(x => x.Name.ToLower() == name.ToLower());
            if (company == null) throw new ArgumentNullException(nameof(company));
            return company;
        }

        public bool CheckExistsByName(string name)
        {
            ICollection<string> companyNames = context.Companies.Select(x => x.Name.ToLower()).ToList();
            var exists = companyNames.Any(cname => cname == name.ToLower());
            return exists;
        }

        public async Task<List<Company>> GetActiveCompanies()
        {
            return await context.Companies.Where(x => x.IsActive == true).Include(x => x.Sites).Include(x => x.Users).ToListAsync();
        }

        public async Task<bool> AddAsync(Company company)
        {
            context.Companies.Add(company);
            return await context.SaveChangesAsync() > 0;
        }

        public async Task<Unit> DeleteAsync(long id)
        {
            var company = await context.Companies.FindAsync(id);
            if (company == null) throw new RestException(HttpStatusCode.NotFound, new { company = "Not found" });
            context.Remove(company);
            var success = await context.SaveChangesAsync() > 0;
            if (success) return Unit.Value;
            throw new Exception("Problem deleting company.");
        }

        public Unit Delete(long id)
        {
            var company = context.Companies.Find(id);
            if (company == null) throw new RestException(HttpStatusCode.NotFound, new { company = "Not found" });
            context.Remove(company);
            var success = context.SaveChanges() > 0;
            if (success) return Unit.Value;
            throw new Exception("Problem deleting company.");
        }
    }
}