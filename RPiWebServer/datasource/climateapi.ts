import moment = require('moment');
import climate_read = require('./climateread');

export type Climate = climate_read.Climate;
export type IClimateRequest = climate_read.IClimateRequest;
export class ClimateRequest extends climate_read.ClimateRequest { };

export function get_climate(req: ClimateRequest): Promise<Climate[]> {
    return new Promise((resolve, reject) => {
        climate_read.read_csv_file(req).then(value => {
            resolve(climate_read.parse_csv_result(value));
        }).catch(reason => {
            reject(reason);
        });
    });

    /* These functions will be replaced by SQL reading ones */
}