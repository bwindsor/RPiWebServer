"use strict";
require('dotenv').config({ path: '../process.env' });
const assert = require("assert");
const app = require("../app");
const request = require("request");
const util = require("util");
const climate_read = require("../datasource/climateread");
const climate = require("../datasource/climateapi");
var db_connection = climate_read.get_db_connection();
var port = 3000;
var test_data = [
    { time: new Date('2015-11-13 10:08:01'), temperature: 20, humidity: 70 }
];
function get_request_url(path) {
    return "http://localhost:" + port.toString() + '/climate' + path;
}
var server;
before(done => {
    /* Create test database */
    var query_string = "INSERT INTO climate VALUES ";
    for (var i = 0; i < test_data.length; i++) {
        query_string = query_string.concat(util.format("(FROM_UNIXTIME(%d), %d, %d), ", Math.round(test_data[i].time.getTime() / 1000), test_data[i].temperature, test_data[i].humidity));
    }
    ;
    query_string = query_string.slice(0, -2);
    db_connection.query(query_string, err => {
        if (err) {
            done(err);
        }
        else {
            server = app.app.listen(port, (err, result) => {
                if (err) {
                    done(err);
                }
                else {
                    done();
                }
            });
        }
        ;
    });
});
after(done => {
    server.close((err) => {
        if (err) {
            done(err);
        }
        else {
            db_connection.query("DELETE FROM climate", err => {
                if (err) {
                    done(err);
                }
                else {
                    db_connection.end(err => {
                        if (err) {
                            done(err);
                        }
                        else {
                            done();
                        }
                    });
                }
            });
        }
    });
});
describe('climate_data_get', () => {
    describe('get_climate()', () => {
        // Note this returns a promise instead of using the done function
        it('should return one result with latest time request', () => {
            var req = new climate.ClimateRequest();
            return climate.get_climate(req).then(result => {
                assert.equal(result.length, 1, "Actual length was " + result.length.toString());
            });
        });
    });
});
describe('climate_api', () => {
    describe('get /api/temperature', () => {
        it('should return a temperature', done => {
            request.get(get_request_url('/api/temperature'), function (error, response, body) {
                if (error) {
                    done(error);
                }
                else {
                    assert.equal(response.statusCode, 200);
                    var json = JSON.parse(body);
                    assert(json.hasOwnProperty("temperature"));
                    assert.equal(typeof json.temperature, "number");
                    done();
                }
            });
        });
    });
    describe('get /api/humidity', () => {
        it('should return a humidity', done => {
            request.get(get_request_url('/api/humidity'), function (error, response, body) {
                if (error) {
                    done(error);
                }
                else {
                    assert.equal(response.statusCode, 200);
                    var json = JSON.parse(body);
                    assert(json.hasOwnProperty("humidity"), "Expected field not present");
                    assert.equal(typeof json.humidity, "number");
                    done();
                }
            });
        });
    });
    describe('get /api/all', () => {
        it('should return all climate data', done => {
            request.get(get_request_url('/api/all'), function (error, response, body) {
                if (error) {
                    done(error);
                }
                else {
                    assert.equal(response.statusCode, 200);
                    var json = JSON.parse(body);
                    assert(json.hasOwnProperty("temperature"));
                    assert(json.hasOwnProperty("humidity"));
                    assert(json.hasOwnProperty("time"));
                    assert.equal(typeof json.temperature, "number");
                    assert.equal(typeof json.humidity, "number");
                    assert.equal(typeof json.time, "string");
                    done();
                }
            });
        });
    });
});
//# sourceMappingURL=climate.test.js.map