"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config({ path: '../process.env' });
const climate_read = require("../datasource/climateread");
const csv_parse = require("csv-parse");
const fs = require("fs");
const util = require("util");
var connection = climate_read.get_db_connection();
var csv_contents = fs.readFileSync('../datasource/tempoutput.txt', 'utf8');
csv_parse(csv_contents, (err, output) => {
    var rowStrings = output.map(row => {
        return util.format('(FROM_UNIXTIME(%s), %s, %s)', row[0], row[2], row[1]);
    });
    var query = 'INSERT INTO climate VALUES ' + rowStrings.join(', ');
    connection.query(query, function (err) {
        // Note that since multiple queries have been executed, rows and fields are arrays of the results
        // We only care about the result of the final query
        if (err) {
            console.log(err);
        }
        else {
            console.log('Done');
        }
        connection.end();
    });
});
//# sourceMappingURL=CSVToDatabase.js.map