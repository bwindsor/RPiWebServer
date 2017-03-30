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
        "temperature": { "type": "number" },
        "humidity": { "type": "number" }
    }
};
router.get('/', function (req, res) {
    var temperature = climate.get_temperature();
    var humidity = climate.get_humidity();
    res.render('climate', {
        temperature: temperature,
        humidity: humidity
    });
});
router.get('/api/temperature', function (req, res) {
    var temperature = climate.get_temperature();
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
    var humidity = climate.get_humidity();
    var temperature = climate.get_temperature();
    res.setHeader('Content-Type', 'application/json');
    var jsonResponse = {
        temperature: temperature,
        humidity: humidity
    };
    var val_result = v.validate(jsonResponse, allSchema);
    if (val_result.valid) {
        res.send(JSON.stringify(jsonResponse));
    }
    else {
        res.send({ error: "Server response not valid." });
    }
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = router;
//# sourceMappingURL=climate.js.map