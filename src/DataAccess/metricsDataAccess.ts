import { SqlDataAccess } from './sqlDataAccess';
import * as mssql from 'mssql';

export class MetricsDataAccess extends SqlDataAccess {

    constructor(config: any){
        super(JSON.parse(JSON.stringify(config)));
        this.config = JSON.parse(JSON.stringify(config));
    }

    insertMetric(name: string, setId: number){
        return SqlDataAccess.sqlPool.then(pool => {
            return pool.request()
            .input('name', mssql.NVarChar, name)
            .input('setId', mssql.BigInt, setId)
            .query('INSERT INTO Metrics (MetricName, SetId) VALUES (@name, @setId);');
        });
    }

    getMetricId(name: string){
        return SqlDataAccess.sqlPool.then(pool => {
            return pool.request()
            .input('name', mssql.NVarChar, name)
            .query('SELECT Id FROM Metrics WHERE MetricName = @name');
        });
    }

}