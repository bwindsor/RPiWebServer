"use strict";
/** @module helpers/climate */
const fs = require("fs");
const csv_parse = require("csv-parse");
const path = require('path');
const read_last_lines = require('read-last-lines');
const DATA_FILE = process.env.DATA_FILE || path.join(__dirname, 'tempoutput.txt');
/** The name of the module. */
exports.name = 'climate';
function read_last_line() {
    return new Promise((fulfill, reject) => {
        fs.access(DATA_FILE, fs.constants.R_OK, (err) => {
            if (err) {
                reject(err);
            }
            else {
                read_last_lines.read(DATA_FILE, 1).then((lines) => {
                    csv_parse(lines, (err, data) => {
                        if (err) {
                            reject(err);
                        }
                        else {
                            fulfill(data[0]);
                        }
                    });
                });
            }
        });
    });
}
/** Gets the most recently read temperature
@return Promise */
function get_temperature() {
    return new Promise((resolve, reject) => {
        read_last_line().then((value) => {
            resolve(parseFloat(value[2]));
        }).catch(reason => {
            reject(reason);
        });
    });
}
exports.get_temperature = get_temperature;
/** Gets the most recently read humidity */
function get_humidity() {
    return new Promise((resolve, reject) => {
        read_last_line().then((value) => {
            resolve(parseFloat(value[1]));
        }).catch(reason => {
            reject(reason);
        });
    });
}
exports.get_humidity = get_humidity;
/** Gets the most recently read time
@return Promise<Date> */
function get_time() {
    return new Promise((resolve, reject) => {
        read_last_line().then((value) => {
            var d = new Date(0);
            d.setUTCSeconds(parseFloat(value[0]));
            resolve(d);
        }).catch(reason => {
            reject(reason);
        });
    });
}
exports.get_time = get_time;
//# sourceMappingURL=climate.js.map