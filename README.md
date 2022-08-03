# MeterTheater

## Angular
Development should be done on http://localhost:4200 (since that is the only port allowed by the CORS policy in the API).

## IIS
### Certificates
The certificates expire on 7/28/2023 for the website and the API.
### Publishing
When publishing the angular app, make sure to not delete the web.config in the IIS folder. It has the rewrite configuration in it.

## API
### API Development
The appsettings.json and appsettings.Development.json files are in the .gitignore. They belong in the MeterTheaterAPI folder and the code inside of them is stored in the secrets in the GitHub.
### API Access
To access the API, first do POST https://10.1.210.32:8002/Logins/Login with a JSON string in the body. The string needs to be a valid username. The request will send back a cookie and a user object on success. The API can then be freely accessed by passing the cookie along with the request.

## DB
### Access
The tieteam windows account could be used, and the password for sa is in the appsettings.json secret on the GitHub.
### Job Note
The AutoCheckIn job (and all other jobs) in the SQL database stop when the NUC is restarted. To turn the jobs back on, after logging into the SQL Server, right-click SQL Server Agent and click start.
### User Note
When recreating the User table, make sure to add 'BusPI' as a user, as that is the username used by the PI. Also note that only the userName, userID, and userIsAdmin fields are currently used.
### Creation
The MeterTheater.sql script can be used to recreate the database with the initial data (the 2nd and 6th floor labs). The autoCheckIn.sql file is a script with the job that deals with decrementing the remaining number of days on a socket at midnight every night.
### Admin
To make a user an admin, set userIsAdmin to 1.
### Altering the DB
When altering data, errors may occur due to foreign keys, so make sure to clear those out first by doing things such as deleting associated log entries.
### Adding Sockets
First add a new lab, then add any new tables, then add all the locations, then add the sockets. Each location should have a unique socket and each socket should have a unique location. Also, it has only been tested with adding locations and sockets in order from left to right, top to bottom (row, col), but it should not matter.