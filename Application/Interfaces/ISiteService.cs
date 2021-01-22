using System.Threading.Tasks;
using MediatR;
using PikeSafetyWebApp.Models;
using static PikeSafetyWebApp.Application.Sites.Edit;

namespace PikeSafetyWebApp.Application.Interfaces
{
    public interface ISiteService
    {
        Task<bool> AddAsync(Site site);
        bool CheckExistsByName(string name);
        bool CheckExistsByAddress(string address);
        Task<Site> FindByIdAsync(long id);
        Task<Site> FindByNameAsync(string name);
        Task<string> GetSiteNameByIdAsync(long id);
        Task<Unit> DeleteAsync(long id);
        Task<Unit> UpdateByIdAsync(Command request);
    }
}