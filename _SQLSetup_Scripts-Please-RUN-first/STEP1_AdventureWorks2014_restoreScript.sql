/*

 To Restore AdventureWorks2014-db to '(localdb)\MSSQLLocalDB' server from our downloaded AdventureWorks2014.bak, by running script below in SQL 

*/

RESTORE FILELISTONLY  
FROM DISK = 'C:\db-extracts\AdvWks2014\AdventureWorks2014.bak'
GO  

RESTORE DATABASE AdventureWorks2014  
FROM DISK = 'C:\db-extracts\AdvWks2014\AdventureWorks2014.bak'
WITH MOVE 'AdventureWorks2014_Data' TO 'C:\db-extracts\AdvWks2014\AdventureWorks2014.mdf',
MOVE 'AdventureWorks2014_Log' TO 'C:\db-extracts\AdvWks2014\AdventureWorks2014.ldf'