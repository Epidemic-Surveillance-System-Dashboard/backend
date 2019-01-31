import { SqlDataAccess } from './sqlDataAccess';
import * as config from 'config';
import * as mssql from 'mssql';

export class StateDataAccess extends SqlDataAccess{

    constructor(config: any){
        super(config);
    }

    insertState(name: string){
        return SqlDataAccess.sqlPool.then((pool) => {
            return pool.request()
            .input('state', mssql.NVarChar, name)
            .query(`IF NOT EXISTS(SELECT * FROM state WHERE Name = @state)
            BEGIN
              insert into state (Name) VALUES (@state) select SCOPE_IDENTITY() as Id
            END
            ELSE
            BEGIN
              SELECT Id FROM state WHERE Name = @state
            END`);
        });
    }

    getStateId(name: string){
        return SqlDataAccess.sqlPool.then(pool => {
            return pool.request()
            .input('state', mssql.NVarChar, name)
            .query('SELECT Id FROM State WHERE Name = @state;');
        });
    }
}