import * as tedious from 'tedious';
import * as config from 'config';

export class SqlHelper {

    connection: any;

    constructor(config: any){
        this.connection = new tedious.Connection(config);
    }

    query(queries: string[]){
        this.connection.on('connect', (err) => {
            if(err){
                console.log(err);
            }
            else{
                this.launchQueries(queries);
            }
        });
    }

    launchQueries(queries: string[]){
        queries.forEach((query) => { 
            var request = new tedious.Request (
                query,
                (err, rowCount, rows) => {
                    if (err) 
                        console.log("SQL Error number: " + err.number);
                    console.log(rowCount + ' row(s) returned');
                    this.connection.close();
                    process.exit();
                } 
            ).on('row', function(columns) {
                columns.forEach(function(column) {
                    console.log("%s\t%s", column.metadata.colName, column.value);
                });
            });        
            this.connection.execSql(request);
        });
    }
}

// var uploaderConfig = config.get('uploaderConfig');
// var sh = new SqlHelper(uploaderConfig);
// sh.query(["INSERT INTO GROUPS (GroupName) VALUES ('aaaa')"]);
