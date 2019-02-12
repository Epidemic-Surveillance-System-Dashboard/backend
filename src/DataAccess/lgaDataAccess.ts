import { SqlDataAccess } from './sqlDataAccess';
import * as mssql from 'mssql';

export class LGADataAccess extends SqlDataAccess {

    constructor(config: any){
        super(config);
    }

    insertLGA(name: string, stateId: number){
        return SqlDataAccess.sqlPool.then(pool => {
            return pool.request()
            .input('lga', mssql.NVarChar, name)
            .input('stateId', mssql.BigInt, stateId)
            .query(`SET TRANSACTION ISOLATION LEVEL SERIALIZABLE
            BEGIN TRAN
            IF NOT EXISTS(SELECT * FROM LGA WHERE Name = @lga)
            BEGIN
            INSERT INTO LGA (Name, StateId) VALUES (@lga, @stateId) SELECT SCOPE_IDENTITY() as Id
            END
            ELSE
            BEGIN
              SELECT Id FROM LGA WHERE Name = @lga
            END
            COMMIT TRAN`);
        });
    }

    getLGAId(name: string){
        return SqlDataAccess.sqlPool.then(pool => {
            return pool.request()
            .input('lga', mssql.NVarChar, name)
            .query('SELECT Id FROM LGA WHERE Name = @lga;');
        });
    }

}