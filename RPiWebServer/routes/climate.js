"use strict";
/*
 * GET temperature page.
 */
const express = require("express");
const climate = require("../datasource/climateapi");
const moment = require("moment");
const router = express.Router();
function send_error(res, reason) {
    res.statusCode = 500;
    if (reason) {
        res.send(reason);
    }
    else {
        res.send("Error while getting data");
    }
}
router.get('/', (req, res) => {
    climate.get_climate({ time: new Date(), timeSpan: moment.duration(0), resolution: 0 }).then(value => {
        res.render('climate', {
            time: value[0].time.toISOString(),
            temperature: value[0].temperature,
            humidity: value[0].humidity
        });
    }).catch(reason => {
        send_error(res, reason);
    });
});
router.get('/api/temperature', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    climate.get_climate({ time: new Date(), timeSpan: moment.duration(0), resolution: 0 }).then(value => {
        res.send(JSON.stringify({
            temperature: value[0].temperature
        }));
    }).catch(reason => {
        send_error(res);
    });
});
router.get('/api/humidity', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    climate.get_climate({ time: new Date(), timeSpan: moment.duration(0), resolution: 0 }).then(value => {
        res.send(JSON.stringify({
            humidity: value[0].humidity
        }));
    }).catch(reason => {
        send_error(res);
    });
});
router.get('/api/all', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    climate.get_climate({ time: new Date(), timeSpan: moment.duration(0), resolution: 0 }).then(value => {
        var jsonResponse = {
            time: value[0].time.toISOString(),
            temperature: value[0].temperature,
            humidity: value[0].humidity
        };
        res.send(JSON.stringify(jsonResponse));
    }).catch(reason => {
        send_error(res);
    });
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = router;
//# sourceMappingURL=climate.js.map