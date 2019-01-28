import { SqlDataAccess } from './sqlDataAccess';
import * as mssql from 'mssql';

export class GroupsDataAccess extends SqlDataAccess {

    constructor(config: any){
        super(JSON.parse(JSON.stringify(config)));
    }

    insertGroup(name: string){
        return SqlDataAccess.sqlPool.then(pool => {
            return pool.request()
            .input('name', mssql.NVarChar, name)
            .query('INSERT INTO Groups (GroupName) VALUES (@name);');
        });
    }

    getGroupId(name: string){
        return SqlDataAccess.sqlPool.then(pool => {
            return pool.request()
            .input('name', mssql.NVarChar, name)
            .query('SELECT Id FROM Groups WHERE GroupName = @name');
        });
    }

}