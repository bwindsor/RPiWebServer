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
    var temp_promise = climate.get_temperature();
    var hum_promise = climate.get_humidity();
    var time_promise = climate.get_time();
    Promise.all([temp_promise, hum_promise, time_promise]).then(values => {
        res.render('climate', {
            time: values[2].toISOString(),
            temperature: values[0],
            humidity: values[1]
        });
    }).catch( err => {
        res.send("Error whilst getting data");
    });
    
});

router.get('/api/temperature', (req: express.Request, res: express.Response) => {
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

router.get('/api/humidity', (req: express.Request, res: express.Response) => {
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

router.get('/api/all', (req: express.Request, res: express.Response) => {
    
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

export default router;