"use strict";
const moment = require("moment");
const fs = require("fs");
const csv_parse = require("csv-parse");
const path = require('path');
const DATA_FILE = process.env.DATA_FILE || path.join(__dirname, 'tempoutput.txt');
;
class ClimateRequest {
    constructor(time, timeSpan, resolution) {
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
        if (resolution) {
            this.resolution = resolution;
        }
        else {
            this.resolution = 0;
        }
    }
    ;
}
exports.ClimateRequest = ClimateRequest;
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