import moment = require('moment');
import climate_read = require('./climateread');

export type Climate = climate_read.Climate;
export type IClimateRequest = climate_read.IClimateRequest;
export class ClimateRequest extends climate_read.ClimateRequest { };

export function get_climate(req: ClimateRequest): Promise<Climate[]> {
    return climate_read.read_database(req);
}