import * as xlsx from 'xlsx';
import * as config from 'config';
import { SqlHelper } from './sqlHelper';
import { TYPES } from 'tedious';

class DataUploader {

    workbook : xlsx.WorkBook;
    sqlHelper: SqlHelper;

    constructor(filePath: string) {
        this.workbook = xlsx.readFile(filePath);
        this.sqlHelper = new SqlHelper(config.get('tediousPoolConfig'), config.get('sqlConnectionPoolConfig'));
    }

    UploadXlsxFile(){ 
        var sheetNameList: string[] = this.workbook.SheetNames;
       // this.uploadLocation("state1", "lga1", "ward1", "facility1");        
        sheetNameList.forEach((sheetName) => { 
            switch(sheetName) {
                case 'Facility Attendance - A Age(Att': {
                    this.uploadFacilityAttendance(sheetName);
                    break;
                }
            }
       });
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
            
            var params = [
                { param: "state", type: TYPES.NVarChar, value: state },
                { param: "lga", type: TYPES.NVarChar, value: lga },
                { param: "ward", type: TYPES.NVarChar, value: ward },
                { param: "facility", type: TYPES.NVarChar, value: facility}
            ];

        this.sqlHelper.launchQueriesInSync(queries, params);
    }

    uploadFacilityAttendance(sheetName: string) {
        var queries = [
            "INSERT INTO Groups (GroupName) VALUES ('Facility Attendance');",
            "INSERT INTO Sets (SetName, GroupId) VALUES ('Facility Attendance Male', " +
                "(SELECT Id FROM Groups WHERE GroupName = 'Facility Attendance')), " +
                "('Facility Attendance Female', (SELECT Id FROM Groups WHERE GroupName = 'Facility Attendance'));"
        ];

        var params = [];

        for (var i = 1; i < 21; i++){
            var currentCell = String.fromCharCode('A'.charCodeAt(0) + i);
            var headerCell = currentCell + 5;
            var valueCell = currentCell + 6; 
            var header = this.workbook.Sheets[sheetName][headerCell].v;
            var value = this.workbook.Sheets[sheetName][valueCell].v;

            if(header != '' && value != '') {
                if (header.includes('Female')) {
                    queries.push("INSERT INTO Metrics (MetricName, SetId) VALUES ('Facility Attendance @header', " + 
                        "(SELECT Id FROM Sets WHERE SetName = 'Facility Attendance Female'))");
                } else {
                    queries.push("INSERT INTO Metrics (MetricName, SetId) VALUES ('Facility Attendance @header', " + 
                        "(SELECT Id FROM Sets WHERE SetName = 'Facility Attendance Male'))");
                }                
                params.push({param: "header", type: TYPES.NVarChar, value: header});
            }   

            this.sqlHelper.launchQueriesInSync(queries, params); 
            queries = []; 
            params = [];       
        }  
    }
}

const dataUploader = new DataUploader("src/DataUploader/data.xls");
dataUploader.UploadXlsxFile();


//console.log(workbook.Sheets[sheetNameList[0]]['B6']);
//console.log(xlsx.utils.sheet_to_json(workbook.Sheets[sheetNameList[0]]));