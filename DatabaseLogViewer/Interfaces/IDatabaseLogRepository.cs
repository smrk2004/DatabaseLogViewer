using System.Collections.Generic;
using System.Threading.Tasks;

using DatabaseLogViewer.Entities;

namespace DatabaseLogViewer.Interfaces
{
	public interface IDatabaseLogRepository
    {
		Task<IEnumerable<DatabaseLog>> GetAsync(string sortField, string sortDirection, int pageNumber, int pageSize);
		Task<int> GetCountAsync();
	}
}
