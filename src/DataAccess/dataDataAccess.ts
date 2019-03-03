import { SqlDataAccess } from './sqlDataAccess';
import * as mssql from 'mssql';

export class DataDataAccess extends SqlDataAccess {

    constructor(config: any){
        super(config);
    }

    private static counter = 0;

    insertData(metricId: number, facilityViewId: number, data: number, date: Date){
        DataDataAccess.counter++;
        return this.retryQuery(() => {
            return SqlDataAccess.sqlPool.then(pool => {
                return pool.request()
                .input('metricId', mssql.BigInt, metricId)
                .input('facilityViewId', mssql.BigInt, facilityViewId)
                .input('data', mssql.BigInt, data)
                .input('date', mssql.DateTime, date)
                //.input('counter', mssql.Int, DataDataAccess.counter)
                .query(`IF NOT EXISTS(SELECT * FROM Data WHERE MetricId = @metricId AND FacilityId = @facilityViewId AND VALUE = @data)
                BEGIN

                INSERT INTO Data (MetricId, FacilityId, Value, Time) VALUES (@metricId, @facilityViewId, @data, @date); SELECT SCOPE_IDENTITY() as Id;
                END`);
            });
        });
        
    }
}