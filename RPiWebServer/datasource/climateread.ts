import moment = require('moment');
import fs = require('fs');
import csv_parse = require('csv-parse');
const path = require('path');
const read_last_lines = require('read-last-lines');
const DATA_FILE = process.env.DATA_FILE || path.join(__dirname, 'tempoutput.txt');

export type Temperature = number;
export type Humidity = number;
export type Time = Date;

export interface ClimateRequest {
    time: Time,
    timeSpan: moment.Duration,
    resolution: number
}

export interface Climate {
    time: Time,
    temperature: Temperature,
    humidity: Humidity
};

export function read_csv_file(req: ClimateRequest): Promise<string[][]> {
    var num_seconds = req.timeSpan.asSeconds();
    var num_lines = Math.max(Math.ceil(num_seconds / 30), 1);
    return new Promise<string[][]>((fulfill, reject) => {
        fs.access(DATA_FILE, fs.constants.R_OK, (err) => {
            if (err) {
                reject(err);
            } else {
                read_last_lines.read(DATA_FILE, num_lines).then((lines: string) => {
                    csv_parse(lines, (err: Error, data: string[][]) => {
                        if (err) {
                            reject(err);
                        } else {
                            fulfill(data);
                        }
                    });
                });
            }

        });
    });
}

export function parse_csv_result(data: string[][]): Climate[] {

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