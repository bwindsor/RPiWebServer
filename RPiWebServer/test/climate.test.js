"use strict";
require('dotenv').config({ path: '../process.env' });
const assert = require("assert");
const moment = require("moment");
const app = require("../app");
const request = require("request");
const util = require("util");
const climate_read = require("../datasource/climateread");
const climate = require("../datasource/climateapi");
var db_connection = climate_read.get_db_connection();
var port = 3000;
var test_data = [
    { time: new Date('2015-11-13 10:08:01'), temperature: 20, humidity: 70 },
    { time: new Date('2015-11-13 10:08:11'), temperature: 20, humidity: 70 },
    { time: new Date('2015-11-13 10:08:21'), temperature: 20, humidity: 70 },
    { time: new Date('2015-11-13 10:08:31'), temperature: 20, humidity: 70 },
    { time: new Date('2015-11-13 10:08:41'), temperature: 20, humidity: 70 },
    { time: new Date('2015-11-13 10:08:51'), temperature: 20, humidity: 70 }
];
function get_request_url(path) {
    return "http://localhost:" + port.toString() + '/climate' + path;
}
var server;
function clear_db(done) {
    db_connection.query("DELETE FROM climate", err => {
        if (err) {
            done(err);
        }
        else {
            done();
        }
    });
}
before(done => {
    /* Create test database */
    var query_string = "INSERT INTO climate VALUES ";
    for (var i = 0; i < test_data.length; i++) {
        query_string = query_string.concat(util.format("(FROM_UNIXTIME(%d), %d, %d), ", Math.round(test_data[i].time.getTime() / 1000), test_data[i].temperature, test_data[i].humidity));
    }
    ;
    query_string = query_string.slice(0, -2);
    clear_db((err) => {
        if (err) {
            done(err);
        }
        else {
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
        }
    });
});
after(done => {
    server.close((err) => {
        if (err) {
            done(err);
        }
        else {
            clear_db((err) => {
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
                assert.deepEqual(result, test_data.slice(test_data.length - 1));
            });
        });
        it('should return one results when asked for a time range with no width on a time point', () => {
            var req = new climate.ClimateRequest(test_data[3].time, moment.duration(0, 'seconds'));
            return climate.get_climate(req).then(result => {
                assert.deepEqual(result, test_data.slice(3, 4));
            });
        });
        it('should return no results when asked for a time range with no width not on a time point', () => {
            var req = new climate.ClimateRequest(new Date(0), moment.duration(0, 'seconds'));
            return climate.get_climate(req).then(result => {
                assert.deepEqual(result, []);
            });
        });
        it('should return two results when asked for a time range with two points in it', () => {
            var time_diff = (test_data[3].time.getTime() - test_data[2].time.getTime()) / 1000;
            var req = new climate.ClimateRequest(test_data[3].time, moment.duration(time_diff, 'seconds'));
            return climate.get_climate(req).then(result => {
                assert.deepEqual(result, test_data.slice(2, 4));
            });
        });
        it('should return four results when asked for a time range with four points in it', () => {
            var time_diff = (test_data[4].time.getTime() - test_data[1].time.getTime()) / 1000 + 1;
            var req = new climate.ClimateRequest(test_data[4].time, moment.duration(time_diff, 'seconds'));
            return climate.get_climate(req).then(result => {
                console.log(result);
                assert.deepEqual(result, test_data.slice(1, 5));
            });
        });
        it('should return two results when asked for a time range with four points and a wide spacing', () => {
            var time_diff = (test_data[4].time.getTime() - test_data[1].time.getTime()) / 1000 + 1;
            var req = new climate.ClimateRequest(test_data[4].time, moment.duration(time_diff, 'seconds'), time_diff / 4 * 2.1);
            return climate.get_climate(req).then(result => {
                assert.deepEqual(result, test_data.filter((d, i) => {
                    return (i == 2 || i == 4);
                }));
            });
        });
    });
});
describe('climate_api', () => {
    describe('get /api/temperature', () => {
        it('should return the newest temperature', done => {
            request.get(get_request_url('/api/temperature'), function (error, response, body) {
                if (error) {
                    done(error);
                }
                else {
                    assert.equal(response.statusCode, 200);
                    var json = JSON.parse(body);
                    assert.deepEqual(json, {
                        temperature: test_data[test_data.length - 1].temperature
                    });
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
                    assert.deepEqual(json, {
                        humidity: test_data[test_data.length - 1].humidity
                    });
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
                    var json = JSON.parse(body, (key, value) => {
                        if (key == 'time') {
                            return new Date(value);
                        }
                        else {
                            return value;
                        }
                    });
                    assert.deepEqual(json, test_data[test_data.length - 1]);
                    done();
                }
            });
        });
    });
});
//# sourceMappingURL=climate.test.js.map