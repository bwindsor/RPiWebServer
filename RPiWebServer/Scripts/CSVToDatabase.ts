require('dotenv').config({ path: '../process.env' });
import mysql = require('mysql');
import climate_read = require('../datasource/climateread');
import csv_parse = require('csv-parse');
import fs = require('fs');
import util = require('util');

var connection = climate_read.get_db_connection();

var csv_contents = fs.readFileSync('../datasource/tempoutput.txt', 'utf8');

csv_parse(csv_contents, (err: any, output: string[][]) => {

    var rowStrings = output.map(row => {
        return util.format('(FROM_UNIXTIME(%s), %s, %s)', row[0], row[2], row[1]);
    });
    var query = 'INSERT INTO climate VALUES ' + rowStrings.join(', ');

    connection.query(query, function (err) {
        // Note that since multiple queries have been executed, rows and fields are arrays of the results
        // We only care about the result of the final query
        if (err) {
            console.log(err);
        } else {
            console.log('Done');
        }
        connection.end();
    });
});