import { SqlDataAccess } from './sqlDataAccess';
import * as mssql from 'mssql';

export class SetsDataAccess extends SqlDataAccess {

    constructor(config: any){
        super(config);
    }

    insertSet(name: string, groupId: number){
        return SqlDataAccess.sqlPool.then(pool => {
            return pool.request()
            .input('name', mssql.NVarChar, name)
            .input('groupId', mssql.BigInt, groupId)
            .query(`IF NOT EXISTS(SELECT * FROM Sets WHERE SetName = @name)
            BEGIN
            INSERT INTO Sets (SetName, GroupId) VALUES (@name, @groupId) SELECT SCOPE_IDENTITY() as Id;
            END
            ELSE
            BEGIN
              SELECT Id FROM Sets WHERE SetName = @name
            END`);
        });
    }

    getSetId(name: string){
        return SqlDataAccess.sqlPool.then(pool => {
            return pool.request()
            .input('name', mssql.NVarChar, name)
            .query('SELECT Id FROM Sets WHERE SetName = @name');
        });
    }

}