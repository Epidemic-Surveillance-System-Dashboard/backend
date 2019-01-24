import * as xlsx from 'xlsx';
import * as config from 'config';
import { SqlHelper } from './sqlHelper';
import { TYPES } from 'tedious';

class DataUploader {

    workbook : xlsx.WorkBook;
    sqlHelper: SqlHelper;
    locationId: number;

    constructor() {
        this.sqlHelper = new SqlHelper(config.get('tediousPoolConfig'), config.get('sqlConnectionPoolConfig'));
        this.locationId = -1;
    }

    uploadXlsxFile(filePath: string){ 
        this.workbook = xlsx.readFile(filePath);
        var sheetNameList: string[] = this.workbook.SheetNames;
        new Promise((resolve, reject) => {
            this.uploadLocation("state", "lga", "ward", "facility"); 
            resolve();
        }).then((result) => {
            sheetNameList.forEach((sheetName) => { 
                switch(sheetName) {
                    case 'Facility Attendance - A Age(Att': {
                        this.uploadFacilityAttendance(sheetName);
                        break;
                    }
                }
            });
        })        
    }
    
    uploadLocation(state: string, lga: string, ward: string, facility: string) {
        var queries = [
            "INSERT INTO State (Name) VALUES (@state);",
            "INSERT INTO LGA (Name, StateId) VALUES (@lga, (SELECT Id FROM State WHERE Name = @state));",
            "INSERT INTO Ward (Name, LGAId) VALUES (@ward, (SELECT Id FROM LGA WHERE Name = @lga));",
            "INSERT INTO Facility (Name, WardId) VALUES (@facility, (SELECT Id FROM Ward WHERE Name = @ward));",
            "INSERT INTO FacilityView (FacilityId, WardId, LGAId, StateId) VALUES ((SELECT Id FROM Facility WHERE Name = @facility), " +
            "(SELECT Id FROM Ward WHERE Name = @ward), " +
            "(SELECT Id FROM LGA WHERE Name = @lga), " +
            "(SELECT Id FROM State WHERE Name = @state));"
        ];
            

        //var getFacilityViewIdQuery = "Select Id from FacilityView WHERE StateId = (SELECT Id FROM State WHERE Name = @state) and LGAId = (SELECT Id FROM LGA WHERE Name = @lga) and WardId = (SELECT Id FROM Ward WHERE Name = @ward) and FacilityId = (SELECT Id FROM Facility WHERE Name = @facility);"
        var getFacilityViewIdQuery = "Select * from FacilityView";

        
        var params = [
            { param: "state", type: TYPES.NVarChar, value: state },
            { param: "lga", type: TYPES.NVarChar, value: lga },
            { param: "ward", type: TYPES.NVarChar, value: ward },
            { param: "facility", type: TYPES.NVarChar, value: facility}
        ];

        this.sqlHelper.launchInsertQueriesUsingPromise(queries, params).then((result) => {
            console.log(result);
            this.sqlHelper.launchSelectQuery([getFacilityViewIdQuery], params);
        });

      //  receivedData.forEach(function(column) {
      //      console.log("%s\t%s", column.metadata.colName, column.value);
      //  });

       //this.sqlHelper.launchInsertQueriesInSync(queries, params);

        

    }

    getLocation() {
        return this.locationId;
        
    }

    uploadFacilityAttendance(sheetName: string) {
        var queries = [
            "INSERT INTO Groups (GroupName) VALUES ('Facility Attendance');",
            "INSERT INTO Sets (SetName, GroupId) VALUES ('Facility Attendance Male', " +
                "(SELECT Id FROM Groups WHERE GroupName = 'Facility Attendance')), " +
                "('Facility Attendance Female', (SELECT Id FROM Groups WHERE GroupName = 'Facility Attendance'));"
        ];

        this.sqlHelper.launchInsertQueriesUsingPromise(queries).then((result) => {
            
            for (var i = 1; i < 15; i++){
                var params = [];
                queries = [];
                var currentCell = String.fromCharCode('A'.charCodeAt(0) + i);
                var headerCell = currentCell + 5;
                var valueCell = currentCell + 6; 
                var header = this.workbook.Sheets[sheetName][headerCell].v;
                var value = this.workbook.Sheets[sheetName][valueCell].v;

                if(header != '' && value != '') {
                    var metricName = 'Facility Attendance ' + header;
                    if (header.includes('Female')) {    
                        queries.push("INSERT INTO Metrics (MetricName, SetId) VALUES (@header, " + 
                            "(SELECT Id FROM Sets WHERE SetName = 'Facility Attendance Female'));");                    
                    } else {
                        queries.push("INSERT INTO Metrics (MetricName, SetId) VALUES (@header, " + 
                            "(SELECT Id FROM Sets WHERE SetName = 'Facility Attendance Male'));");
                    }

                    params.push({param: "header", type: TYPES.NVarChar, value: metricName});

                    this.sqlHelper.launchInsertQueriesUsingPromise(queries, params).then((result) => {
                        params = [];
                        queries = [];

                        queries.push("INSERT INTO Data (MetricId, FacilityId, Value, Time) VALUES ((SELECT Id FROM Metrics WHERE Name = @header)," +
                        "(SELECT Id FROM FacilityView WHERE Name = 'Facility Attendance' @header))")

                        params.push({param: "header", type: TYPES.NVarChar, value: metricName});

                        //this.sqlHelper.launchInsertQuery(queries, params);

                        return;
                    });
                }   

               // this.sqlHelper.launchInsertQueriesInSync(queries, params); 
                queries = []; 
                params = [];       
            }
        });        
    }
}

const dataUploader = new DataUploader();
dataUploader.uploadXlsxFile("src/DataUploader/data.xls");