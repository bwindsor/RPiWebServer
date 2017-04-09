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

The API is [documented in more detail here](https://github.com/bwindsor/RPiWebServer/blob/master/RPiWebServer/docs/climateapi.md).

## Tests
`npm test`
Make sure the `process.env` file is set up correctly for access to a test database.
To run tests you will need to allow your database user to create and delete databases starting with test_.
