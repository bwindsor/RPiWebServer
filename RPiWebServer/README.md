# RPiWebServer
Documentation will get updated as progress happens.

## Environment Variables
These should be set up in a `process.env` file at the top level of the project folder. This should be added to `.gitignore`.
Environment variables required:
* `DB_HOST` - hostname for mysql server
* `DB_USER` - username to connect to the mysql server
* `DB_PASS` - password to connect to the mysql server
* `CLIMATE_DB_NAME` - name of climate database on the mysql server
* `NODE_ENV` - set to development or production depending on the use case

## MySQL database
The database should be set up with `CLIMATE_DB_NAME` as its name. The climate table can be set up with
`CREATE TABLE climate (TIME datetime NOT NULL PRIMARY KEY, TEMPERATURE decimal(3,1), HUMIDITY decimal(3,1));`

## API
The endpoint of the api is /climate/api

`GET /humidity`
Gets the most recently read humidity
Returns object
humidity - the last read humidity, in % relative.
Example: `{"humidity": 70}`

`GET /temperature`
Gets the most recently read temperature
Returns object
temperature - the last read temperature, in Celsius
Example: `{"temperature": 20}`

Define type Climate to be an object
time - ISO time string
temperature - temperature in degress Celsius
humidity - relative humidity in %

`GET /all`
Gets the most recently read row of data.
Returns Climate
Example `{"time":"2015-11-13T10:08:51.000Z","temperature":20,"humidity":70}`

`GET /since?time=:time`
Gets all data since the unix time (seconds since January 1st, 1970).
The unix time can be obtained from a JavaScript date by `myDate.getTime()/1000`
Params
time (required) - The UNIX time to get data since
Returns Climate[]
Example `[{"time":"2015-11-13T10:08:21.000Z","temperature":19,"humidity":70}, {"time":"2015-11-13T10:08:51.000Z","temperature":20,"humidity":70}]`

`GET /between?startTime=:startTime&endTime=:endTime&minSpacing=:minSpacing`
Not yet implemented.
Params
startTime (required) - earliest UNIX time to return
endTime (required) - latest UNIX time to return
minSpacing (optional) - the minimum average spacing between observations, in seconds
Returns Climate[]