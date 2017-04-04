/*
 * GET temperature page.
 */
import express = require('express');
import climate = require('../datasource/climateapi');
import moment = require('moment');
const router = express.Router();

function send_error(res: express.Response, reason?: any) {
    res.statusCode = 500;
    if (reason) {
        res.send(JSON.stringify({ error: reason }));
    } else {
        res.send(JSON.stringify({ error: "Error while getting data" }));
    }
}

router.get('/', (req: express.Request, res: express.Response) => {
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

router.get('/api/temperature', (req: express.Request, res: express.Response) => {
    res.setHeader('Content-Type', 'application/json');
    climate.get_climate(new climate.ClimateRequest()).then(value => {
        if (value.length) {
            res.send(JSON.stringify({
                temperature: value[0].temperature
            }));
        } else {
            res.send(JSON.stringify({ }));
        }
    }).catch(reason => {
        send_error(res);
    });
});

router.get('/api/humidity', (req: express.Request, res: express.Response) => {
    res.setHeader('Content-Type', 'application/json');
    climate.get_climate(new climate.ClimateRequest()).then(value => {
        res.send(JSON.stringify({
            humidity: value[0].humidity
        }));
    }).catch(reason => {
        send_error(res);
    });
});

router.get('/api/all', (req: express.Request, res: express.Response) => {
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

router.get('/api/since', (req: express.Request, res: express.Response) => {
    res.setHeader('Content-Type', 'application/json');
    var since = parseInt(req.query.time);
    if (Number.isNaN(since)) {
        res.status(400).send(JSON.stringify({ error: "Input query not valid" }));
        return;
    }
    var timeNow = new Date();
    var timeDiff = timeNow.getTime() / 1000 - since;
    climate.get_climate(new climate.ClimateRequest(new Date(), moment.duration(timeDiff, 'seconds'))).then(value => {
        var jsonResponse = value.map(d => {
            return {
                time: d.time.toISOString(),
                temperature: d.temperature,
                humidity: d.humidity
            };
        });
        res.send(JSON.stringify(jsonResponse));
    }).catch(reason => {
        send_error(res);
    });
});

export default router;