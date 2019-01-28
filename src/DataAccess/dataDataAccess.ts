import { SqlDataAccess } from './sqlDataAccess';
import * as mssql from 'mssql';

export class DataDataAccess extends SqlDataAccess {

    constructor(config: any){
        super(JSON.parse(JSON.stringify(config)));
    }

    insertData(metricId: number, facilityViewId: number, data: number, date: Date){
        return this.sqlPool.then(pool => {
            return pool.request()
            .input('metricId', mssql.BigInt, metricId)
            .input('facilityViewId', mssql.BigInt, facilityViewId)
            .input('data', mssql.BigInt, data)
            .input('date', mssql.DateTime, date)
            .query('INSERT INTO Data (MetricId, FacilityId, Value, Time) VALUES (@metricId, @facilityViewId, @data, @date)');
        });
    }
}