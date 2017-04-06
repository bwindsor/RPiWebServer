"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mysql = require("mysql");
function get_db_connection() {
    return mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.CLIMATE_DB_NAME,
        multipleStatements: true // This can mean SQL injection attacks are easier, but as long as everything is properly escaped it is fine.
    });
}
exports.get_db_connection = get_db_connection;
/*
CREATE DATABASE test_climate
USE test_climate
CREATE TABLE climate (TIME datetime NOT NULL PRIMARY KEY, TEMPERATURE decimal(3,1), HUMIDITY decimal(3,1));
*/ 
//# sourceMappingURL=db_access.js.map