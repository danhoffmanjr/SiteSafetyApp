using System.Collections.Generic;
using System.Threading.Tasks;
using MediatR;
using PikeSafetyWebApp.Models;

namespace PikeSafetyWebApp.Application.Interfaces
{
    public interface ICompanyService
    {
        Task<string> GetCompanyNameByIdAsync(long id);
        Task<Company> FindByNameAsync(string name);
        bool CheckExistsByName(string name);
        Task<List<Company>> GetActiveCompanies();
        Task<bool> AddAsync(Company company);
        Task<Unit> DeleteAsync(long id);
        Unit Delete(long id);
    }
}