import * as xlsx from 'xlsx';
import * as config from 'config';
import { SqlHelper } from './sqlHelper';
import { TYPES } from 'tedious';

class DataUploader {

    workbook : xlsx.WorkBook;
    sqlHelper: SqlHelper;   

    constructor() {
        this.sqlHelper = new SqlHelper(config.get('tediousPoolConfig'), config.get('sqlConnectionPoolConfig'));
    }

    uploadXlsxFile(filePath: string){ 
        this.workbook = xlsx.readFile(filePath);
        var sheetNameList: string[] = this.workbook.SheetNames;
        var sheetDate = this.getDateFromWorkbook(this.workbook);
        
        this.uploadLocation("state2", "lga2", "ward2", "facility2")
        .then((result) => {
            sheetNameList.forEach((sheetName) => { 
                switch(sheetName) {
                    case 'Facility Attendance - A Age(Att': {
                        this.uploadFacilityAttendance(sheetName, result, sheetDate);
                        break;
                    }
                }
            }); 
        });     
    }
    
    uploadLocation(state: string, lga: string, ward: string, facility: string) {
        return new Promise((resolve, reject) => {
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
                
            var getFacilityViewIdQuery = "Select Id from FacilityView WHERE StateId = (SELECT Id FROM State WHERE Name = @state) " +
                "and LGAId = (SELECT Id FROM LGA WHERE Name = @lga) and WardId = (SELECT Id FROM Ward WHERE Name = @ward) " + 
                "and FacilityId = (SELECT Id FROM Facility WHERE Name = @facility);"
                    
            var params = [
                { param: "state", type: TYPES.NVarChar, value: state },
                { param: "lga", type: TYPES.NVarChar, value: lga },
                { param: "ward", type: TYPES.NVarChar, value: ward },
                { param: "facility", type: TYPES.NVarChar, value: facility}
            ];

            this.sqlHelper.launchInsertQueriesUsingPromise(queries, params)
            .then((result) => {
                this.sqlHelper.launchSelectQueryUsingPromise(getFacilityViewIdQuery, params)
                .then((result) => {
                    resolve(result[0][0].val);
                })
            })
        }); 
    }

    uploadFacilityAttendance(sheetName: string, locationId, sheetDate) {
 
        var queries = [
            "INSERT INTO Groups (GroupName) VALUES ('Facility Attendance');",
            "INSERT INTO Sets (SetName, GroupId) VALUES ('Facility Attendance Male', " +
                "(SELECT Id FROM Groups WHERE GroupName = 'Facility Attendance')), " +
                "('Facility Attendance Female', (SELECT Id FROM Groups WHERE GroupName = 'Facility Attendance'));"
        ];

        this.sqlHelper.launchInsertQueriesUsingPromise(queries)
        .then((result) => {    
            for (var i = 1; i < 15; i++){
                var params = [];
                queries = [];
                var currentCellCol = String.fromCharCode('A'.charCodeAt(0) + i);
                var headerCell = currentCellCol + 5;
                var valueCell = currentCellCol + 6;
                var headerValue = this.workbook.Sheets[sheetName][headerCell].v;
                var dataValue = this.workbook.Sheets[sheetName][valueCell].v;

                if(headerValue != '' && dataValue != '') {
                    var metricName = 'Facility Attendance ' + headerValue;
                    var query = '';
                    if (headerValue.includes('Female')) {    
                        queries.push("INSERT INTO Metrics (MetricName, SetId) VALUES (@header, " + 
                            "(SELECT Id FROM Sets WHERE SetName = 'Facility Attendance Female'));");                    
                    } else {
                        queries.push("INSERT INTO Metrics (MetricName, SetId) VALUES (@header, " + 
                            "(SELECT Id FROM Sets WHERE SetName = 'Facility Attendance Male'));");
                    }

                    queries.push("INSERT INTO Data (MetricId, FacilityId, Value, Time) VALUES " + 
                        "((SELECT Id FROM Metrics WHERE MetricName = @header), @facilityViewId, @dataValue, @dateTime)");

                    params.push({param: "header", type: TYPES.NVarChar, value: metricName});
                    params.push({param: "facilityViewId", type: TYPES.BigInt, value: locationId});
                    params.push({param: "dataValue", type: TYPES.BigInt, value: dataValue});                        
                    params.push({param: "dateTime", type: TYPES.DateTime, value: sheetDate});
                   
                    this.sqlHelper.launchInsertQueries(queries, params);
                }     
            }
        });        
    }

    getDateFromWorkbook(workbook): Date{
        var sheets = this.workbook.SheetNames;
        var extractedDate = workbook.Sheets[sheets[0]]['A3'].v.split(" ").splice(-2);
        /**************TEMPORARY DATE FOR TESTING, REMOVE LATER**************/
        extractedDate = "December,2016";
        return new Date(extractedDate.split(",")[0] + ' 1, ' + extractedDate.split(",")[1] + ' 07:00:00');
    }
}

const dataUploader = new DataUploader();
dataUploader.uploadXlsxFile("src/DataUploader/data.xls");