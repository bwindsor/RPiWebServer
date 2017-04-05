﻿import moment = require('moment');
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
    resultLimit: number
}

export interface Climate {
    time: Time,
    temperature: Temperature,
    humidity: Humidity
};

export class ClimateRequest implements IClimateRequest {
    time: Time;
    timeSpan: moment.Duration;
    resultLimit: number;
    getLastOnly: boolean;
    constructor(time?: Time, timeSpan?: moment.Duration, resultLimit?: number) {
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
        if (resultLimit) {
            this.resultLimit = resultLimit;
        } else {
            this.resultLimit = 2000;
        }
    };
}

export function get_db_connection(): mysql.IConnection {
    return mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.CLIMATE_DB_NAME,
        multipleStatements: true            // This can mean SQL injection attacks are easier, but as long as everything is properly escaped it is fine.
    });
}

export function read_database(req: ClimateRequest): Promise<Climate[]> {

    var connection = get_db_connection();
    return new Promise<Climate[]>((resolve, reject) => {
        var query: string;
        var num_queries: number;
        if (req.getLastOnly) {
            query = "SELECT * FROM climate WHERE TIME = (SELECT MAX(TIME) FROM climate)";
            num_queries = 1;
        } else {
            var last_time = req.time.toISOString().slice(0, 19).replace('T', ' ');
            var first_time = moment(req.time).subtract(req.timeSpan).toDate().toISOString().slice(0, 19).replace('T', ' ');
            query = mysql.format( 
            "SET @num_rows = (SELECT COUNT(*) FROM climate WHERE TIME BETWEEN ? AND ?); \
            SET @row_number = 0; \
            SET @dec_fac = CEILING(@num_rows / ?); \
            SELECT TIME, TEMPERATURE, HUMIDITY FROM \
                (SELECT *, (@row_number:=@row_number+1) AS row FROM climate WHERE TIME BETWEEN ? AND ? ORDER BY TIME ASC) AS t \
                WHERE row%@dec_fac=@num_rows%@dec_fac;",
                [first_time, last_time, req.resultLimit, first_time, last_time]);
            num_queries = 4;
        }
        connection.query(query, function (err, rows_all, fields) {
            // Note that since multiple queries have been executed, rows and fields are arrays of the results
            // We only care about the result of the final query
            if (num_queries > 1) {
                var rows = rows_all[rows_all.length - 1];
            } else {
                var rows = rows_all;
            }
            if (err) {
                reject(err);
            } else {
                var result = rows.map((row: any) => {
                    return { time: row.TIME, temperature: row.TEMPERATURE, humidity: row.HUMIDITY };
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
