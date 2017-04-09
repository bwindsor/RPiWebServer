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
