# MeterTheater

## Angular
Development should be done on http://localhost:4200 (since that is the only port allowed by the CORS policy in the API).

## IIS
The certificates expire on 7/28/2023 for the website and the API.

## API
The appsettings.json and appsettings.Development.json files are in the .gitignore. They belong in the MeterTheaterAPI folder and the code inside of them is stored in the secrets in the GitHub.
To access the API, first do POST https://10.1.210.32:8002/Logins/Login with a JSON string in the body. The string needs to be a valid username. The request will send back a cookie and a user object on success. The API can then be freely accessed by passing the cookie along with the request.

## DB
The AutoCheckIn job (and all other jobs) in the SQL database stop when the NUC is restarted. To turn the jobs back on, after logging into the SQL Server, right-click SQL Server Agent and click start.
When recreating the User table, make sure to add 'BusPI' as a user, as that is the username used by the PI.
The MeterTheater.sql script can be used to recreate the database with the initial data (the 2nd and 6th floor labs). The autoCheckIn.sql file is a script with the job that deals with decrementing the remaining number of days on a socket at midnight every night.