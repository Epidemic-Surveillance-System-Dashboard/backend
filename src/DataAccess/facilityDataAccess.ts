import { SqlDataAccess } from './sqlDataAccess';
import * as mssql from 'mssql';

export class FacilityDataAccess extends SqlDataAccess {

    constructor(config: any){
        super(config);
    }

    insertFacility(name: string, wardId: number){
        return SqlDataAccess.sqlPool.then(pool => {
            return pool.request()
            .input('facility', mssql.NVarChar, name)
            .input('wardId', mssql.BigInt, wardId)
            .query(`SET TRANSACTION ISOLATION LEVEL SERIALIZABLE
            BEGIN TRAN
            IF NOT EXISTS(SELECT * FROM Facility WHERE Name = @facility)
            BEGIN
                INSERT INTO Facility (Name, WardId) VALUES (@facility, @wardId) SELECT SCOPE_IDENTITY() as Id;
            END
            ELSE
            BEGIN
              SELECT Id FROM Facility WHERE Name = @facility
            END
            COMMIT TRAN`);
        });
    }

    getFacilityId(name: string){
        return SqlDataAccess.sqlPool.then(pool => {
            return pool.request()
            .input('facility', mssql.NVarChar, name)
            .query('SELECT Id FROM Facility WHERE Name = @facility');
        });
    }

}