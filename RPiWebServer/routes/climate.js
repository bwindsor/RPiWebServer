"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
        res.send(JSON.stringify({ error: reason }));
    }
    else {
        res.send(JSON.stringify({ error: "Error while getting data" }));
    }
}
router.get('/', (req, res) => {
    climate.get_climate(new climate.ClimateRequest()).then(value => {
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
    climate.get_climate(new climate.ClimateRequest()).then(value => {
        if (value.length) {
            res.send(JSON.stringify({
                temperature: value[0].temperature
            }));
        }
        else {
            res.send(JSON.stringify({}));
        }
    }).catch(reason => {
        send_error(res);
    });
});
router.get('/api/humidity', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    climate.get_climate(new climate.ClimateRequest()).then(value => {
        res.send(JSON.stringify({
            humidity: value[0].humidity
        }));
    }).catch(reason => {
        send_error(res);
    });
});
router.get('/api/all', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    climate.get_climate(new climate.ClimateRequest()).then(value => {
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
router.get('/api/since', (req, res) => {
    var timeNow = new Date();
    var dataType;
    if (req.query.dataType) {
        switch (req.query.dataType) {
            case "json":
                dataType = "json";
                break;
            case "binary":
                dataType = "binary";
                break;
            default:
                res.status(400).send(JSON.stringify({ error: "Requested data type invalid" }));
        }
    }
    else {
        dataType = "json";
    }
    var since = parseInt(req.query.time);
    if (isNaN(since)) {
        res.status(400).send(JSON.stringify({ error: "Input query not valid" }));
        return;
    }
    var timeDiff = timeNow.getTime() / 1000 - since;
    climate.get_climate(new climate.ClimateRequest(new Date(), moment.duration(timeDiff, 'seconds'))).then(value => {
        switch (dataType) {
            case "json":
                res.setHeader('Content-Type', 'application/json');
                var jsonResponse = value.map(d => {
                    return {
                        time: d.time.toISOString(),
                        temperature: d.temperature,
                        humidity: d.humidity
                    };
                });
                res.send(JSON.stringify(jsonResponse));
                break;
            case "binary":
                res.setHeader('Content-Type', 'application/octet-stream');
                /*
                var data = value.reduce((a, b) => {
                    // Time is uint32, temperature is int16, humidity is int16
                    // TODO - put these into a data stream
                    
                });
                */
                res.send('Not implemented');
                break;
        }
    }).catch(reason => {
        send_error(res);
    });
});
exports.default = router;
//# sourceMappingURL=climate.js.map