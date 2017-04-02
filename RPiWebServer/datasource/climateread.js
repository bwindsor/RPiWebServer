"use strict";
const fs = require("fs");
const csv_parse = require("csv-parse");
const path = require('path');
const read_last_lines = require('read-last-lines');
const DATA_FILE = process.env.DATA_FILE || path.join(__dirname, 'tempoutput.txt');
;
function read_csv_file(req) {
    var num_seconds = req.timeSpan.asSeconds();
    var num_lines = Math.max(Math.ceil(num_seconds / 30), 1);
    return new Promise((fulfill, reject) => {
        fs.access(DATA_FILE, fs.constants.R_OK, (err) => {
            if (err) {
                reject(err);
            }
            else {
                read_last_lines.read(DATA_FILE, num_lines).then((lines) => {
                    csv_parse(lines, (err, data) => {
                        if (err) {
                            reject(err);
                        }
                        else {
                            fulfill(data);
                        }
                    });
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