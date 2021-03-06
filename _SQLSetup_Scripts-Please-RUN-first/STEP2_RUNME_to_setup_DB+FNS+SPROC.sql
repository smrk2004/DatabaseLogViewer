USE [AdventureWorks2014]

/* 0. Cleanup Scripts-use as needed */

IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'usp_Get_DatabaseLog')
	DROP PROCEDURE usp_Get_DatabaseLog

IF EXISTS (SELECT * FROM sys.objects WHERE type = 'FN' AND name = 'ufn_DatabaseLog_Count')
	DROP FUNCTION [dbo].[ufn_DatabaseLog_Count]
GO

/* 1. Create Scripts-FNs,Stored PROCs */

CREATE FUNCTION [dbo].[ufn_DatabaseLog_Count]()
RETURNS INT
AS 
BEGIN
    DECLARE @retValue INT = 0;

    SELECT @retValue = COUNT(*)
	FROM DatabaseLog

    RETURN(@retValue)
END
GO

CREATE PROCEDURE [dbo].[usp_Get_DatabaseLog]
	@SortField VARCHAR(MAX) = 'DatabaseLogID', 
	@SortDirection VARCHAR(4) = 'ASC',
	@PageNumber INT = 1,
	@PageSize INT = 15
AS
BEGIN
	SET NOCOUNT ON;

	DECLARE @TotalRecords INT = 0;
	SELECT @TotalRecords = dbo.ufn_DatabaseLog_Count();

	DECLARE @TotalPages INT = @TotalRecords / @PageSize;
	DECLARE @LastPageRecordsCount INT = @TotalRecords % @PageSize;
	
	if(@LastPageRecordsCount>0)
		SET @TotalPages = @TotalPages + 1;

	DECLARE @StartRecordRow INT = ((@PageNumber - 1) * @PageSize) + 1;
	DECLARE @EndRecordRow INT = @StartRecordRow + @PageSize - 1;

    DECLARE @Sql NVARCHAR(MAX);
	SET @Sql = 'SELECT DatabaseLogID, PostTime, DatabaseUser, Event, [Schema], Object, TSQL, XmlEvent FROM (
					SELECT ROW_NUMBER() over (ORDER BY ' + @SortField + ' ' + @SortDirection + ') as rownum, *
				FROM [AdventureWorks2014].[dbo].[DatabaseLog]
				) as OrderedDBLog
				where rownum between ' + CAST(@StartRecordRow AS NVARCHAR(MAX)) + ' and ' + CAST(@EndRecordRow AS NVARCHAR(MAX)) + ' ';
	EXEC(@Sql)

	RETURN 0;
END
