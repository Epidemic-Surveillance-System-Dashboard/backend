import * as tedious from 'tedious';
import * as tediousPool from 'tedious-connection-pool';

export class SqlHelper {

    pool: any;

    constructor(dbConfig: any, poolConfig: any){
        this.pool = new tediousPool(poolConfig, dbConfig);
        this.pool.on('error', function(err){
            console.log("error: " + err);
        });
    }

    launchInsertQueriesUsingPromise(queries: string[], params?: any[]){

        return new Promise((resolve, reject) => {
            this.pool.acquire((err, connection) => {
                if(err){
                    console.log("error after acquiring connection: " + err);
                    return;
                }

                var combinedQuery: string = "";       
                queries.forEach((oneQuery) => {
                    combinedQuery += oneQuery;
                });
        
                var request = new tedious.Request (combinedQuery, (err, rowCount, rows) => {
                    if (err){
                        console.log("SQL Error number: " + err);
                    }
                    console.log(rowCount + ' row(s) returned');
                    connection.release(); 
                    resolve("gg");
                })
                .on('row', function(columns) {
                    columns.forEach(function(column) {
                        console.log("%s\t%s", column.metadata.colName, column.value);
                    });
                });
    
                if(params){
                    for(var i = 0; i < params.length; i++){
                        request.addParameter(params[i].param, params[i].type, params[i].value);
                    }
                }
                connection.execSql(request);
            });
        });
    }

    launchInsertQuery(query, params?: any[]){

        this.pool.acquire((err, connection) => {
            if(err){
                console.log("error after acquiring connection: " + err);
                return;
            }
            var request = new tedious.Request (query, (err, rowCount, rows) => {
                if (err){
                    console.log("SQL Error number: " + err);
                }
                console.log(rowCount + ' row(s) returned'); 
                connection.release(); 
        
            })
            .on('row', function(columns) {
                columns.forEach(function(column) {
                    console.log("%s\t%s", column.metadata.colName, column.value);
                });
            });
            if(params){
                for(var i = 0; i < params.length; i++){
                    request.addParameter(params[i].param, params[i].type, params[i].value);
                }
            }
            connection.execSql(request);
        });
    }

    launchSelectQuery(query, params?: any[]){

        this.pool.acquire((err, connection) => {
            if(err){
                console.log("error after acquiring connection: " + err);
                return;
            }
            var request = new tedious.Request (query, (err, rowCount, rows) => {
                if (err){
                    console.log("SQL Error number: " + err);
                }
                console.log(rowCount + ' row(s) returned'); 
                console.log(rows); 
                connection.release(); 
        
            })
            /*.on('row', (columns) =>{
                columns.forEach(function(column) {
                    console.log("%s\t%s", column.metadata.colName, column.value);
                });
            });*/
            if(params){
                for(var i = 0; i < params.length; i++){
                    request.addParameter(params[i].param, params[i].type, params[i].value);
                }
            }
            connection.execSql(request);
        });
    }
}

// var sh = new SqlHelper(config.get('tediousPoolConfig'), config.get('sqlConnectionPoolConfig'));
 //sh.launchQueriesInSync(["SELECT * FROM State;", "SELECT * FROM Ward;", "SELECT * FROM LGA;", "SELECT * FROM Facility;"]);
