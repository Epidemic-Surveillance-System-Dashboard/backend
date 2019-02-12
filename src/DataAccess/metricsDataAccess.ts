import { SqlDataAccess } from './sqlDataAccess';
import * as mssql from 'mssql';

export class MetricsDataAccess extends SqlDataAccess {

    constructor(config: any){
        super(config);
    }

    insertMetric(name: string, setId: number){
        return SqlDataAccess.sqlPool.then(pool => {
            return pool.request()
            .input('name', mssql.NVarChar, name)
            .input('setId', mssql.BigInt, setId)
            .query(`SET TRANSACTION ISOLATION LEVEL SERIALIZABLE
            BEGIN TRAN
            IF NOT EXISTS(SELECT * FROM Metrics WHERE MetricName = @name)
            BEGIN
            INSERT INTO Metrics (MetricName, SetId) VALUES (@name, @setId) SELECT SCOPE_IDENTITY() as Id;
            END
            ELSE
            BEGIN
              SELECT Id FROM Metrics WHERE MetricName = @name
            END
            COMMIT TRAN`);
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