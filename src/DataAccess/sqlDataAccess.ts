import * as mssql from 'mssql';

export class SqlDataAccess {

    config: any;
    public static sqlPool;

    constructor(config){
        if(SqlDataAccess.sqlPool == null || SqlDataAccess.sqlPool == undefined)
            SqlDataAccess.sqlPool = new mssql.ConnectionPool(JSON.parse(JSON.stringify(config))).connect();
    }
}