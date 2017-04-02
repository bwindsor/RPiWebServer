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
        res.send(reason);
    } else {
        res.send("Error while getting data");
    }
}

router.get('/', (req: express.Request, res: express.Response) => {
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

router.get('/api/temperature', (req: express.Request, res: express.Response) => {
    res.setHeader('Content-Type', 'application/json');
    climate.get_climate({ time: new Date(), timeSpan: moment.duration(0), resolution: 0 }).then(value => {
        res.send(JSON.stringify({
            temperature: value[0].temperature
        }));
    }).catch(reason => {
        send_error(res);
    });
});

router.get('/api/humidity', (req: express.Request, res: express.Response) => {
    res.setHeader('Content-Type', 'application/json');
    climate.get_climate({ time: new Date(), timeSpan: moment.duration(0), resolution: 0 }).then(value => {
        res.send(JSON.stringify({
            humidity: value[0].humidity
        }));
    }).catch(reason => {
        send_error(res);
    });
});

router.get('/api/all', (req: express.Request, res: express.Response) => {
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

export default router;