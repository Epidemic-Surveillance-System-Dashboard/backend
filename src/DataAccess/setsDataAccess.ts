import { SqlDataAccess } from './sqlDataAccess';
import * as mssql from 'mssql';

export class SetsDataAccess extends SqlDataAccess {

    constructor(config: any){
        super(JSON.parse(JSON.stringify(config)));
    }

    insertSet(name: string, groupId: number){
        return SqlDataAccess.sqlPool.then(pool => {
            return pool.request()
            .input('name', mssql.NVarChar, name)
            .input('groupId', mssql.BigInt, groupId)
            .query('INSERT INTO Sets (SetName, GroupId) VALUES (@name, @groupId);');
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