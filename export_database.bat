@echo off
REM Database Export Script for BSEntrepSystem
REM This script exports your local MySQL database for Railway deployment

echo.
echo ========================================
echo  Database Export Script
echo ========================================
echo.

REM Set variables - adjust if needed
SET MYSQL_USER=root
SET MYSQL_HOST=127.0.0.1
SET DB_NAME=capstter
SET OUTPUT_FILE=capstter_backup_%date:~10,4%%date:~4,2%%date:~7,2%_%time:~0,2%%time:~3,2%.sql

REM Try to find mysqldump in common locations
SET MYSQLDUMP_PATHS=^
  "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysqldump.exe" ^
  "C:\Program Files\MySQL\MySQL Server 5.7\bin\mysqldump.exe" ^
  "C:\Program Files (x86)\MySQL\MySQL Server 8.0\bin\mysqldump.exe" ^
  mysqldump.exe

SET MYSQLDUMP=

for %%A in (%MYSQLDUMP_PATHS%) do (
    if exist %%A (
        set "MYSQLDUMP=%%A"
        goto :found
    )
)

:found
if not defined MYSQLDUMP (
    echo ERROR: mysqldump.exe not found!
    echo.
    echo Please install MySQL command-line tools or adjust the paths in this script.
    pause
    exit /b 1
)

echo Using mysqldump from: %MYSQLDUMP%
echo.
echo Exporting database: %DB_NAME%
echo Output file: %OUTPUT_FILE%
echo.
echo NOTE: You will be prompted to enter the MySQL password.
echo If your password is empty, just press Enter.
echo.

REM Export database
%MYSQLDUMP% -u %MYSQL_USER% -h %MYSQL_HOST% -p %DB_NAME% > %OUTPUT_FILE%

if errorlevel 1 (
    echo.
    echo ERROR: Export failed! Check your MySQL credentials.
    pause
    exit /b 1
)

echo.
echo ========================================
echo  SUCCESS!
echo ========================================
echo.
echo Database exported successfully!
echo.
echo File: %OUTPUT_FILE%
echo Size: 
for %%A in (%OUTPUT_FILE%) do echo %%~zA bytes
echo.
echo Next steps:
echo 1. Create MySQL plugin in Railway
echo 2. Connect to Railway MySQL
echo 3. Import this file:
echo    railway connect --service mysql
echo    SOURCE %OUTPUT_FILE%
echo.
pause
