using System.Collections.Generic;
using System.Threading.Tasks;

using DatabaseLogViewer.Models;

namespace DatabaseLogViewer.Interfaces
{
	public interface IDatabaseLogService
	{
		Task<IEnumerable<LogViewModel>> GetLogsAsync(string sortField, string sortDirection, int pageNumber, int pageSize);
		Task<int> GetLogsCountAsync();
	}
}