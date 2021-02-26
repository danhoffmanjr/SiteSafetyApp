using System.Threading.Tasks;

namespace PikeSafetyWebApp.Application.Interfaces
{
    public interface IReportService
    {
        Task<long> GetIdByTitleAsync(string name);
    }
}