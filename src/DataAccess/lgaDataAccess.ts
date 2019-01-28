import { SqlDataAccess } from './sqlDataAccess';
import * as mssql from 'mssql';

export class LGADataAccess extends SqlDataAccess {

    constructor(config: any){
        super(JSON.parse(JSON.stringify(config)));
    }

    insertLGA(name: string, stateId: number){
        return SqlDataAccess.sqlPool.then(pool => {
            return pool.request()
            .input('lga', mssql.NVarChar, name)
            .input('stateId', mssql.BigInt, stateId)
            .query('INSERT INTO LGA (Name, StateId) VALUES (@lga, @stateId);');
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