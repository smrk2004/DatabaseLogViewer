using Dapper;
using Microsoft.Extensions.Configuration;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Threading.Tasks;

using DatabaseLogViewer.Interfaces;
using DatabaseLogViewer.Entities;

namespace DatabaseLogViewer.Repositories
{
	public class DatabaseLogRepository : IDatabaseLogRepository
	{
		private readonly IConfiguration _configuration = null;

		public DatabaseLogRepository(IConfiguration configuration)
		{
			_configuration = configuration;
		}
		public async Task<IEnumerable<DatabaseLog>> GetAsync(string sortField, string sortDirection, int pageNumber, int pageSize)
		{
			var p = new DynamicParameters();

			p.Add("@SortField", sortField);
			p.Add("@SortDirection", sortDirection);
			p.Add("@PageNumber", pageNumber);
			p.Add("@PageSize", pageSize);

			using (var connection = new SqlConnection(_configuration.GetConnectionString("AdventureWorks2014")))
			{
				var resultSet = await connection.QueryAsync<DatabaseLog>("usp_Get_DatabaseLog", p, commandType: CommandType.StoredProcedure);
				return resultSet;
			}
		}
		public async Task<int> GetCountAsync()
		{
			using (var connection = new SqlConnection(_configuration.GetConnectionString("AdventureWorks2014")))
			{
				var result = await connection.ExecuteScalarAsync<int>("SELECT dbo.ufn_DatabaseLog_Count()");

				return result;
			}
		}
	}
}
