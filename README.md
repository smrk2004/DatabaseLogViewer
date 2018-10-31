# DatabaseLogViewer_2018

PROBLEM
========
Implementation of Log Viewer on AdventureWorks2014 DB's Logs table
Solved via an ASPNETCORE MVC app 'DatabaseLogViewer'

Also included SQL Setup_Scripts to be run first(please find inside '_SQLSetup_Scripts-Please-RUN-first' folder):

0) Follow 'STEP0_Obtain_AdventureWorks2014_Windows.txt' to obtain AdventureWorks2014.bak
1) Run 'STEP0_AdventureWorks2014_restoreScript.sql' - To setup AdventureWorks2014 on localdb
2) Run 'STEP1_RUNME_to_setup_DB+FNS+SPROC.sql' - Prepare AdventureWorks2014 db / setup for DatabaseLogViewer Solution's DB artifacts
3) Open 'DatabaseLogViewer.sln' in Visual Studio and RUN the app

NOTE: Assumption in above setup instructions is -> the app is being setup on Windows;
If desired .NET Core apps out of the box build on other platforms, ONLY additional step would be to setup the SQL instance via Docker & update web config to use that instance.

The PROBLEM statement is included in 'PROBLEM Statement-Question.txt'
The WEBAPI also implements a Swagger interface, to enable independently testing the endpoints -> to use it Click 'Go to Swagger!' in bottom right of application when running