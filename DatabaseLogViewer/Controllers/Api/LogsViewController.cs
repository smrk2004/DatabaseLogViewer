using Microsoft.AspNetCore.Mvc;
using System;
using System.Net;
using System.Threading.Tasks;

using DatabaseLogViewer.Interfaces;
using Microsoft.Extensions.Logging;

namespace DatabaseLogViewer.Controllers
{
    [Route("api/[controller]")]
    public class LogsViewController : Controller
	{
		private readonly IDatabaseLogService _databaseLogService = null;
		private readonly ILogger<LogsViewController> _logger;
		public LogsViewController(IDatabaseLogService databaseLogService, ILogger<LogsViewController> logger)
		{
			_databaseLogService = databaseLogService;
			_logger = logger;
		}

		/// <summary>
		///			Get Paginated, Sorted Logs data; Returns specified 'pageNumber' of resultset containing 'pageSize' records, sorted by 'sortField' in specified 'sortDirection' 
		/// </summary>
		/// <param name="sortField">Defaults to DatabaseLogID</param>
		/// <param name="sortDirection">Defaults to ASC</param>
		/// <param name="pageNumber">Defaults to 1</param>
		/// <param name="pageSize">Defaults to 15</param>
		/// <returns></returns>
		[HttpGet("logs")]
		public async Task<IActionResult> GetLogs(string sortField = "DatabaseLogID", string sortDirection = "ASC", int pageNumber = 1, int pageSize = 15)
		{
			try
			{
				return Ok(await _databaseLogService.GetLogsAsync(sortField, sortDirection, pageNumber, pageSize));
			}
			catch (Exception e)
			{
				_logger.LogError("ERROR [GetLogs]" + e.ToString());
				return StatusCode((int) HttpStatusCode.InternalServerError);
			}
		}

		/// <summary>
		///			Get Total Count of logs 
		/// </summary>
		/// <returns></returns>
		[HttpGet("logs/count")]
		public async Task<IActionResult> GetLogsCount()
		{
			try
			{
				return Ok(await _databaseLogService.GetLogsCountAsync());
			}
			catch (Exception e)
			{
				_logger.LogError("ERROR [GetLogsCount]" + e.ToString());
				return StatusCode((int) HttpStatusCode.InternalServerError);
			}
		}
	}
}