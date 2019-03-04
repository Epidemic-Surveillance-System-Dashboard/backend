import { SqlDataAccess } from './sqlDataAccess';
import * as mssql from 'mssql';

export class FacilityViewDataAccess extends SqlDataAccess {

    constructor(config: any){
        super(config);
    }

    getFacilityViewId(facilityId: number, wardId: number, lgaId: number, stateId: number){
        return SqlDataAccess.sqlPool.then(pool => {
            return pool.request()
            .input('facilityId', mssql.BigInt, facilityId)
            .input('wardId', mssql.BigInt, wardId)
            .input('lgaId', mssql.BigInt, lgaId)
            .input('stateId', mssql.BigInt, stateId)
            .query('Select Id from FacilityView WHERE StateId = @stateId and LGAId = @lgaId and WardId = @wardId and FacilityId = @facilityId;');
        });
    }

}