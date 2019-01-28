import { SqlDataAccess } from './sqlDataAccess';
import * as mssql from 'mssql';

export class WardDataAccess extends SqlDataAccess {

    constructor(config: any){
        super(JSON.parse(JSON.stringify(config)));
    }

    insertWard(name: string, lgaId: number){
        return this.sqlPool.then(pool => {
            return pool.request()
            .input('ward', mssql.NVarChar, name)
            .input('lgaId', mssql.BigInt, lgaId)
            .query('INSERT INTO Ward (Name, LGAId) VALUES (@ward, @lgaId);');
        });
    }

    getWardId(name: string){
        return this.sqlPool.then(pool => {
            return pool.request()
            .input('ward', mssql.NVarChar, name)
            .query('SELECT Id FROM Ward WHERE Name = @ward');
        });
    }

}