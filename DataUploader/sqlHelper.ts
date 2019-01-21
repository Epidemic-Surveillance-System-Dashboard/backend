import * as tedious from 'tedious';

const config =
{
    userName: 'essdsqldev',
    password: 'Whyessdwhy!',
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

    query(){//queries: string[]){
        this.connection.on('connect', (err) => {
            if(err){
                console.log(err);
            }
            else{
                this.launchQueries();//queries);
            }
        });
    }

    launchQueries(){//queries: string[]){
        // queries.forEach(function(query){
            
        // });
        var request = new tedious.Request (
            "SELECT * FROM TEST",
            (err, rowCount, rows) =>
            {
                console.log(rowCount + ' row(s) returned');
                this.connection.close();
                process.exit();
            } 
        );
        
        request.on('row', function(columns) {
            columns.forEach(function(column) {
                console.log("%s\t%s", column.metadata.colName, column.value);
            });
        });

        this.connection.execSql(request);
    }
}

var sh = new SqlHelper('essd-sql-dev');
sh.query();