import * as tedious from 'tedious';
import * as tediousPool from 'tedious-connection-pool';
import * as config from 'config';

export class SqlHelper {

   // connection: any;
    pool: any;

    constructor(dbConfig: any, poolConfig: any){
       // this.connection = new tedious.Connection(config);
        this.pool = new tediousPool(poolConfig, dbConfig);

        this.pool.on('error', function(err){
            console.log("error: " + err);
        });
    }

    query(queries: string[]){
       // this.connection.on('connect', (err) => {
         //   if(err){
         //       console.log(err);
         //   }
         //   else{
                this.launchQueries(queries);
         //   }
       // });
    }

    launchQueries(queries: string[]){
        queries.forEach((query) => { 

            this.pool.acquire((err,connection) => {
                if(err)
                    console.log("error after acquiring connection: " + err);

                    var request = new tedious.Request (query,(err, rowCount, rows) => {
                        if (err) 
                            console.log("SQL Error number: " + err);//.number);
                        console.log(rowCount + ' row(s) returned'); 
                        connection.release(); 

                    }).on('row', function(columns) {
                        columns.forEach(function(column) {
                            console.log("%s\t%s", column.metadata.colName, column.value);
                        });
                    });

                    connection.execSql(request);
            });
        });
        
       // process.exit();
    }
}

 //var sh = new SqlHelper(config.get('uploaderConfig'), config.get('sqlConnectionPoolConfig'));
 //sh.query(["SELECT * FROM Groups"]);
