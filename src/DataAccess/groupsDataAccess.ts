import { SqlDataAccess } from './sqlDataAccess';
import * as mssql from 'mssql';

export class GroupsDataAccess extends SqlDataAccess {

    constructor(config: any){
        super(config);
    }

    public insertGroup(name: string){
        return this.retryQuery( () => {
            return SqlDataAccess.sqlPool.then(pool => {
                return pool.request()
                .input('name', mssql.NVarChar, name)
                .query(`SET TRANSACTION ISOLATION LEVEL SERIALIZABLE
                BEGIN TRAN
                IF NOT EXISTS(SELECT * FROM Groups WHERE GroupName = @name)
                BEGIN
                    INSERT INTO Groups (GroupName) VALUES (@name); SELECT SCOPE_IDENTITY() as Id
                END
                ELSE
                BEGIN
                  SELECT Id FROM Groups WHERE GroupName = @name
                END
                COMMIT TRAN`);
            });
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