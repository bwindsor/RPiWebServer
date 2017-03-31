"use strict";
/*
 * GET temperature page.
 */
const express = require("express");
const validator = require("jsonschema");
const climate = require("../helpers/climate");
const router = express.Router();
var v = new validator.Validator();
var allSchema = {
    "type": "object", "properties": {
        "time": { "type": "string", "format": "date-time" },
        "temperature": { "type": "number" },
        "humidity": { "type": "number" }
    }
};
router.get('/', (req, res) => {
    // Need to use promises here to wait for all three!
    var temp_promise = climate.get_temperature();
    var hum_promise = climate.get_humidity();
    var time_promise = climate.get_time();
    Promise.all([temp_promise, hum_promise, time_promise]).then(values => {
        res.render('climate', {
            time: values[2].toISOString(),
            temperature: values[0],
            humidity: values[1]
        });
    }).catch(err => {
        res.send("Error whilst getting data");
    });
});
router.get('/api/temperature', (req, res) => {
    climate.get_temperature().then(temperature => {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({
            temperature: temperature
        }));
    }).catch(err => {
        res.send(JSON.stringify({
            error: "Error getting the temperature"
        }));
    });
});
router.get('/api/humidity', (req, res) => {
    climate.get_humidity().then(humidity => {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({
            humidity: humidity
        }));
    }).catch(err => {
        res.send(JSON.stringify({
            error: "Error whilst getting the humidity"
        }));
    });
});
router.get('/api/all', (req, res) => {
    var temp_promise = climate.get_temperature();
    var hum_promise = climate.get_humidity();
    var time_promise = climate.get_time();
    Promise.all([temp_promise, hum_promise, time_promise]).then(values => {
        res.setHeader('Content-Type', 'application/json');
        var jsonResponse = {
            time: values[2].toISOString(),
            temperature: values[0],
            humidity: values[1]
        };
        res.send(JSON.stringify(jsonResponse));
    }).catch(err => {
        res.send("Error whilst getting data");
    });
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = router;
//# sourceMappingURL=climate.js.map