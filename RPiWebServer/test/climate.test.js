"use strict";
const assert = require("assert");
const app = require("../app");
const request = require("request");
var port = 3000;
function get_request_url(path) {
    return "http://localhost:" + port.toString() + '/climate' + path;
}
describe('climate', () => {
    var server;
    before(done => {
        server = app.app.listen(port, (err, result) => {
            if (err) {
                done(err);
            }
            else {
                done();
            }
        });
    });
    after(done => {
        server.close((err) => {
            if (err) {
                done(err);
            }
            else {
                done();
            }
        });
    });
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