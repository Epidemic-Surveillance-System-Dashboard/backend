import * as mssql from 'mssql';

export class SqlDataAccess {

    config: any;
    public sqlPool;

    constructor(config){
        this.sqlPool = new mssql.ConnectionPool(JSON.parse(JSON.stringify(config))).connect();
    }
}