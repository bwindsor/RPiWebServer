"use strict";
/** @module helpers/climate */
var fs = require('fs');
var csv_parse = require('csv-parse');
var path = require('path');
var read_last_lines = require('read-last-lines');
var DATA_FILE = process.env.DATA_FILE || path.join(__dirname, 'tempoutput.txt');
/** The name of the module. */
exports.name = 'climate';
/** Gets the most recently read temperature
@return {integer} temperature */
function get_temperature(cb) {
    fs.access(DATA_FILE, fs.constants.R_OK, function (err) {
        if (err) {
            cb(err);
        }
        else {
            read_last_lines.read(DATA_FILE, 1).then(function (lines) {
                csv_parse(lines, function (err, data) {
                    if (err) {
                        cb(err);
                    }
                    else {
                        cb(null, parseFloat(data[0][2]));
                    }
                });
            });
        }
    });
}
exports.get_temperature = get_temperature;
/** Gets the most recently read humidity */
function get_humidity() {
    return 70;
}
exports.get_humidity = get_humidity;
/** Gets the most recently read time */
function get_time() {
    var d = new Date(0);
    d.setUTCSeconds(1490916570);
    return d;
}
exports.get_time = get_time;
//# sourceMappingURL=climate.js.map