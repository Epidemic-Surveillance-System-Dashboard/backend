import { SqlDataAccess } from './sqlDataAccess';
import * as mssql from 'mssql';

export class FacilityDataAccess extends SqlDataAccess {

    constructor(config: any){
        super(JSON.parse(JSON.stringify(config)));
    }

    insertFacility(name: string, wardId: number){
        return this.sqlPool.then(pool => {
            return pool.request()
            .input('facility', mssql.NVarChar, name)
            .input('wardId', mssql.BigInt, wardId)
            .query('INSERT INTO Facility (Name, WardId) VALUES (@facility, @wardId);');
        });
    }

    getFacilityId(name: string){
        return this.sqlPool.then(pool => {
            return pool.request()
            .input('facility', mssql.NVarChar, name)
            .query('SELECT Id FROM Facility WHERE Name = @facility');
        });
    }

}