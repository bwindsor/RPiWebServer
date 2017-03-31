/*
 * GET temperature page.
 */
import express = require('express');
import validator = require('jsonschema');
import climate = require('../helpers/climate');
const router = express.Router();

var v = new validator.Validator();
var allSchema = {
    "type": "object", "properties": {
        "time": { "type": "string", "format": "date-time" },
        "temperature": { "type": "number" },
        "humidity": { "type": "number" }
    }
};

router.get('/', (req: express.Request, res: express.Response) => {
    // Need to use promises here to wait for all three!
    var temperature = climate.get_temperature();
    var humidity = climate.get_humidity();
    var time = climate.get_time();
    res.render('climate', {
        time: time.toISOString(),
        temperature: temperature,
        humidity: humidity
    });
});

router.get('/api/temperature', (req: express.Request, res: express.Response) => {
    var temperature = climate.get_temperature();
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({
        temperature: temperature
    }));
});

router.get('/api/humidity', (req: express.Request, res: express.Response) => {
    var humidity = climate.get_humidity();
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({
        humidity: humidity
    }));
});

router.get('/api/all', (req: express.Request, res: express.Response) => {
    res.setHeader('Content-Type', 'application/json');
    var jsonResponse = {
        time: climate.get_time().toISOString(),
        temperature: climate.get_temperature(),
        humidity: climate.get_humidity()
    };
    var val_result = v.validate(jsonResponse, allSchema);
    if (val_result.valid) {
        res.send(JSON.stringify(jsonResponse));
    } else {
        res.send(val_result.errors);
    }
});

export default router;