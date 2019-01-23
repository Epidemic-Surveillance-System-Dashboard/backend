import * as tedious from 'tedious';
import * as config from 'config';

class SqlHelper {

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

var uploaderConfig = config.get('uploaderConfig');
var sh = new SqlHelper(uploaderConfig);
sh.query(["SELECT * FROM TEST"]);
