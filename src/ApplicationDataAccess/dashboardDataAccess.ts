import { SqlDataAccess } from '../DataAccess/sqlDataAccess';
import * as mssql from 'mssql';

export class DashboardDataAccess extends SqlDataAccess{

    constructor(config: any){
        super(config);
    }

    public insertDashboardConfig(email: string, dashboardJson: string, userId: number){
        return SqlDataAccess.sqlPool.then((pool) => {
            return pool.request()
            .input('email', mssql.NVarChar, email)
            .input('dashboardJson', mssql.NVarChar, dashboardJson)
            .input('userId', mssql.BigInt, userId)
            .query(`IF NOT EXISTS(SELECT * FROM Dashboard WHERE UserId = @userId)
            BEGIN
              INSERT INTO Dashboard (Email, DashboardJson, UserId) VALUES (@email, @dashboardJson, @userId) select SCOPE_IDENTITY() as Id
            END
            ELSE
            BEGIN
              SELECT Id FROM Dashboard WHERE UserId = @userId
            END`);
        });
    }

    public getDashboardConfig(userId: number){
        return SqlDataAccess.sqlPool.then(pool => {
            return pool.request()
            .input('userId', mssql.BigInt, userId)
            .query('SELECT * FROM Dashboard WHERE UserId = @UserId;');
        });
    }

    public updateDashboardConfig(userId: number, dashboardJson: string){
        return SqlDataAccess.sqlPool.then(pool => {
            return pool.request()
            .input('userId', mssql.BigInt, userId)
            .input('dashboardJson', mssql.NVarChar, dashboardJson)
            .query('UPDATE Dashboard SET DashboardJson = @dashboardJson WHERE UserId = @userId;');
        });
    }
}