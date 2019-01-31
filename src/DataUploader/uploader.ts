import * as xlsx from 'xlsx';
import * as config from 'config';
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
                    this.uploadFacilityAttendanceA(sheetName, facilityViewId, sheetDate);
                    break;
                }
                
                case 'Facility Attendance - B default': {
                    this.uploadFacilityAttendanceB(sheetName, facilityViewId, sheetDate);
                    break;
                }

                case 'Maternal Health (Ante & Post na': {
                    this.maternalHealthAntePostNatalCare(sheetName, facilityViewId, sheetDate);
                    break;
                }

                case 'Maternal Health(Labour and Deli': {
                    this.maternalHealthLabourDelivery(sheetName, facilityViewId, sheetDate);
                    break;                    
                }

                case 'Tetanus Toxoid ( Women of Child': {
                    this.uploadTetanusToxoidWomen(sheetName, facilityViewId, sheetDate);
                    break;                    
                }

                case 'Pregnancy Outcome - Live Births': {
                    this.uploadPregnancyOutcomeLiveBirths(sheetName, facilityViewId, sheetDate);
                    break;                    
                }

                case 'Pregnancy Outcome - Still birth': {
                    this.uploadPregnancyOutcomeStillBirths(sheetName, facilityViewId, sheetDate);
                    break;                    
                }
                
                case 'Pregnancy Outcome - Complicatio': {
                    this.uploadPregnancyOutcomeComplication(sheetName, facilityViewId, sheetDate);
                    break;                    
                } 
                
                case 'Immunization Immunisation(agesi': {
                    this.uploadImmunization(sheetName, facilityViewId, sheetDate);
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
        var facilityViewResult;
        try {
            var stateResult = await stateDataAccess.insertState(state);
            var lgaResult = await lgaDataAccess.insertLGA(lga, stateResult.recordset[0].Id);
            var wardResult = await wardDataAccess.insertWard(ward, lgaResult.recordset[0].Id);
            var facilityResult = await facilityDataAccess.insertFacility(facility, wardResult.recordset[0].Id);
            facilityViewResult = await facilityViewDataAccess.insertFacilityView(
                facilityResult.recordset[0].Id, 
                wardResult.recordset[0].Id, 
                lgaResult.recordset[0].Id, 
                stateResult.recordset[0].Id
            );
        }
        catch(e){
            console.log("upload location error1: " + e);
        }
        return facilityViewResult.recordset[0].Id;
    }

    async uploadFacilityAttendanceA(sheetName: string, facilityViewId, sheetDate) {
        var sqlConfig = config.get('sqlConfig');
        var groupsDataAccess = new GroupsDataAccess(sqlConfig);
        var setsDataAccess = new SetsDataAccess(sqlConfig);
        var metricDataAccess = new MetricsDataAccess(sqlConfig);
        var dataDataAccess = new DataDataAccess(sqlConfig);

        try {
            var groupResult = await groupsDataAccess.insertGroup('Facility Attendance');
            await setsDataAccess.insertSet('Facility Attendance Male', groupResult.recordset[0].Id);
            await setsDataAccess.insertSet('Facility Attendance Female', groupResult.recordset[0].Id);
        }
        catch(e){
            console.log("Insert group/set error: " + e);
        }
        

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
                    var metricIdResult = await metricDataAccess.insertMetric(metricName, setIdResult.recordset[0].Id);
                    dataDataAccess.insertData(metricIdResult.recordset[0].Id, facilityViewId, dataValue, sheetDate);
                }
                catch(e){
                    console.log("uploadFacilityAttendanceA error: " + e);
                }
            }     
        }
    }
    
    async uploadFacilityAttendanceB(sheetName: string, facilityViewId, sheetDate) {
        var sqlConfig = config.get('sqlConfig');
        var groupsDataAccess = new GroupsDataAccess(sqlConfig);
        var setsDataAccess = new SetsDataAccess(sqlConfig);
        var metricDataAccess = new MetricsDataAccess(sqlConfig);
        var dataDataAccess = new DataDataAccess(sqlConfig);

        try {
            var groupResult = await groupsDataAccess.insertGroup('Facility Attendance');
            await setsDataAccess.insertSet('Facility Attendance Outpatient', groupResult.recordset[0].Id);        
        }
        catch(e) {
            console.log("Insert group/set error: " + e);
        }
        
        for (var i = 1; i < 2; i++){
            var currentCellCol = String.fromCharCode('A'.charCodeAt(0) + i);
            var headerCell = currentCellCol + 5;
            var valueCell = currentCellCol + 6;
            var headerValue = this.workbook.Sheets[sheetName][headerCell].v;
            var dataValue = this.workbook.Sheets[sheetName][valueCell].v;

            var setName = 'Facility Attendance Outpatient';
            if(headerValue != '' && dataValue != '') {
                var metricName = 'Facility Attendance Outpatient ' + headerValue;                
                console.log("Uploaded: " + metricName);
                try{
                    var setIdResult = await setsDataAccess.getSetId(setName);
                    var metricIdResult = await metricDataAccess.insertMetric(metricName, setIdResult.recordset[0].Id);
                    dataDataAccess.insertData(metricIdResult.recordset[0].Id, facilityViewId, dataValue, sheetDate);
                }
                catch(e){
                    console.log("uploadFacilityAttendanceB error: " + e);
                }
            }     
        }
    }

    async maternalHealthAntePostNatalCare(sheetName: string, facilityViewId, sheetDate) {
        var sqlConfig = config.get('sqlConfig');
        var groupsDataAccess = new GroupsDataAccess(sqlConfig);
        var setsDataAccess = new SetsDataAccess(sqlConfig);
        var metricDataAccess = new MetricsDataAccess(sqlConfig);
        var dataDataAccess = new DataDataAccess(sqlConfig);

        try {
            var groupResult = await groupsDataAccess.insertGroup('Maternal Health Ante Post Natal Care');
            await setsDataAccess.insertSet('Maternal Health Antenatal Attendance', groupResult.recordset[0].Id); 
            await setsDataAccess.insertSet('Maternal Health ANC Syphilis', groupResult.recordset[0].Id);
            await setsDataAccess.insertSet('Maternal Health Treatments Received', groupResult.recordset[0].Id);
            await setsDataAccess.insertSet('Maternal Health Postnatal Attendance', groupResult.recordset[0].Id);       
        }
        catch(e) {
            console.log("Insert group/set error: " + e);
        }
        
        for (var i = 6; i < 21; i++){            
            var headerCell = 'A' + i;
            var valueCell = 'B' + i;
            var headerValue = this.workbook.Sheets[sheetName][headerCell].v;
            var dataValue = this.workbook.Sheets[sheetName][valueCell].v;

            var setName = '';
            if(headerValue != '' && dataValue != '') {
                var metricName = 'Maternal Health ' + headerValue;                
                console.log("Uploaded: " + metricName);
                if(i < 10) { 
                    setName = 'Maternal Health Antenatal Attendance';
                } else if (i < 13) {
                    setName = 'Maternal Health ANC Syphilis';
                } else if (i < 17) {
                    setName = 'Maternal Health Treatments Received';
                } else {
                    setName = 'Maternal Health Postnatal Attendance';
                }
                try{
                    var setIdResult = await setsDataAccess.getSetId(setName);
                    var metricIdResult = await metricDataAccess.insertMetric(metricName, setIdResult.recordset[0].Id);
                    dataDataAccess.insertData(metricIdResult.recordset[0].Id, facilityViewId, dataValue, sheetDate);
                }
                catch(e){
                    console.log("maternalHealthAntePostNatalCare error: " + e);
                }
            }     
        }
    }

    async maternalHealthLabourDelivery(sheetName: string, facilityViewId, sheetDate) {
        var sqlConfig = config.get('sqlConfig');
        var groupsDataAccess = new GroupsDataAccess(sqlConfig);
        var setsDataAccess = new SetsDataAccess(sqlConfig);
        var metricDataAccess = new MetricsDataAccess(sqlConfig);
        var dataDataAccess = new DataDataAccess(sqlConfig);

        try {
            var groupResult = await groupsDataAccess.insertGroup('Maternal Health Deliveries');
            await setsDataAccess.insertSet('Maternal Health Deliveries', groupResult.recordset[0].Id);     
        }
        catch(e) {
            console.log("Insert group/set error: " + e);
        }
        
        for (var i = 6; i < 17; i++){            
            var headerCell = 'A' + i;
            var valueCell = 'B' + i;
            var headerValue = this.workbook.Sheets[sheetName][headerCell].v;
            var dataValue = this.workbook.Sheets[sheetName][valueCell].v;

            var setName = 'Maternal Health Deliveries';
            if(headerValue != '' && dataValue != '') {
                var metricName = 'Maternal Health ' + headerValue;                
                console.log("Uploaded: " + metricName);                
                try{
                    var setIdResult = await setsDataAccess.getSetId(setName);
                    var metricIdResult = await metricDataAccess.insertMetric(metricName, setIdResult.recordset[0].Id);
                    dataDataAccess.insertData(metricIdResult.recordset[0].Id, facilityViewId, dataValue, sheetDate);
                }
                catch(e){
                    console.log("maternalHealthLabourDelivery error: " + e);
                }
            }     
        }
    }

    async uploadTetanusToxoidWomen(sheetName: string, facilityViewId, sheetDate) {
        var sqlConfig = config.get('sqlConfig');
        var groupsDataAccess = new GroupsDataAccess(sqlConfig);
        var setsDataAccess = new SetsDataAccess(sqlConfig);
        var metricDataAccess = new MetricsDataAccess(sqlConfig);
        var dataDataAccess = new DataDataAccess(sqlConfig);

        try {
            var groupResult = await groupsDataAccess.insertGroup('Tetanus Toxoid Women');
            await setsDataAccess.insertSet('Tetanus Toxoid Women', groupResult.recordset[0].Id);     
        }
        catch(e) {
            console.log("Insert group/set error: " + e);
        }
        for (var j = 1; j < 4; j++) {
            var currentCellCol = String.fromCharCode('A'.charCodeAt(0) + j);
            var currentColumnTitle =  this.workbook.Sheets[sheetName][currentCellCol + 5].v;            
            for (var i = 6; i < 11; i++){            
                var headerCell = 'A' + i;
                var valueCell = currentCellCol + i;
                var headerValue = this.workbook.Sheets[sheetName][headerCell].v;
                var dataValue = this.workbook.Sheets[sheetName][valueCell].v;

                var setName = 'Tetanus Toxoid Women';
                if(headerValue != '' && dataValue != '') {
                    var metricName = 'Tetanus Toxoid Women ' + headerValue + ' ' + currentColumnTitle;                
                    console.log("Uploaded: " + metricName);                
                    try{
                        var setIdResult = await setsDataAccess.getSetId(setName);
                        var metricIdResult = await metricDataAccess.insertMetric(metricName, setIdResult.recordset[0].Id);
                        dataDataAccess.insertData(metricIdResult.recordset[0].Id, facilityViewId, dataValue, sheetDate);
                    }
                    catch(e){
                        console.log("uploadTetanusToxoidWomen error: " + e);
                    }
                }     
            }
        }
    }

    async uploadPregnancyOutcomeLiveBirths(sheetName: string, facilityViewId, sheetDate) {
        var sqlConfig = config.get('sqlConfig');
        var groupsDataAccess = new GroupsDataAccess(sqlConfig);
        var setsDataAccess = new SetsDataAccess(sqlConfig);
        var metricDataAccess = new MetricsDataAccess(sqlConfig);
        var dataDataAccess = new DataDataAccess(sqlConfig);

        try {
            var groupResult = await groupsDataAccess.insertGroup('Pregnancy Outcomes');
            await setsDataAccess.insertSet('Pregnancy Outcomes Live Births Male', groupResult.recordset[0].Id);
            await setsDataAccess.insertSet('Pregnancy Outcomes Live Births Female', groupResult.recordset[0].Id);
        }
        catch(e){
            console.log("Insert group/set error: " + e);
        }
        

        for (var i = 1; i < 7; i++){
            var currentCellCol = String.fromCharCode('A'.charCodeAt(0) + i);
            var headerCell = currentCellCol + 5;
            var valueCell = currentCellCol + 6;
            var headerValue = this.workbook.Sheets[sheetName][headerCell].v;
            var dataValue = this.workbook.Sheets[sheetName][valueCell].v;

            var setName = '';
            if(headerValue != '' && dataValue != '') {
                var metricName = 'Pregnancy Outcomes Live Births ' + headerValue;
                if (headerValue.includes('Female')) { 
                    setName = 'Pregnancy Outcomes Live Births Female';                    
                } 
                else {
                    setName = 'Pregnancy Outcomes Live Births Male'; 
                }

                console.log("Uploaded: " + metricName);
                try{
                    var setIdResult = await setsDataAccess.getSetId(setName);
                    var metricIdResult = await metricDataAccess.insertMetric(metricName, setIdResult.recordset[0].Id);
                    dataDataAccess.insertData(metricIdResult.recordset[0].Id, facilityViewId, dataValue, sheetDate);
                }
                catch(e){
                    console.log("Pregnancy Outcomes error: " + e);
                }
            }     
        }
    }

    async uploadPregnancyOutcomeStillBirths(sheetName: string, facilityViewId, sheetDate) {
        var sqlConfig = config.get('sqlConfig');
        var groupsDataAccess = new GroupsDataAccess(sqlConfig);
        var setsDataAccess = new SetsDataAccess(sqlConfig);
        var metricDataAccess = new MetricsDataAccess(sqlConfig);
        var dataDataAccess = new DataDataAccess(sqlConfig);

        try {
            var groupResult = await groupsDataAccess.insertGroup('Pregnancy Outcomes');
            await setsDataAccess.insertSet('Pregnancy Outcomes Still Birth', groupResult.recordset[0].Id);
            await setsDataAccess.insertSet('Pregnancy Outcomes Abortions', groupResult.recordset[0].Id);       
        }
        catch(e) {
            console.log("Insert group/set error: " + e);
        }
        
        for (var i = 6; i < 10; i++){            
            var headerCell = 'A' + i;
            var valueCell = 'B' + i;
            var headerValue = this.workbook.Sheets[sheetName][headerCell].v;
            var dataValue = this.workbook.Sheets[sheetName][valueCell].v;

            var setName = '';
            if(headerValue != '' && dataValue != '') {
                var metricName = 'Pregnancy Outcomes ' + headerValue;                
                console.log("Uploaded: " + metricName);
                if(i < 8) { 
                    setName = 'Pregnancy Outcomes Still Birth';
                } else {
                    setName = 'Pregnancy Outcomes Abortions';
                }
                try{
                    var setIdResult = await setsDataAccess.getSetId(setName);
                    var metricIdResult = await metricDataAccess.insertMetric(metricName, setIdResult.recordset[0].Id);
                    dataDataAccess.insertData(metricIdResult.recordset[0].Id, facilityViewId, dataValue, sheetDate);
                }
                catch(e){
                    console.log("uploadPregnancyOutcomeStillBirths error: " + e);
                }
            }     
        }
    }

    async uploadPregnancyOutcomeComplication(sheetName: string, facilityViewId, sheetDate) {
        var sqlConfig = config.get('sqlConfig');
        var groupsDataAccess = new GroupsDataAccess(sqlConfig);
        var setsDataAccess = new SetsDataAccess(sqlConfig);
        var metricDataAccess = new MetricsDataAccess(sqlConfig);
        var dataDataAccess = new DataDataAccess(sqlConfig);

        try {
            var groupResult = await groupsDataAccess.insertGroup('Pregnancy Outcomes');
            await setsDataAccess.insertSet('Pregnancy Outcomes Complications Female', groupResult.recordset[0].Id); 
            await setsDataAccess.insertSet('Pregnancy Outcomes Complications Male', groupResult.recordset[0].Id);     
        }
        catch(e) {
            console.log("Insert group/set error: " + e);
        }
        for (var j = 1; j < 3; j++) {
            var currentCellCol = String.fromCharCode('A'.charCodeAt(0) + j);
            var currentColumnTitle =  this.workbook.Sheets[sheetName][currentCellCol + 5].v;     
            var setName =  '';
            if (j === 1) {
                setName = 'Pregnancy Outcomes Complications Male';
            }   else {
                setName = 'Pregnancy Outcomes Complications Female';
            }  
            for (var i = 6; i < 12; i++) {            
                var headerCell = 'A' + i;
                var valueCell = currentCellCol + i;
                var headerValue = this.workbook.Sheets[sheetName][headerCell].v;
                var dataValue = this.workbook.Sheets[sheetName][valueCell].v;

                if(headerValue != '' && dataValue != '') {
                    var metricName = 'Pregnancy Outcomes Complications ' + headerValue + ' ' + currentColumnTitle;                
                    console.log("Uploaded: " + metricName);                
                    try{
                        var setIdResult = await setsDataAccess.getSetId(setName);
                        var metricIdResult = await metricDataAccess.insertMetric(metricName, setIdResult.recordset[0].Id);
                        dataDataAccess.insertData(metricIdResult.recordset[0].Id, facilityViewId, dataValue, sheetDate);
                    }
                    catch(e){
                        console.log("uploadPregnancyOutcomeComplication error: " + e);
                    }
                }     
            }
        }
    }

    async uploadImmunization(sheetName: string, facilityViewId, sheetDate) {
        var sqlConfig = config.get('sqlConfig');
        var groupsDataAccess = new GroupsDataAccess(sqlConfig);
        var setsDataAccess = new SetsDataAccess(sqlConfig);
        var metricDataAccess = new MetricsDataAccess(sqlConfig);
        var dataDataAccess = new DataDataAccess(sqlConfig);

        try {
            var groupResult = await groupsDataAccess.insertGroup('Immunizations');
            await setsDataAccess.insertSet('Immunizations', groupResult.recordset[0].Id);     
        }
        catch(e) {
            console.log("Insert group/set error: " + e);
        }
        for (var j = 1; j < 5; j++) {
            var currentCellCol = String.fromCharCode('A'.charCodeAt(0) + j);
            var currentColumnTitle =  this.workbook.Sheets[sheetName][currentCellCol + 5].v;     
            var setName =  'Immunizations';
            for (var i = 6; i < 28; i++) {            
                var headerCell = 'A' + i;
                var valueCell = currentCellCol + i;
                var headerValue = this.workbook.Sheets[sheetName][headerCell].v;
                var dataValue = this.workbook.Sheets[sheetName][valueCell].v;

                if(headerValue != '' && dataValue != '') {
                    var metricName = 'Immunization ' + headerValue + ' ' + currentColumnTitle;                
                    console.log("Uploaded: " + metricName);                
                    try{
                        var setIdResult = await setsDataAccess.getSetId(setName);
                        var metricIdResult = await metricDataAccess.insertMetric(metricName, setIdResult.recordset[0].Id);
                        dataDataAccess.insertData(metricIdResult.recordset[0].Id, facilityViewId, dataValue, sheetDate);
                    }
                    catch(e){
                        console.log("uploadPregnancyOutcomeComplication error: " + e);
                    }
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