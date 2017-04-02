"use strict";
const moment = require("moment");
const climate_read = require("./climateread");
function get_climate(request) {
    var req = request;
    if (!req.timeSpan) {
        req.timeSpan = moment.duration(0);
    }
    if (!req.resolution) {
        req.resolution = 0;
    }
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