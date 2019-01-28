import * as xlsx from 'xlsx';
import * as config from 'config';
import { SqlDataAccess } from '../DataAccess/sqlDataAccess';
import { StateDataAccess } from '../DataAccess/stateDataAccess';
import { LGADataAccess } from '../DataAccess/lgaDataAccess';
import { WardDataAccess } from '../DataAccess/wardDataAccess';
import { FacilityDataAccess } from '../DataAccess/facilityDataAccess';
import { FacilityViewDataAccess } from '../DataAccess/facilityViewDataAccess';
import { GroupsDataAccess } from '../DataAccess/groupsDataAccess';
import { SetsDataAccess } from '../DataAccess/setsDataAccess';
import { MetricsDataAccess } from '../DataAccess/metricsDataAccess';
import { DataDataAccess } from '../DataAccess/dataDataAccess';

class DataUploader {

    workbook : xlsx.WorkBook;
    sqlHelper: SqlDataAccess;   

    constructor() {}

    async uploadXlsxFile(filePath: string){ 
        this.workbook = xlsx.readFile(filePath);
        var sheetNameList: string[] = this.workbook.SheetNames;
        var sheetDate = this.getDateFromWorkbook(this.workbook);

        var facilityViewId = await this.uploadLocation("state5", "lga5", "ward5", "facility5");
        console.log("locations uploaded");
        sheetNameList.forEach((sheetName) => { 
            switch(sheetName) {
                case 'Facility Attendance - A Age(Att': {
                    this.uploadFacilityAttendance(sheetName, facilityViewId, sheetDate);
                    break;
                }
            }
        });  
    }
    
    async uploadLocation(state: string, lga: string, ward: string, facility: string) {
        var sqlConfig = config.get('sqlConfig');
        var stateDataAccess = new StateDataAccess(sqlConfig);
        var lgaDataAccess = new LGADataAccess(sqlConfig);
        var wardDataAccess = new WardDataAccess(sqlConfig);
        var facilityDataAccess = new FacilityDataAccess(sqlConfig);
        var facilityViewDataAccess = new FacilityViewDataAccess(sqlConfig);

        await stateDataAccess.insertState(state);
        var stateResult = await stateDataAccess.getStateId(state);
        await lgaDataAccess.insertLGA(lga, stateResult.recordset[0].Id);
        var lgaResult = await lgaDataAccess.getLGAId(lga);
        await wardDataAccess.insertWard(ward, lgaResult.recordset[0].Id);
        var wardResult = await wardDataAccess.getWardId(ward);
        await facilityDataAccess.insertFacility(facility, wardResult.recordset[0].Id);
        var facilityResult = await facilityDataAccess.getFacilityId(facility);
        await facilityViewDataAccess.insertFacilityView(
            facilityResult.recordset[0].Id, 
            wardResult.recordset[0].Id, 
            lgaResult.recordset[0].Id, 
            stateResult.recordset[0].Id
        );

        var facilityViewResult = await facilityViewDataAccess.getFacilityViewId(
            facilityResult.recordset[0].Id, 
            wardResult.recordset[0].Id, 
            lgaResult.recordset[0].Id, 
            stateResult.recordset[0].Id
        );

        return facilityViewResult.recordset[0].Id;
    }

    async uploadFacilityAttendance(sheetName: string, locationId, sheetDate) {
        var sqlConfig = config.get('sqlConfig');
        var groupsDataAccess = new GroupsDataAccess(sqlConfig);
        var setsDataAccess = new SetsDataAccess(sqlConfig);
        var metricDataAccess = new MetricsDataAccess(sqlConfig);
        var dataDataAccess = new DataDataAccess(sqlConfig);

        await groupsDataAccess.insertGroup('Facility Attendance');
        var groupResult = await groupsDataAccess.getGroupId('Facility Attendance');
        setsDataAccess.insertSet('Facility Attendance Male', groupResult.recordset[0].Id);
        await setsDataAccess.insertSet('Facility Attendance Female', groupResult.recordset[0].Id);

        for (var i = 1; i < 15; i++){
            var currentCellCol = String.fromCharCode('A'.charCodeAt(0) + i);
            var headerCell = currentCellCol + 5;
            var valueCell = currentCellCol + 6;
            var headerValue = this.workbook.Sheets[sheetName][headerCell].v;
            var dataValue = this.workbook.Sheets[sheetName][valueCell].v;

            var setName = '';
            if(headerValue != '' && dataValue != '') {
                var metricName = 'Facility Attendance ' + headerValue;
                if (headerValue.includes('Female')) { 
                    setName = 'Facility Attendance Female';                    
                } 
                else {
                    setName = 'Facility Attendance Male'; 
                }

                console.log("Uploaded: " + metricName);
                try{
                    var setIdResult = await setsDataAccess.getSetId(setName);
                    await metricDataAccess.insertMetric(metricName, setIdResult.recordset[0].Id);
                    var metricIdResult = await metricDataAccess.getMetricId(metricName);
                    dataDataAccess.insertData(metricIdResult.recordset[0].Id, locationId, dataValue, sheetDate);
                }
                catch(e){
                    console.log("uploadFacilityAttendance error: " + e);
                }
            }     
        }
    }

    getDateFromWorkbook(workbook): Date{
        var sheets = this.workbook.SheetNames;
        var extractedDate = workbook.Sheets[sheets[0]]['A3'].v.split(" ").splice(-2);
        //TEMPORARY DATE FOR TESTING, REMOVE LATER
        extractedDate = "December,2016";
        return new Date(extractedDate.split(",")[0] + ' 1, ' + extractedDate.split(",")[1] + ' 07:00:00');
    }
}

const dataUploader = new DataUploader();
dataUploader.uploadXlsxFile("src/DataUploader/data.xls");