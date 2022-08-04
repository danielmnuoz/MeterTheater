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
### Job Notes
The AutoCheckIn job (and all other jobs) in the SQL database stop when the NUC is restarted. To turn the jobs back on, after logging into the SQL Server, right-click SQL Server Agent and click start.
Also, the AutoCheckIn job is currently set to only decrement down to 0, and does not check-in the sockets afterwards.
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

## Pi Software

What to change for implementation on the 6th floor lab and beyond:

Change the value of the row sizes to match the amount of sockets for each row (lines 10-15)

Change the expression to calculate metTotal (line 170)

Below is a snippit of the formatted JSON file from the API call on line 161.

To get metTotal for the 6th floor, right wall, replace line 170 with:

        metTotal=len(aList[1]['tables'][0]['locations'])

You will also need to change the expression on line 173, lets do the 6th floor right wall as an example:

        stateList[i]=aList[1]['tables'][0]['locations'][i]['sockets'][0]['socketUserId']

This line esentially fills the stateList with the socketUserId's of all of the meters on a wall. If the socketUserId is NULL (in python, 'None') then no one owns the meter so the corresponding LEDs should be green. If the socketUserId is not NULL, then someone is occupying the socket so the corresponding LEDs should be red.

If you cannot figure out how to properly parse the JSON file for further implemetation in other labs, use Postman to view the JSON file from an API call. 

    [
      {
        "labId": 1,
        "labName": "2nd Floor Lab",
        "tables": [
          {
            "tableId": 1,
            "tableName": "Front Wall",
            "tableLabId": 1,
            "locations": [
              {
                "locationId": 1,
                "locationRow": 1,
                "locationCol": 1,
                "locationTableId": 1,
                "sockets": [
                  {
                    "socketId": 1,
                    "socketMeterId": null,
                    "socketUserId": null,
                    "socketForm": "2S",
                    "socketVoltage": 208,
                    "socketLocationId": 1,
                    "socketCheckOutTime": "2022-08-02T11:50:04.26",
                    "socketCheckInTime": "2022-08-02T12:40:41.53",
                    "socketDuration": null,
                    "socketComment": null,
                    "socketMeter": null,
                    "socketUser": null,
                    "logs": []
                  }
                ]
              },
              {
                "locationId": 2,
                "locationRow": 1,
                "locationCol": 2,
                "locationTableId": 1,
                "sockets": [
                  {
                    "socketId": 2,
                    "socketMeterId": null,
                    "socketUserId": null,
                    "socketForm": "2S",
                    "socketVoltage": 208,
                    "socketLocationId": 2,
                    "socketCheckOutTime": "2022-07-29T09:08:31.423",
                    "socketCheckInTime": "2022-08-01T10:20:15.627",
                    "socketDuration": null,
                    "socketComment": null,
                    "socketMeter": null,
                    "socketUser": null,
                    "logs": []
                  }
                ]
              },
