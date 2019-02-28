import { SqlDataAccess } from './sqlDataAccess';
import * as mssql from 'mssql';

export class FacilityViewDataAccess extends SqlDataAccess {

    constructor(config: any){
        super(config);
    }

    insertFacilityView(facilityId: number, wardId: number, lgaId: number, stateId: number){
        return this.retryQuery(() => {
            return SqlDataAccess.sqlPool.then(pool => {
                return pool.request()
                .input('facilityId', mssql.BigInt, facilityId)
                .input('wardId', mssql.BigInt, wardId)
                .input('lgaId', mssql.BigInt, lgaId)
                .input('stateId', mssql.BigInt, stateId)
                .query(`SET TRANSACTION ISOLATION LEVEL SERIALIZABLE
                BEGIN TRAN
                IF NOT EXISTS(SELECT * FROM FacilityView WHERE WardId = @wardId and LGAId = @lgaId and StateId = @stateId and FacilityId = @facilityId)
                BEGIN
                    INSERT INTO FacilityView (FacilityId, WardId, LGAId, StateId) VALUES (@facilityId, @wardId, @lgaId, @stateId) SELECT SCOPE_IDENTITY() as Id;
                END
                ELSE
                BEGIN
                  SELECT Id FROM FacilityView WHERE WardId = @wardId and LGAId = @lgaId and StateId = @stateId and FacilityId = @facilityId
                END
                COMMIT TRAN`);
            });
        });
        
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