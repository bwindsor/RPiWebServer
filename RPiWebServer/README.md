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
There should be several users set up
* A test user which has access to create/delete test databases. This can be set up with ``GRANT ALL PRIVILEGES ON `test\_%`.* TO 'benjw'@'localhost'``
* A user which is the web server, which has read only access. This can be set up with ``GRANT SELECT ON CLIMATE_DB_NAME.`climate` TO 'climate'@'localhost'``
* A user which is the logging programme, which has read and write access to the database. This can be set up with ``GRANT INSERT, SELECT ON `climate`.`climate` TO 'climatelogger'@'localhost';``

## API
The endpoint of the api is `/climate/api`

Humidity | Descriptions
--- | ---
Method | GET
Path | /humidity
Description | Gets the most recently read humidity, in % relative
Returns | Object
Example request | `/humidity`
Example response | `{"humidity": 70}`

Temperature | Descriptions
--- | ---
Method | GET
Path | /temperature
Description | Gets the most recently read temperature, in Celsius
Returns | Object
Example request | `/temperature`
Example response | `{"temperature": 20}`

All | Descriptions
--- | ---
Method | GET
Path | /all
Description | Gets the most recently read time, temperature and humidity
Returns | Object
Example request | `/all`
Example response | `{"time":"2015-11-13T10:08:51.000Z","temperature":20,"humidity":70}`

Since | Descriptions
--- | ---
Method | GET
Path | /since?time=:time
Description | Gets all times, temperatures and humidities since the requested time
Parameters | *Time*: Integer or decimal, the UNIX time which is seconds since 1/1/1970.
Returns | Object[]
Example request | `/since?time=1491767120`
Example response | `[{"time":"2017-04-09T19:45:01.000Z","temperature":20,"humidity":70}, {"time":"2017-04-09T19:45:31.000Z","temperature":19,"humidity":68}]`

The spacing between the responses depends on how many you have requested. There is a maximum number of results which is returned, and they are decimated in time to keep the number below this limit.

## Tests
`npm test`
Make sure the `process.env` file is set up correctly for access to a test database.
To run tests you will need to allow your database user to create and delete databases starting with test_.
