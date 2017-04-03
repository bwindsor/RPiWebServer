import moment = require('moment');
import fs = require('fs');
import csv_parse = require('csv-parse');
const path = require('path');
const DATA_FILE = process.env.DATA_FILE || path.join(__dirname, 'tempoutput.txt');
import mysql = require('mysql');

export type Temperature = number;
export type Humidity = number;
export type Time = Date;

export interface IClimateRequest {
    time: Time,
    timeSpan: moment.Duration,
    minTimeGap: number
}

export interface Climate {
    time: Time,
    temperature: Temperature,
    humidity: Humidity
};

export class ClimateRequest implements IClimateRequest {
    time: Time;
    timeSpan: moment.Duration;
    minTimeGap: number;
    getLastOnly: boolean;
    constructor(time?: Time, timeSpan?: moment.Duration, minTimeGap?: number) {
        this.getLastOnly = false;
        if (time) {
            this.time = time;
        } else {
            this.time = new Date();
            this.getLastOnly = true;
        }
        if (timeSpan) {
            this.timeSpan = timeSpan;
        } else {
            this.timeSpan = moment.duration(0);
        }
        if (minTimeGap) {
            this.minTimeGap = minTimeGap;
        } else {
            this.minTimeGap = 1;
        }
    };
}

export function get_db_connection(): mysql.IConnection {
    return mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.CLIMATE_DB_NAME
    });
}

export function read_database(req: ClimateRequest): Promise<Climate[]> {

    var connection = get_db_connection();

    return new Promise<Climate[]>((resolve, reject) => {
        var query: string;
        if (req.getLastOnly) {
            query = "SELECT * FROM climate WHERE TIME = (SELECT MAX(TIME) FROM climate)";
        } else {
            var last_time = req.time.toISOString().slice(0, 19).replace('T', ' ');
            var first_time = moment(req.time).subtract(req.timeSpan).toDate().toISOString().slice(0, 19).replace('T', ' ');
            query = mysql.format('SELECT * FROM climate WHERE TIME BETWEEN ? AND ?', [first_time, last_time]);
        }
        connection.query(query, function (err, rows, fields) {
            if (err) {
                reject(err);
            } else {
                var result = rows.map((row: any) => {
                    return { time: row.TIME, temperature: row.TEMPERATURE, humidity: row.HUMIDITY };
                });

                // Decimate if required
                var decimationFactor = 1;
                if (result.length > 1) {
                    var diff: number[] = result.map((row: Climate, idx: number, arr: Climate[]) => {
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
                var final_mod = (result.length-1) % decimationFactor;
                result = result.filter((row: Climate, idx: number) => {
                    return ((idx % decimationFactor) == final_mod);
                });
                resolve(result);
            }
        });
    });
    
    
}

export function read_csv_file(req: ClimateRequest): Promise<string[][]> {
    var last_time = req.time.getTime()/1000;
    var first_time = moment(req.time).subtract(req.timeSpan).toDate().getTime()/1000;

    return new Promise<string[][]>((fulfill, reject) => {
        fs.readFile(DATA_FILE, 'utf8', (err, contents) => {
            if (err) {
                reject(err);
            } else {
                csv_parse(contents, (err : any, data : string[][] ) => {
                    if (err) {
                        reject(err);
                    } else {
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
                })
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