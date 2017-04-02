"use strict";
const assert = require("assert");
const climate = require("../datasource/climateapi");
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
//# sourceMappingURL=climateapi.test.js.map