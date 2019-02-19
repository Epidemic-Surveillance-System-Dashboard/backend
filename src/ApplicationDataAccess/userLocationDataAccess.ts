import { SqlDataAccess } from '../DataAccess/sqlDataAccess';
import * as mssql from 'mssql';

export class UserLocationDataAccess extends SqlDataAccess{

    constructor(config: any){
        super(config);
    }

    public insertUserLocation(email: string, locationId: number, locationType: string, userId: number){
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

    public getUserLocation(userId: number){
        return SqlDataAccess.sqlPool.then(pool => {
            return pool.request()
            .input('userId', mssql.BigInt, userId)
            .query('SELECT * FROM UserLocation WHERE UserId = @UserId;');
        });
    }

    public updateUserLocation(userId: number, locationId: number, locationType: string){
        return SqlDataAccess.sqlPool.then(pool => {
            return pool.request()
            .input('userId', mssql.BigInt, userId)
            .input('locationId', mssql.BigInt, locationId)
            .input('locationType', mssql.NVarChar, locationType)
            .query('UPDATE UserLocation SET LocationId = @locationId, LocationType = @locationType WHERE UserId = @userId;');
        });
    }


    public getAllChildLocationIds(locationId: number, locationType: string){
        if(locationType.toLowerCase() == 'state'){
            return SqlDataAccess.sqlPool.then((pool) => {
                return pool.request()
                .input('locationId', mssql.BigInt, locationId)
                .query(`SELECT l.Id AS LGAId, w.Id AS WardId, f.Id AS FacilityId FROM (
                (SELECT * FROM LGA l WHERE l.StateId = @locationId) AS l
                LEFT JOIN Ward w ON l.Id = w.LGAId 
                LEFT JOIN Facility f ON w.Id = f.WardId);`);
            });
        }
        else if(locationType.toLowerCase() == 'lga'){
            return SqlDataAccess.sqlPool.then((pool) => {
                return pool.request()
                .input('locationId', mssql.BigInt, locationId)
                .query(`SELECT w.Id AS WardId, f.Id AS FacilityId FROM (
                    (SELECT * FROM Ward w WHERE w.LGAId = @locationId) AS w
                    LEFT JOIN Facility f ON w.Id = f.WardId);`);
            });
        }
        else if(locationType.toLowerCase() == 'ward'){
            return SqlDataAccess.sqlPool.then((pool) => {
                return pool.request()
                .input('locationId', mssql.BigInt, locationId)
                .query(`SELECT Id as FacilityId FROM Facility WHERE WardId = @locationId;`);
            });
        }
        else if(locationType.toLowerCase() == 'facility'){
            return SqlDataAccess.sqlPool.then((pool) => {
                return pool.request()
                .input('locationId', mssql.BigInt, locationId)
                .query(`SELECT Id as FacilityId FROM Facility WHERE WardId = @locationId;`);
            });
        }
    }

    public getUserIdsFromLocationIds(locationIds){
        return SqlDataAccess.sqlPool.then((pool) => {     
            var request = pool.request();
            var lgaIdsInQuery = this.parameterizeInQuery(request, 'LocationId', locationIds.lgaIds, mssql.BigInt, 'lgaId');
            var wardIdsInQuery = this.parameterizeInQuery(request, 'LocationId', locationIds.wardIds, mssql.BigInt, 'wardId');
            var facilityIdsInQuery = this.parameterizeInQuery(request, 'LocationId', locationIds.facilityIds, mssql.BigInt, 'facilityId');
            
            return request
                .query(`SELECT UserId FROM UserLocation WHERE (${lgaIdsInQuery} AND LocationType = 'LGA') OR 
                (${wardIdsInQuery} AND LocationType = 'Ward') OR 
                (${facilityIdsInQuery} AND LocationType = 'Facility');`);
        });
    }
}