import moment = require('moment');
import climate_read = require('./climateread');

export type Climate = climate_read.Climate;
export type ClimateRequest = climate_read.ClimateRequest;

export function get_climate(request: ClimateRequest): Promise<Climate[]> {
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