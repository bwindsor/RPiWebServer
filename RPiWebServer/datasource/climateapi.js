"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const climate_read = require("./climateread");
class ClimateRequest extends climate_read.ClimateRequest {
}
exports.ClimateRequest = ClimateRequest;
;
function get_climate(req) {
    return climate_read.read_database(req);
}
exports.get_climate = get_climate;
//# sourceMappingURL=climateapi.js.map