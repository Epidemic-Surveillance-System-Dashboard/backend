import { SqlDataAccess } from './sqlDataAccess';
import * as mssql from 'mssql';

export class GroupsDataAccess extends SqlDataAccess {

    constructor(config: any){
        super(config);
    }

    insertGroup(name: string){
        return SqlDataAccess.sqlPool.then(pool => {
            return pool.request()
            .input('name', mssql.NVarChar, name)
            .query(`IF NOT EXISTS(SELECT * FROM Groups WHERE GroupName = @name)
            BEGIN
                INSERT INTO Groups (GroupName) VALUES (@name); SELECT SCOPE_IDENTITY() as Id
            END
            ELSE
            BEGIN
              SELECT Id FROM Groups WHERE GroupName = @name
            END`);
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