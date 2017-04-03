"use strict";
const moment = require("moment");
const fs = require("fs");
const csv_parse = require("csv-parse");
const path = require('path');
const DATA_FILE = process.env.DATA_FILE || path.join(__dirname, 'tempoutput.txt');
const mysql = require("mysql");
;
class ClimateRequest {
    constructor(time, timeSpan, minTimeGap) {
        this.getLastOnly = false;
        if (time) {
            this.time = time;
        }
        else {
            this.time = new Date();
            this.getLastOnly = true;
        }
        if (timeSpan) {
            this.timeSpan = timeSpan;
        }
        else {
            this.timeSpan = moment.duration(0);
        }
        if (minTimeGap) {
            this.minTimeGap = minTimeGap;
        }
        else {
            this.minTimeGap = 1;
        }
    }
    ;
}
exports.ClimateRequest = ClimateRequest;
function get_db_connection() {
    return mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.CLIMATE_DB_NAME
    });
}
exports.get_db_connection = get_db_connection;
function read_database(req) {
    var connection = get_db_connection();
    return new Promise((resolve, reject) => {
        var query;
        if (req.getLastOnly) {
            query = "SELECT * FROM climate WHERE TIME = (SELECT MAX(TIME) FROM climate)";
        }
        else {
            var last_time = req.time.toISOString().slice(0, 19).replace('T', ' ');
            var first_time = moment(req.time).subtract(req.timeSpan).toDate().toISOString().slice(0, 19).replace('T', ' ');
            query = mysql.format('SELECT * FROM climate WHERE TIME BETWEEN ? AND ?', [first_time, last_time]);
        }
        connection.query(query, function (err, rows, fields) {
            if (err) {
                reject(err);
            }
            else {
                var result = rows.map((row) => {
                    return { time: row.TIME, temperature: row.TEMPERATURE, humidity: row.HUMIDITY };
                });
                // Decimate if required
                var decimationFactor = 1;
                if (result.length > 1) {
                    var diff = result.map((row, idx, arr) => {
                        if (idx == 0) {
                            return 0;
                        }
                        else {
                            return (row.time.getTime() - arr[idx - 1].time.getTime()) / 1000;
                        }
                    });
                    diff = diff.slice(1);
                    var mean = diff.reduce((total, num) => { return total + num; }) / diff.length;
                    decimationFactor = Math.ceil(req.minTimeGap / mean);
                }
                // Ensure we always return the most recent reading
                var final_mod = result.length % decimationFactor;
                result = result.filter((row, idx) => {
                    return (idx % decimationFactor == final_mod);
                });
                resolve(result);
            }
        });
    });
}
exports.read_database = read_database;
function read_csv_file(req) {
    var last_time = req.time.getTime() / 1000;
    var first_time = moment(req.time).subtract(req.timeSpan).toDate().getTime() / 1000;
    return new Promise((fulfill, reject) => {
        fs.readFile(DATA_FILE, 'utf8', (err, contents) => {
            if (err) {
                reject(err);
            }
            else {
                csv_parse(contents, (err, data) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        var firstIndex = data.length - 1;
                        var lastIndex = data.length;
                        if (!req.getLastOnly) {
                            var isInRange = data.map(d => {
                                return parseInt(d[0]) <= last_time && parseInt(d[0]) >= first_time;
                            });
                            firstIndex = isInRange.indexOf(true);
                            lastIndex = isInRange.lastIndexOf(true);
                        }
                        fulfill(data.slice(firstIndex, lastIndex));
                    }
                });
            }
        });
    });
}
exports.read_csv_file = read_csv_file;
function parse_csv_result(data) {
    return data.map(d => {
        var dat = new Date(0);
        dat.setUTCSeconds(parseFloat(d[0]));
        return {
            time: dat,
            temperature: parseFloat(d[2]),
            humidity: parseFloat(d[1])
        };
    });
}
exports.parse_csv_result = parse_csv_result;
//# sourceMappingURL=climateread.js.map