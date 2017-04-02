# RPiWebServer
Documentation will get updated as progress happens.

## Environment Variables
These should be set up in a `process.env` file at the top level of the project folder. This should be added to `.gitignore`.
Environment variables required:
* `DB_HOST` - hostname for mysql server
* `DB_USER` - username to connect to the mysql server
* `DB_PASS` - password to connect to the mysql server
* `CLIMATE_DB_NAME` - name of climate database on the mysql server

## MySQL database
The database should be set up with `CLIMATE_DB_NAME` as its name. The climate table can be set up with
`CREATE TABLE climate (TIME datetime NOT NULL PRIMARY KEY, TEMPERATURE decimal(3,1), HUMIDITY decimal(3,1));