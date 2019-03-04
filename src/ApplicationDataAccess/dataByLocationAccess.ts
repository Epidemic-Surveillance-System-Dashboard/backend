import { SqlDataAccess } from '../DataAccess/sqlDataAccess';

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
            .query(`Select * FROM Data WHERE FacilityId IN (Select FacilityId FROM FacilityView WHERE StateName = '${state}');`
            );            
        });
    }

    getDataByLga(state: string, lga: string) {
        return SqlDataAccess.sqlPool.then(pool => {
            return pool.request()
            .query(`Select * FROM Data WHERE FacilityId IN (Select FacilityId FROM FacilityView WHERE StateName = '${state}' AND LGAName = '${lga}');`
            );            
        });
    }

    getDataByWard(state: string, lga: string, ward: string) {
        return SqlDataAccess.sqlPool.then(pool => {
            return pool.request()
            .query(`Select * FROM Data WHERE FacilityId IN (Select FacilityId FROM FacilityView WHERE StateName = '${state}' AND LGAName = '${lga}' AND WardName = '${ward}');`
            );            
        });
    }

    getDataByFacility(state: string, lga: string, ward: string, facility: string) {
        return SqlDataAccess.sqlPool.then(pool => {
            return pool.request()
            .query(`Select * FROM Data WHERE FacilityId IN (Select FacilityId FROM FacilityView WHERE StateName = '${state}' AND LGAName = '${lga}' AND WardName = '${ward}' AND FacilityName = '${facility}');`
            );            
        });
    }
}