/** @module helpers/climate */
import fs = require('fs');
import csv_parse = require('csv-parse');
const path = require('path');
const read_last_lines = require('read-last-lines');
const DATA_FILE = process.env.DATA_FILE || path.join(__dirname, 'tempoutput.txt');
/** The name of the module. */
export const name = 'climate';

/**
 * Reads the last line from a CSV file
@return Promise<string>
 */
function read_last_line() {
    return new Promise<string[]>((fulfill, reject) => {
        fs.access(DATA_FILE, fs.constants.R_OK, (err) => {
            if (err) {
                reject(err);
            } else {
                read_last_lines.read(DATA_FILE, 1).then((lines: string) => {
                    csv_parse(lines, (err: Error, data: string[][]) => {
                        if (err) {
                            reject(err);
                        } else {
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
export function get_temperature() {
    return new Promise<number>((resolve, reject) => {
        read_last_line().then( value => {
            resolve(parseFloat(value[2]));
        }).catch(reason => {
            reject(reason);
        })
    });
}

/** Gets the most recently read humidity */
export function get_humidity() {
    return new Promise<number>((resolve, reject) => {
        read_last_line().then((value: string[]) => {
            resolve(parseFloat(value[1]));
        }).catch(reason => {
            reject(reason);
        })
    });
}

/** Gets the most recently read time
@return Promise<Date> */
export function get_time() {
    return new Promise<Date>((resolve, reject) => {
        read_last_line().then((value: string[]) => {
            var d = new Date(0);
            d.setUTCSeconds(parseFloat(value[0]));
            resolve(d);
        }).catch(reason => {
            reject(reason);
        })
    });
}