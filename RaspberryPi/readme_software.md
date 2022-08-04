# MeterTheater
2022 Landis+Gyr 

What to change for implementation on the 6th floor lab and beyond:

Change the value of the row sizes to match the amount of sockets for each row (lines 10-15)

Change the expression to calculate metTotal (line 177)

Below is a snippit of the JSON file from the API call on line 168.

To get metTotal for the 6th floor, right wall, replace line 177 with:
metTotal=len(aList[1]['tables'][0]['locations'])

You will also need to change the expression on line 173, lets do the 6th floor right wall as an example:
stateList[i]=aList[1]['tables'][0]['locations'][i]['sockets'][0]['socketUserId']

This for loop esentially fills the stateList with the socketUserId's of all of the meters on a wall. If the socketUserId is 'null' in the API call (converted to 'None' in python) then no one owns the socket so the corresponding LEDs should be green. If the socketUserId is not 'null', then someone is occupying the socket so the corresponding LEDs should be red.

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
