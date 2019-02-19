import { SqlDataAccess } from '../DataAccess/sqlDataAccess';
import * as mssql from 'mssql';

export class UserLocationDataAccess extends SqlDataAccess{

    constructor(config: any){
        super(config);
    }

    insertUserLocation(email: string, locationId: number, locationType: string, userId: number){
        return SqlDataAccess.sqlPool.then((pool) => {
            return pool.request()
            .input('email', mssql.NVarChar, email)
            .input('locationId', mssql.BigInt, locationId)
            .input('locationType', mssql.NVarChar, locationType)
            .input('userId', mssql.BigInt, userId)
            .query(`IF NOT EXISTS(SELECT * FROM UserLocation WHERE Email = @email)
            BEGIN
              INSERT INTO UserLocation (Email, LocationId, LocationType, UserId) VALUES (@email, @locationId, @locationType, @userId) select SCOPE_IDENTITY() as Id
            END
            ELSE
            BEGIN
              SELECT Id FROM UserLocation WHERE Email = @email
            END`);
        });
    }

    getUserLocation(userId: number){
        return SqlDataAccess.sqlPool.then(pool => {
            return pool.request()
            .input('userId', mssql.BigInt, userId)
            .query('SELECT * FROM UserLocation WHERE UserId = @UserId;');
        });
    }

    updateUserLocation(userId: number, locationId: number, locationType: string){
        return SqlDataAccess.sqlPool.then(pool => {
            return pool.request()
            .input('userId', mssql.BigInt, userId)
            .input('locationId', mssql.BigInt, locationId)
            .input('locationType', mssql.NVarChar, locationType)
            .query('UPDATE UserLocation SET LocationId = @locationId, LocationType = @locationType WHERE UserId = @userId;');
        });
    }
}