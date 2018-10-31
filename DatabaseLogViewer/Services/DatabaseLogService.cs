using System.Collections.Generic;
using System.Threading.Tasks;
using DatabaseLogViewer.Interfaces;
using DatabaseLogViewer.Models;
using AutoMapper;

namespace DatabaseLogViewer.Services
{
	public class DatabaseLogService : IDatabaseLogService
    {
		private readonly IMapper _mapper = null; 
		private readonly IDatabaseLogRepository _databaseLogRepository = null;

		public DatabaseLogService(IDatabaseLogRepository databaseLogRepository, IMapper mapper)
		{
			_databaseLogRepository = databaseLogRepository;
			_mapper = mapper;
		}

		public async Task<IEnumerable<LogViewModel>> GetLogsAsync(string sortField, string sortDirection, int pageNumber, int pageSize)
		{
			return _mapper.Map<IEnumerable<LogViewModel>>(await _databaseLogRepository.GetAsync(sortField, sortDirection, pageNumber, pageSize));
		}

		public async Task<int> GetLogsCountAsync()
		{
			return await _databaseLogRepository.GetCountAsync();
		}
	}
}
