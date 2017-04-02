"use strict";
const climate_read = require("./climateread");
class ClimateRequest extends climate_read.ClimateRequest {
}
exports.ClimateRequest = ClimateRequest;
;
function get_climate(req) {
    return new Promise((resolve, reject) => {
        climate_read.read_csv_file(req).then(value => {
            resolve(climate_read.parse_csv_result(value));
        }).catch(reason => {
            reject(reason);
        });
    });
    /* These functions will be replaced by SQL reading ones */
}
exports.get_climate = get_climate;
//# sourceMappingURL=climateapi.js.map