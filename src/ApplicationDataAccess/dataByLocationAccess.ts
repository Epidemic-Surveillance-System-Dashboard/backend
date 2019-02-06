import { SqlDataAccess } from '../DataAccess/sqlDataAccess';
import * as mssql from 'mssql';

export class DataByLocationAccess extends SqlDataAccess {

    constructor(config: any){
        super(config);
    }

    getDataByLocation(state: string, lga: string, ward: string, facility: string){
        return SqlDataAccess.sqlPool.then(pool => {
            return pool.request()
            .input('lga', mssql.NVarChar, name)
            .query('SELECT Id FROM LGA WHERE Name = @lga;');
        });
    }

}