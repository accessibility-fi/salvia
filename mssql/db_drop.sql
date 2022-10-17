EXEC msdb.dbo.sp_delete_database_backuphistory @database_name = N'salvialocaldb01'
GO
use [master];
GO
USE [master]
GO
ALTER DATABASE [salvialocaldb01] SET  SINGLE_USER WITH ROLLBACK IMMEDIATE
GO
USE [master]
GO
DROP DATABASE [salvialocaldb01]
GO

