var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
var XLSX = require('xlsx');


var workbook = XLSX.readFile('a.xls');
var sheet_name_list = workbook.SheetNames;

console.log(XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[8]]));


// Create connection to database
var config =
{
    userName: 'essdsqldev',
    password: 'Whyessdwhy!',
    server: 'essd-sql-dev.database.windows.net',
    options:
    {
        database: 'essd-sql-dev',
        encrypt: true
    }
}
var connection = new Connection(config);


connection.on('connect', function(err)
    {
        if (err)
        {
            console.log(err)
        }
        else
        {
            queryDatabase()
        }
    }
);



function queryDatabase()
{
    console.log('Reading rows from the Table...');

    
    var request = new Request(
        "SELECT * FROM TEST",
        function(err, rowCount, rows)
        {
            console.log(rowCount + ' row(s) returned');
            process.exit();
        }
    );

    request.on('row', function(columns) {
        columns.forEach(function(column) {
            console.log("%s\t%s", column.metadata.colName, column.value);
        });
    });
    connection.execSql(request);
    connection.close();
}