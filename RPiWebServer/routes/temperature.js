"use strict";
/*
 * GET temperature page.
 */
var express = require("express");
var router = express.Router();
router.get('/', function (req, res) {
    var temperature = 20;
    var humidity = 70;
    res.render('temperature', {
        temperature: temperature,
        humidity: humidity
    });
});
router.get('/api/temperature', function (req, res) {
    var temperature = 20;
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({
        temperature: temperature
    }));
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = router;
//# sourceMappingURL=temperature.js.map