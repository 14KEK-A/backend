@echo off
:BEGIN
CLS

SET db=4PET
:: users

SET import="C:\Program Files\MongoDB\Server\6.0\bin\mongoimport.exe"
SET export="C:\Program Files\MongoDB\Server\6.0\bin\mongoexport.exe"
SET local="mongodb+srv://m001-student:m001-student@sandbox.vpsx1.mongodb.net/4PET?retryWrites=true&w=majority"

ECHO 1.Import
ECHO 2.Export
CHOICE /N /C:12 /M "Enter your choice:"%1
IF ERRORLEVEL ==2 GOTO EXPORT
IF ERRORLEVEL ==1 GOTO IMPORT

:IMPORT
SET /P AREYOUSURE=Are you sure (Y/[N])?
IF /I "%AREYOUSURE%" NEQ "Y" GOTO END
ECHO ---------- Importing to the local database ----------
REM %import% --uri=%local%  --collection=users --drop --file=users.json --jsonArray
REM %import% --uri=%local%  --collection=orders --drop --file=orders.json --jsonArray
REM %import% --uri=%local%  --collection=partners --drop --file=partners.json --jsonArray
REM %import% --uri=%local%  --collection=ratings --drop --file=ratings.json --jsonArray
%import% --uri=%local%  --collection=products --drop --file=products.json --jsonArray
GOTO END

:EXPORT
SET /P AREYOUSURE=Are you sure (Y/[N])?
IF /I "%AREYOUSURE%" NEQ "Y" GOTO END
ECHO ---------- Exporting from the local database ----------
%export% --uri=%local% --collection=users --out=users.json --jsonArray --pretty
%export% --uri=%local% --collection=orders --out=orders.json --jsonArray --pretty
%export% --uri=%local% --collection=partners --out=partners.json --jsonArray --pretty
%export% --uri=%local% --collection=ratings --out=ratings.json --jsonArray --pretty
%export% --uri=%local% --collection=products --out=products.json --jsonArray --pretty

GOTO END

:END
pause