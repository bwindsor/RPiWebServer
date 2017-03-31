"use strict";
/*
 * GET temperature page.
 */
var express = require("express");
var validator = require("jsonschema");
var climate = require("../helpers/climate");
var router = express.Router();
var v = new validator.Validator();
var allSchema = {
    "type": "object", "properties": {
        "time": { "type": "string", "format": "date-time" },
        "temperature": { "type": "number" },
        "humidity": { "type": "number" }
    }
};
router.get('/', function (req, res) {
    // Need to use promises here to wait for all three!
    /*
    var temperature = climate.get_temperature();
    var humidity = climate.get_humidity();
    var time = climate.get_time();
    res.render('climate', {
        time: time.toISOString(),
        temperature: temperature,
        humidity: humidity
    });
    */
    climate.get_temperature(function (err, temperature) {
        if (err) {
            res.send("Error reading temperature.");
            return;
        }
        var humidity = climate.get_humidity();
        var time = climate.get_time();
        res.render('climate', {
            time: time.toISOString(),
            temperature: temperature,
            humidity: humidity
        });
    });
});
router.get('/api/temperature', function (req, res) {
    var temperature = climate.get_temperature(function (err, temperature) { });
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({
        temperature: temperature
    }));
});
router.get('/api/humidity', function (req, res) {
    var humidity = climate.get_humidity();
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({
        humidity: humidity
    }));
});
router.get('/api/all', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    var jsonResponse = {
        time: climate.get_time().toISOString(),
        temperature: climate.get_temperature(function (err, temperature) { }),
        humidity: climate.get_humidity()
    };
    var val_result = v.validate(jsonResponse, allSchema);
    if (val_result.valid) {
        res.send(JSON.stringify(jsonResponse));
    }
    else {
        res.send(val_result.errors);
    }
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = router;
//# sourceMappingURL=climate.js.map