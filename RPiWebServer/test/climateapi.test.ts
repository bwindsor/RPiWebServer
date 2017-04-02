import assert = require('assert');
import climate = require('../datasource/climateapi');
import moment = require('moment');

describe('climateapi', () => {
    describe('get_climate()', () => {
        it('should return one result with latest time request', () => {
            var req = new climate.ClimateRequest();
            return climate.get_climate(req).then(result => {
                assert.equal(result.length, 1, "Actual length was " + result.length.toString());
            });
        });
    });
});