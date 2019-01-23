import * as xlsx from 'xlsx';
import * as config from 'config';
import { SqlHelper } from './sqlHelper';
import { Request } from 'tedious';

class DataUploader {

    workbook : xlsx.WorkBook;
    uploaderConfig: any;
    sh: SqlHelper;
    constructor(file: string) {
        this.workbook = xlsx.readFile(file);
        this.uploaderConfig = config.get('uploaderConfig');
        this.sh = new SqlHelper(this.uploaderConfig);
    }

    parse(){ 
        var sheetNameList: string[] = this.workbook.SheetNames;
        sheetNameList.forEach((sheetName) => { 
            switch(sheetName) {
                case 'Facility Attendance - A Age(Att': {
                    this.parseFacilityAttendance(sheetName);
                    break;
                }
            }
        });
    }
    
    parseFacilityAttendance(sheetName: string) {
        //console.log(this.workbook.Sheets[sheetName]['B6']);
        var queries : string[];
        var groupQuery : string = "INSERT INTO Groups (GroupName) VALUES ('Facility Attendance')";
        var setQuery : string = "INSERT INTO Sets (SetName, GroupId) VALUES ('Facility Attendance Male', (SELECT Id FROM Groups WHERE GroupName = 'Facility Attendance'))";
        queries.push(groupQuery);
        queries.push(setQuery);
        for (var i = 1; i < 21; i++){
            var identifier = String.fromCharCode('A'.charCodeAt(0) + i);
            var headerId = identifier + 5;
            var valueId = identifier + 6; 
            //console.log(headerId + " " + valueId + " " + "Facility Attendance " + this.workbook.Sheets[sheetName][headerId].v + " "+ this.workbook.Sheets[sheetName][valueId].v);           
            var query = "";
            queries.push(query);
        }

        var uploaderConfig = config.get('uploaderConfig');
        var sh = new SqlHelper(uploaderConfig);
        sh.query();
    }
}

const du = new DataUploader('C://Users//aayush//Desktop//data.xls');
du.parse();


//console.log(workbook.Sheets[sheetNameList[0]]['B6']);
//console.log(xlsx.utils.sheet_to_json(workbook.Sheets[sheetNameList[0]]));