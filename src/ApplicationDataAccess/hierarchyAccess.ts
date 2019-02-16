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
                SELECT Lga."Name", Lga.Id AS LgaId, "State"."Name" AS "State" FROM Lga INNER JOIN State ON Lga.StateId = "State".id;
                SELECT Ward."Name", Ward.Id AS WardId, Lga."Name" AS "LGA" FROM Ward INNER JOIN LGA ON Ward.LgaId = Lga.id;
                SELECT Facility."Name", Facility.Id AS FacilityId, Ward."Name" AS "Ward" FROM Facility INNER JOIN Ward ON Facility.WardId = Ward.id;`
            );            
        });
    }

    getAllDataHierarchy() {
        return SqlDataAccess.sqlPool.then(pool => {
            return pool.request()
            .query(
                `SELECT GroupName, Id From Groups;
                SELECT "Sets".SetName, "Sets".Id AS SetId, Groups.GroupName FROM "Sets" INNER JOIN Groups ON "Sets".GroupId = Groups.Id;
                SELECT Metrics.MetricName, Metrics.Id AS MetricId, "Sets".SetName FROM Metrics INNER JOIN "Sets" ON Metrics.SetId = "Sets".Id;`
            );            
        });
    }

}