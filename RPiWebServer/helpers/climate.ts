/** @module helpers/climate */
const fs = require('fs');
const csv_parse = require('csv-parse');
const read_last_lines = require('read-last-lines');
const DATA_FILE = process.env.DATA_FILE || "C:\\Users\\BenJW\\OneDrive\\Documents\\Visual Studio 2017\\Projects\\RPiWebServer\\RPiWebServer\\helpers\\tempoutput.txt";

/** The name of the module. */
export const name = 'climate';

/** Gets the most recently read temperature 
@return {integer} temperature */
export function get_temperature(cb) {
    fs.access(DATA_FILE, fs.constants.R_OK, (err) => {
        if (err) {
            cb(err);
        } else {
            read_last_lines.read(DATA_FILE, 1).then((lines) => {
                csv_parse(lines, (err, data) => {
                    if (err) {
                        cb(err);
                    } else {
                        cb(null, data[0][3]);
                    }
                });
            });
        }
        
    });
}

/** Gets the most recently read humidity */
export function get_humidity() {
    return 70;
}

/** Gets the most recently read time */
export function get_time() {
    var d = new Date(0);
    d.setUTCSeconds(1490916570);
    return d;
}