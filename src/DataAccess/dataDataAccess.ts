import { SqlDataAccess } from './sqlDataAccess';
import * as mssql from 'mssql';

export class DataDataAccess extends SqlDataAccess {

    constructor(config: any){
        super(config);
    }

    insertData(metricId: number, facilityViewId: number, data: number, date: Date){
        return SqlDataAccess.sqlPool.then(pool => {
            return pool.request()
            .input('metricId', mssql.BigInt, metricId)
            .input('facilityViewId', mssql.BigInt, facilityViewId)
            .input('data', mssql.BigInt, data)
            .input('date', mssql.DateTime, date)
            .query(`IF NOT EXISTS(SELECT * FROM Data WHERE MetricId = @metricId AND FacilityId = @facilityViewId AND VALUE = @data)
            BEGIN
            INSERT INTO Data (MetricId, FacilityId, Value, Time) VALUES (@metricId, @facilityViewId, @data, @date); SELECT SCOPE_IDENTITY() as Id;
            END`);
        });
    }
}