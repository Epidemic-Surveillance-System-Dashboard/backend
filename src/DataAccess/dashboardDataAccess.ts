import { SqlDataAccess } from './sqlDataAccess';
import * as mssql from 'mssql';

export class DashboardDataAccess extends SqlDataAccess{

    constructor(config: any){
        super(config);
    }

    insertDashboard(email: string, jsonString: string){
        return SqlDataAccess.sqlPool.then((pool) => {
            return pool.request()
            .input('email', mssql.NVarChar, email)
            .input('jsonString', mssql.NVarChar, jsonString)
            .query(`IF NOT EXISTS(SELECT * FROM Dashboard WHERE Name = @email)
            BEGIN
              insert into Dashboard (Email, JsonString) VALUES (@email, @jsonString) select SCOPE_IDENTITY() as Id
            END
            ELSE
            BEGIN
              SELECT Id FROM Dashboard WHERE Email = @email
            END`);
        });
    }

    getDashboard(email: string){
        return SqlDataAccess.sqlPool.then(pool => {
            return pool.request()
            .input('email', mssql.NVarChar, email)
            .query('SELECT * FROM Dashboard WHERE Email = @email;');
        });
    }
}