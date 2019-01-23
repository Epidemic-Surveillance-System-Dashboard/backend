import * as tedious from 'tedious';

const config =
{
    authentication: {
        type: "default",
        options : {
            userName: 'essdsqldev',
            password: 'Whyessdwhy!'
        }
    },
    server: 'essd-sql-dev.database.windows.net',
    options:
    {
        database: '',
        encrypt: true
    }
};
class SqlHelper {

    connection: any;

    constructor(db: string){
        config.options.database = db;
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
