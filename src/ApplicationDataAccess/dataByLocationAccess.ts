import { SqlDataAccess } from '../DataAccess/sqlDataAccess';
import * as mssql from 'mssql';
import * as config from 'config';

export class DataByLocationAccess extends SqlDataAccess {

    constructor(config: any){
        super(config);
    }

    getDataByLocation(state: string, lga: string, ward: string, facility: string){
        return SqlDataAccess.sqlPool.then(pool => {
            return pool.request()
          //  .input()
            .query(`Select * FROM Data WHERE FacilityId = (Select Id FROM FacilityView WHERE StateId = (Select Id FROM State WHERE "Name" = 'state5'));
            Select * FROM "Sets";
            Select * FROM Groups;
            Select * FROM Metrics;`
            );            
        });
    }
}

var t = new DataByLocationAccess(config.get('sqlConfig'));

var h = t.getDataByLocation('a','a','a','a').then(result => {


    var r = {
        Data: result.recordsets[0],
        Sets: result.recordsets[1],
        Groups: result.recordsets[2],
        Metrics: result.recordsets[3]
    };
    var z = JSON.stringify(r);
    console.log(r);
})
