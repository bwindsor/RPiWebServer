# DataReader
This is C code which reads from the DHT11 temperature sensor and writes the results to a mysql database.

## Dependencies
* WiringPi. A version is included in this repo from which you can install, but the latest version can be obtained from [http://wiringpi.com/]
* MySql Connector. This is the C library that allows C to interface to a database. Download and installation instructions can be found at [https://dev.mysql.com/downloads/connector/c/]

## Environment
* A file called `environment.h` is required for the build, which is .gitignored because it contains private information. It should look something like this:
```C
#define DB_HOST "localhost"
#define DB_USER "sqlusername"
#define DB_PASS "sqlpassword"
#define CLIMATE_DB_NAME "test_climate"
```

## Build
Build with `./build`