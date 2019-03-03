import { SqlDataAccess } from '../DataAccess/sqlDataAccess';
import * as mssql from 'mssql';
import * as config from 'config';

export class DataByLocationAccess extends SqlDataAccess {

    constructor(config: any){
        super(config);
    }

    getDataByLocation(state: string, lga: string, ward: string, facility: string) {
        
        if (state != null && lga == null && ward == null && facility == null) {
            return this.getDataByState(state);
        } 
        else if (state != null && lga != null && ward == null && facility == null) {
            return this.getDataByLga(state, lga);
        } 
        else if (state != null && lga != null && ward != null && facility == null) {
            return this.getDataByWard(state, lga, ward);
        } 
        else if (state != null && lga != null && ward != null && facility != null) {
            return this.getDataByFacility(state, lga, ward, facility);
        } 
        else {
            return Promise.resolve(null);
        }
    }

    getDataByState(state: string) {
        return SqlDataAccess.sqlPool.then(pool => {
            return pool.request()
            .query("Select * FROM Data WHERE FacilityId IN (Select FacilityId FROM FacilityView WHERE StateName = '" + state + "');"
            /*+`Select * FROM "Sets";
            Select * FROM Groups;
            Select * FROM Metrics;`*/
            );            
        });
    }

    getDataByLga(state: string, lga: string) {
        return SqlDataAccess.sqlPool.then(pool => {
            return pool.request()
            .query(`Select * FROM Data WHERE FacilityId IN (Select FacilityId FROM FacilityView WHERE StateName = '${state}' AND LGAName = '${lga}');`
            // .query(
            // "Select * FROM Data WHERE FacilityId IN (Select Id FROM FacilityView WHERE LGAId = (Select Id FROM LGA WHERE \"Name\" = '" + lga + "' AND StateId = (Select Id FROM State WHERE \"Name\" = '" + state + "')))"
            /*+`Select * FROM "Sets";
            Select * FROM Groups;
            Select * FROM Metrics;`*/
            );            
        });
    }

    getDataByWard(state: string, lga: string, ward: string) {
        return SqlDataAccess.sqlPool.then(pool => {
            return pool.request()
            .query(`Select * FROM Data WHERE FacilityId IN (Select FacilityId FROM FacilityView WHERE StateName = '${state}' AND LGAName = '${lga}' AND WardName = '${ward}');`
            // .query(
            // "Select * FROM Data WHERE FacilityId IN (Select Id FROM FacilityView WHERE WardId = (Select Id FROM Ward WHERE \"Name\" = '" + ward + "') AND LGAId = (Select Id FROM LGA WHERE \"Name\" = '"+ lga +"' AND StateId = (Select Id FROM State WHERE \"Name\" = '"+state+"')))"
            /*+`Select * FROM "Sets";
            Select * FROM Groups;
            Select * FROM Metrics;`*/
            );            
        });
    }

    getDataByFacility(state: string, lga: string, ward: string, facility: string) {
        return SqlDataAccess.sqlPool.then(pool => {
            return pool.request()
            .query(`Select * FROM Data WHERE FacilityId IN (Select FacilityId FROM FacilityView WHERE StateName = '${state}' AND LGAName = '${lga}' AND WardName = '${ward}' AND FacilityName = '${facility}');`
            // .query("Select * FROM Data WHERE FacilityId IN (Select Id FROM FacilityView WHERE FacilityId = (Select Id FROM Facility WHERE \"Name\" = '"+facility+"') AND WardId = (Select Id FROM Ward WHERE \"Name\" = '"+ward+"') AND LGAId = (Select Id FROM LGA WHERE \"Name\" = '"+lga+"' AND StateId = (Select Id FROM State WHERE \"Name\" = '"+state+"')))"
            /*+`Select * FROM "Sets";
            Select * FROM Groups;
            Select * FROM Metrics;`*/
            );            
        });
    }
}