import { SqlDataAccess } from '../DataAccess/sqlDataAccess';
import * as mssql from 'mssql';
import * as config from 'config';

export class HierarchyAccess extends SqlDataAccess {

    constructor(config: any){
        super(config);
    }

    getAllLocationsHierarchy() {
        return SqlDataAccess.sqlPool.then(pool => {
            return pool.request()
            .query(
                `SELECT "Name", Id FROM State;
                SELECT "Name", Id, StateId AS parentId FROM Lga;
                SELECT "Name", Id, LgaId AS parentId FROM Ward;
                SELECT "Name", Id, WardId AS parentId FROM Facility;`
            );            
        });
    }

    getAllDataHierarchy() {
        return SqlDataAccess.sqlPool.then(pool => {
            return pool.request()
            .query(
                `SELECT GroupName AS Name, Id From Groups AS Id;
                SELECT SetName AS Name, Id, GroupId AS parentId FROM "Sets";
                SELECT MetricName AS Name, Id, SetId AS parentId, RelativeOrder FROM Metrics;`
            );            
        });
    }

}