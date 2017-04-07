import mysql = require('mysql');
import util = require('util');

export function get_db_connection(host?: string, user?: string, password?: string, database? : string) {
    var opts = {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.CLIMATE_DB_NAME,
        multipleStatements: true // This can mean SQL injection attacks are easier, but as long as everything is properly escaped it is fine.
    }
    if (host) {opts.host = host;}
    if (user) {opts.user = user;}
    if (password) {opts.password = password;}
    if (database) {opts.password = database;}
    return mysql.createConnection(opts);
}

export function get_mysql_connection(host?: string, user?: string, password?: string) {
    var opts = {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        multipleStatements: true
    };
    if (host) {opts.host = host;}
    if (user) {opts.user = user;}
    if (password) {opts.password = password;}
    return mysql.createConnection(opts);
}

export function create_climate_database(connection: mysql.IConnection, done:any) {
    connection.query(util.format("CREATE DATABASE %s; \
                      USE %s;\
                      CREATE TABLE climate (TIME datetime NOT NULL PRIMARY KEY, TEMPERATURE decimal(3,1), HUMIDITY decimal(3,1));", 
                      process.env.CLIMATE_DB_NAME, process.env.CLIMATE_DB_NAME),  err => {
                          if (err) {
                              done(err);
                          } else {
                              done();
                          }
                      });
}

/*
CREATE DATABASE test_climate
USE test_climate
CREATE TABLE climate (TIME datetime NOT NULL PRIMARY KEY, TEMPERATURE decimal(3,1), HUMIDITY decimal(3,1));
*/