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
        "temperature": { "type": "number" },
        "humidity": { "type": "number" }
    }
};

router.get('/', (req: express.Request, res: express.Response) => {
    var temperature = climate.get_temperature();
    var humidity = climate.get_humidity();
    res.render('climate', {
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
    } else {
        res.send({error: "Server response not valid."});
    }
});

export default router;