using System.Threading.Tasks;
using PikeSafetyWebApp.Models;

namespace PikeSafetyWebApp.Application.Interfaces
{
    public interface IReportService
    {
        Task<Report> FindByIdAsync(long id);
        Task<long> GetIdByTitleAsync(string name);
    }
}