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

export class DataUploader {

    workbook : xlsx.WorkBook; 

    constructor() {}

    async uploadXlsxFile(fileName: string){ 
        this.workbook = xlsx.readFile(fileName);
        var sheetNameList: string[] = this.workbook.SheetNames;
        var sheetDate = this.getDateFromWorkbook(this.workbook);
        var fileInfo = this.getFileInfo(fileName);
        console.log(fileInfo[0].split("/")[3]);
        var facilityViewId = await this.uploadLocation(fileInfo[0].split("/")[2], fileInfo[1], fileInfo[2], fileInfo[3]);
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

                case 'Nutrition Gender': {
                    this.uploadNutritionGender(sheetName, facilityViewId, sheetDate);
                    break;
                }

                case 'Malaria Prevention (LLIN) defau': {
                    this.uploadMalariaPrevention(sheetName, facilityViewId, sheetDate);
                    break;
                }

                case 'IMCI Gender': {
                    this.uploadIMCIGender(sheetName, facilityViewId, sheetDate);
                    break;
                }

                case 'Family Planning A Gender': {
                    this.uploadFamilyPlanningAGender(sheetName, facilityViewId, sheetDate);
                    break;
                }

                case 'Family Planning B default': {
                    this.uploadFamilyPlanningBDefault(sheetName, facilityViewId, sheetDate);
                    break;
                }

                case 'Referrals default': {
                    this.uploadReferralsDefault(sheetName, facilityViewId, sheetDate);
                    break;
                }

                case 'Non Communicable Disease Gender': {
                    this.uploadNonCommunicableDisease(sheetName, facilityViewId, sheetDate);
                    break;
                }

                case 'Sexually Transmitted Infections': {
                    this.uploadSexuallyTransmittedInfections(sheetName, facilityViewId, sheetDate);
                    break;
                }

                case 'Laboratory default': {
                    this.uploadLaboratoryDefault(sheetName, facilityViewId, sheetDate);
                    break;
                }

                case 'Inpatient  default': {
                    this.uploadInpatient(sheetName, facilityViewId, sheetDate);
                    break;
                }

                case 'Inpatient Admissions Age(Attend': {
                    this.uploadInpatientAdmissionsAge(sheetName, facilityViewId, sheetDate);
                    break;
                }

                case 'Pharmaceutical Service default': {
                    this.uploadPharmaceuticalServiceDefault(sheetName, facilityViewId, sheetDate);
                    break;
                }

                case 'Adverse Drug Reaction A default': {
                    this.uploadAdverseDrugReactionA(sheetName, facilityViewId, sheetDate);
                    break;
                }

                case 'Adverse Drug Reaction B Antimal': {
                    this.uploadAdverseDrugReactionB(sheetName, facilityViewId, sheetDate);
                    break;
                }

                case 'Mortality Age(Attendance,Admiss': {
                    this.uploadMortalityAge(sheetName, facilityViewId, sheetDate);
                    break;
                }

                case 'Maternal Mortality A default': {
                    this.uploadMaternalMortalityA(sheetName, facilityViewId, sheetDate);
                    break;
                }

                case 'Maternal Mortality B Maternal D': {
                    this.uploadMaternalMortalityB(sheetName, facilityViewId, sheetDate);
                    break;
                }

                case 'Neonatal Deaths Neonatal Death': {
                    this.uploadNeoNatalDeaths(sheetName, facilityViewId, sheetDate);
                    break;
                }

                case 'Under 5 Mortality  Under 5 mort': {
                    this.uploadUnder5Mortality(sheetName, facilityViewId, sheetDate);
                    break;
                }

                case 'HIV Counselling & Testing A Gen': {
                    this.uploadHIVCounsellingAndTesting(sheetName, facilityViewId, sheetDate);
                    break;
                }

                case 'HIV Counselling & Testing B def': {
                    this.uploadHIVCounsellingAndTestingB(sheetName, facilityViewId, sheetDate);
                    break;
                }

                case 'HIV care & treatment Age (15yrs': {
                    this.uploadHIVCareTreatment(sheetName, facilityViewId, sheetDate);
                    break;
                }

                case 'SRH-HIV Integration Gender': {
                    this.uploadSRHHIV(sheetName, facilityViewId, sheetDate);
                    break;
                }

                case 'TBHIV default': {
                    this.uploadTBHIV(sheetName, facilityViewId, sheetDate);
                    break;
                }

                case 'PMTCT - Mother default': {
                    this.uploadPMTCT(sheetName, facilityViewId, sheetDate);
                    break;
                }

                case 'PMTCT - Infant Gender': {
                    this.uploadPMTCTInfant(sheetName, facilityViewId, sheetDate);
                    break;
                }
                case 'TBLP Age(TBLP)': {
                    this.uploadTBLP(sheetName, facilityViewId, sheetDate);
                    break;
                } 

                case 'Malaria Testing Age(Malaria)': {
                    this.uploadMalariaTesting(sheetName, facilityViewId, sheetDate);
                    break;
                }

                case 'Malaria in Pregnancy default': {
                    this.uploadMalariaInPregnancy(sheetName, facilityViewId, sheetDate);
                    break;
                } 
                
                case 'Malaria Cases Age(Malaria)': {
                    this.uploadMalariaCases(sheetName, facilityViewId, sheetDate);
                    break;
                } 

                case 'Malaria Treatment Age(Malaria)': {
                    this.uploadMalariaTreament(sheetName, facilityViewId, sheetDate);
                    break;
                }
                
                case 'Obstetric Fistula A default': {
                    this.uploadFistula(sheetName, facilityViewId, sheetDate);
                    break;
                }
             
                case 'Commodity Availability default': {
                    this.uploadCommodity(sheetName, facilityViewId, sheetDate);
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

    async uploadNutritionGender(sheetName: string, facilityViewId, sheetDate) {
        var sqlConfig = config.get('sqlConfig');
        var groupsDataAccess = new GroupsDataAccess(sqlConfig);
        var setsDataAccess = new SetsDataAccess(sqlConfig);
        var metricDataAccess = new MetricsDataAccess(sqlConfig);
        var dataDataAccess = new DataDataAccess(sqlConfig);

        try {
            var groupResult = await groupsDataAccess.insertGroup('Nutrition');
            await setsDataAccess.insertSet('Nutrition Male', groupResult.recordset[0].Id);
            await setsDataAccess.insertSet('Nutrition Female', groupResult.recordset[0].Id);       
        }
        catch(e) {
            console.log("Insert group/set error: " + e);
        }
        for (var j = 1; j < 3; j++) {
            var currentCellCol = String.fromCharCode('A'.charCodeAt(0) + j);
            var currentColumnTitle =  this.workbook.Sheets[sheetName][currentCellCol + 5].v;     
            var setName =  '';
            if(j === 1){
                setName =  'Nutrition Male';
            }
            else{
                setName = 'Nutrition Female';
            }
            for (var i = 6; i < 16; i++) {            
                var headerCell = 'A' + i;
                var valueCell = currentCellCol + i;
                var headerValue = this.workbook.Sheets[sheetName][headerCell].v;
                var dataValue = this.workbook.Sheets[sheetName][valueCell].v;

                if(headerValue != '' && dataValue != '') {
                    var metricName = 'Nutrition ' + headerValue + ' ' + currentColumnTitle;                
                    console.log("Uploaded: " + metricName);                
                    try{
                        var setIdResult = await setsDataAccess.getSetId(setName);
                        var metricIdResult = await metricDataAccess.insertMetric(metricName, setIdResult.recordset[0].Id);
                        dataDataAccess.insertData(metricIdResult.recordset[0].Id, facilityViewId, dataValue, sheetDate);
                    }
                    catch(e){
                        console.log("uploadNutritionGender error: " + e);
                    }
                }     
            }
        }
    }

    async uploadMalariaPrevention(sheetName: string, facilityViewId, sheetDate) {
        var sqlConfig = config.get('sqlConfig');
        var groupsDataAccess = new GroupsDataAccess(sqlConfig);
        var setsDataAccess = new SetsDataAccess(sqlConfig);
        var metricDataAccess = new MetricsDataAccess(sqlConfig);
        var dataDataAccess = new DataDataAccess(sqlConfig);

        try {
            var groupResult = await groupsDataAccess.insertGroup('Malaria Prevention');
            await setsDataAccess.insertSet('Malaria Prevention', groupResult.recordset[0].Id);     
        }
        catch(e) {
            console.log("Insert group/set error: " + e);
        }
        
        for (var i = 6; i < 7; i++){            
            var headerCell = 'A' + i;
            var valueCell = 'B' + i;
            var headerValue = this.workbook.Sheets[sheetName][headerCell].v;
            var dataValue = this.workbook.Sheets[sheetName][valueCell].v;

            var setName = 'Malaria Prevention';
            if(headerValue != '' && dataValue != '') {
                var metricName = 'Malaria Prevention ' + headerValue;                
                console.log("Uploaded: " + metricName + ' ' + dataValue);
                try{
                    var setIdResult = await setsDataAccess.getSetId(setName);
                    var metricIdResult = await metricDataAccess.insertMetric(metricName, setIdResult.recordset[0].Id);
                    dataDataAccess.insertData(metricIdResult.recordset[0].Id, facilityViewId, dataValue, sheetDate);
                }
                catch(e){
                    console.log("uploadMalariaPrevention error: " + e);
                }
            }     
        }
    }

    async uploadIMCIGender(sheetName: string, facilityViewId, sheetDate) {
        var sqlConfig = config.get('sqlConfig');
        var groupsDataAccess = new GroupsDataAccess(sqlConfig);
        var setsDataAccess = new SetsDataAccess(sqlConfig);
        var metricDataAccess = new MetricsDataAccess(sqlConfig);
        var dataDataAccess = new DataDataAccess(sqlConfig);

        try {
            var groupResult = await groupsDataAccess.insertGroup('IMCI Gender');
            await setsDataAccess.insertSet('IMCI Gender Male', groupResult.recordset[0].Id);
            await setsDataAccess.insertSet('IMCI Gender Female', groupResult.recordset[0].Id);       
        }
        catch(e) {
            console.log("Insert group/set error: " + e);
        }
        for (var j = 1; j < 3; j++) {
            var currentCellCol = String.fromCharCode('A'.charCodeAt(0) + j);
            var currentColumnTitle =  this.workbook.Sheets[sheetName][currentCellCol + 5].v;     
            var setName =  '';
            if(j === 1){
                setName = 'IMCI Gender Male';
            }
            else{
                setName = 'IMCI Gender Female';
            }
            for (var i = 6; i < 12; i++) {            
                var headerCell = 'A' + i;
                var valueCell = currentCellCol + i;
                var headerValue = this.workbook.Sheets[sheetName][headerCell].v;
                var dataValue = this.workbook.Sheets[sheetName][valueCell].v;

                if(headerValue != '' && dataValue != '') {
                    var metricName = 'IMCI Gender ' + headerValue + ' ' + currentColumnTitle;                
                    console.log("Uploaded: " + metricName);                
                    try{
                        var setIdResult = await setsDataAccess.getSetId(setName);
                        var metricIdResult = await metricDataAccess.insertMetric(metricName, setIdResult.recordset[0].Id);
                        dataDataAccess.insertData(metricIdResult.recordset[0].Id, facilityViewId, dataValue, sheetDate);
                    }
                    catch(e){
                        console.log("uploadIMCIGender error: " + e);
                    }
                }     
            }
        }
    }

    async uploadFamilyPlanningAGender(sheetName: string, facilityViewId, sheetDate) {
        var sqlConfig = config.get('sqlConfig');
        var groupsDataAccess = new GroupsDataAccess(sqlConfig);
        var setsDataAccess = new SetsDataAccess(sqlConfig);
        var metricDataAccess = new MetricsDataAccess(sqlConfig);
        var dataDataAccess = new DataDataAccess(sqlConfig);

        try {
            var groupResult = await groupsDataAccess.insertGroup('Family Planning A Gender');
            await setsDataAccess.insertSet('Family Planning A Male', groupResult.recordset[0].Id);
            await setsDataAccess.insertSet('Family Planning A Female', groupResult.recordset[0].Id);       
        }
        catch(e) {
            console.log("Insert group/set error: " + e);
        }
        for (var j = 1; j < 3; j++) {
            var currentCellCol = String.fromCharCode('A'.charCodeAt(0) + j);
            var currentColumnTitle =  this.workbook.Sheets[sheetName][currentCellCol + 5].v;     
            var setName =  '';
            if(j === 1){
                setName = 'Family Planning A Male';
            }
            else{
                setName = 'Family Planning A Female';
            }
            for (var i = 6; i < 11; i++) {            
                var headerCell = 'A' + i;
                var valueCell = currentCellCol + i;
                var headerValue = this.workbook.Sheets[sheetName][headerCell].v;
                var dataValue = this.workbook.Sheets[sheetName][valueCell].v;

                if(headerValue != '' && dataValue != '') {
                    var metricName = 'Family Planning A ' + headerValue + ' ' + currentColumnTitle;                
                    console.log("Uploaded: " + metricName);                
                    try{
                        var setIdResult = await setsDataAccess.getSetId(setName);
                        var metricIdResult = await metricDataAccess.insertMetric(metricName, setIdResult.recordset[0].Id);
                        dataDataAccess.insertData(metricIdResult.recordset[0].Id, facilityViewId, dataValue, sheetDate);
                    }
                    catch(e){
                        console.log("uploadFamilyPlanningGender error: " + e);
                    }
                }     
            }
        }
    }

    async uploadFamilyPlanningBDefault(sheetName: string, facilityViewId, sheetDate) {
        var sqlConfig = config.get('sqlConfig');
        var groupsDataAccess = new GroupsDataAccess(sqlConfig);
        var setsDataAccess = new SetsDataAccess(sqlConfig);
        var metricDataAccess = new MetricsDataAccess(sqlConfig);
        var dataDataAccess = new DataDataAccess(sqlConfig);

        try {
            var groupResult = await groupsDataAccess.insertGroup('Family Planning B Default');
            await setsDataAccess.insertSet('Family Planning B', groupResult.recordset[0].Id);     
        }
        catch(e) {
            console.log("Insert group/set error: " + e);
        }
        
        for (var i = 6; i < 16; i++){            
            var headerCell = 'A' + i;
            var valueCell = 'B' + i;
            var headerValue = this.workbook.Sheets[sheetName][headerCell].v;
            var dataValue = this.workbook.Sheets[sheetName][valueCell].v;

            var setName = 'Family Planning B';
            if(headerValue != '' && dataValue != '') {
                var metricName = 'Family Planning B ' + headerValue;                
                console.log("Uploaded: " + metricName + ' ' + dataValue);
                try{
                    var setIdResult = await setsDataAccess.getSetId(setName);
                    var metricIdResult = await metricDataAccess.insertMetric(metricName, setIdResult.recordset[0].Id);
                    dataDataAccess.insertData(metricIdResult.recordset[0].Id, facilityViewId, dataValue, sheetDate);
                }
                catch(e){
                    console.log("uploadFamilyPlanningBDefault error: " + e);
                }
            }     
        }
    }

    async uploadReferralsDefault(sheetName: string, facilityViewId, sheetDate) {
        var sqlConfig = config.get('sqlConfig');
        var groupsDataAccess = new GroupsDataAccess(sqlConfig);
        var setsDataAccess = new SetsDataAccess(sqlConfig);
        var metricDataAccess = new MetricsDataAccess(sqlConfig);
        var dataDataAccess = new DataDataAccess(sqlConfig);

        try {
            var groupResult = await groupsDataAccess.insertGroup('Referrals Default');
            await setsDataAccess.insertSet('Referrals', groupResult.recordset[0].Id);     
        }
        catch(e) {
            console.log("Insert group/set error: " + e);
        }
        
        for (var i = 6; i < 12; i++){            
            var headerCell = 'A' + i;
            var valueCell = 'B' + i;
            var headerValue = this.workbook.Sheets[sheetName][headerCell].v;
            var dataValue = this.workbook.Sheets[sheetName][valueCell].v;

            var setName = 'Referrals';
            if(headerValue != '' && dataValue != '') {
                var metricName = 'Referrals ' + headerValue;                
                console.log("Uploaded: " + metricName + ' ' + dataValue);
                try{
                    var setIdResult = await setsDataAccess.getSetId(setName);
                    var metricIdResult = await metricDataAccess.insertMetric(metricName, setIdResult.recordset[0].Id);
                    dataDataAccess.insertData(metricIdResult.recordset[0].Id, facilityViewId, dataValue, sheetDate);
                }
                catch(e){
                    console.log("uploadReferralsDefault error: " + e);
                }
            }     
        }
    }

    async uploadNonCommunicableDisease(sheetName: string, facilityViewId, sheetDate) {
        var sqlConfig = config.get('sqlConfig');
        var groupsDataAccess = new GroupsDataAccess(sqlConfig);
        var setsDataAccess = new SetsDataAccess(sqlConfig);
        var metricDataAccess = new MetricsDataAccess(sqlConfig);
        var dataDataAccess = new DataDataAccess(sqlConfig);

        try {
            var groupResult = await groupsDataAccess.insertGroup('Non Communicable Disease Gender');
            await setsDataAccess.insertSet('Non Communicable Disease Male', groupResult.recordset[0].Id);
            await setsDataAccess.insertSet('Non Communicable Disease Female', groupResult.recordset[0].Id);       
        }
        catch(e) {
            console.log("Insert group/set error: " + e);
        }
        for (var j = 1; j < 3; j++) {
            var currentCellCol = String.fromCharCode('A'.charCodeAt(0) + j);
            var currentColumnTitle =  this.workbook.Sheets[sheetName][currentCellCol + 5].v;     
            var setName =  '';
            if(j === 1){
                setName = 'Non Communicable Disease Male';
            }
            else{
                setName = 'Non Communicable Disease Female';
            }
            for (var i = 6; i < 15; i++) {            
                var headerCell = 'A' + i;
                var valueCell = currentCellCol + i;
                var headerValue = this.workbook.Sheets[sheetName][headerCell].v;
                var dataValue = this.workbook.Sheets[sheetName][valueCell].v;

                if(headerValue != '' && dataValue != '') {
                    var metricName = 'Non Communicable Disease ' + headerValue + ' ' + currentColumnTitle;                
                    console.log("Uploaded: " + metricName);                
                    try{
                        var setIdResult = await setsDataAccess.getSetId(setName);
                        var metricIdResult = await metricDataAccess.insertMetric(metricName, setIdResult.recordset[0].Id);
                        dataDataAccess.insertData(metricIdResult.recordset[0].Id, facilityViewId, dataValue, sheetDate);
                    }
                    catch(e){
                        console.log("uploadNonCommunicableDisease error: " + e);
                    }
                }     
            }
        }
    }

    async uploadSexuallyTransmittedInfections(sheetName: string, facilityViewId, sheetDate) {
        var sqlConfig = config.get('sqlConfig');
        var groupsDataAccess = new GroupsDataAccess(sqlConfig);
        var setsDataAccess = new SetsDataAccess(sqlConfig);
        var metricDataAccess = new MetricsDataAccess(sqlConfig);
        var dataDataAccess = new DataDataAccess(sqlConfig);

        try {
            var groupResult = await groupsDataAccess.insertGroup('Sexually transmitted Infections');
            await setsDataAccess.insertSet('Sexually transmitted Infections', groupResult.recordset[0].Id);     
        }
        catch(e) {
            console.log("Insert group/set error: " + e);
        }
        
        for (var i = 6; i < 8; i++){            
            var headerCell = 'A' + i;
            var valueCell = 'B' + i;
            var headerValue = this.workbook.Sheets[sheetName][headerCell].v;
            var dataValue = this.workbook.Sheets[sheetName][valueCell].v;

            var setName = 'Sexually transmitted Infections';
            if(headerValue != '' && dataValue != '') {
                var metricName = 'Sexually transmitted Infections ' + headerValue;                
                console.log("Uploaded: " + metricName + ' ' + dataValue);
                try{
                    var setIdResult = await setsDataAccess.getSetId(setName);
                    var metricIdResult = await metricDataAccess.insertMetric(metricName, setIdResult.recordset[0].Id);
                    dataDataAccess.insertData(metricIdResult.recordset[0].Id, facilityViewId, dataValue, sheetDate);
                }
                catch(e){
                    console.log("uploadSexuallyTransmittedInfections error: " + e);
                }
            }     
        }
    }

    async uploadLaboratoryDefault(sheetName: string, facilityViewId, sheetDate) {
        var sqlConfig = config.get('sqlConfig');
        var groupsDataAccess = new GroupsDataAccess(sqlConfig);
        var setsDataAccess = new SetsDataAccess(sqlConfig);
        var metricDataAccess = new MetricsDataAccess(sqlConfig);
        var dataDataAccess = new DataDataAccess(sqlConfig);

        try {
            var groupResult = await groupsDataAccess.insertGroup('Laboratory Default');
            await setsDataAccess.insertSet('ANC Anaemia', groupResult.recordset[0].Id);
            await setsDataAccess.insertSet('ANC Proteinuria', groupResult.recordset[0].Id);  
            await setsDataAccess.insertSet('HIV Rapid Antibody', groupResult.recordset[0].Id);
            await setsDataAccess.insertSet('Sputum AFB', groupResult.recordset[0].Id);       
        }
        catch(e) {
            console.log("Insert group/set error: " + e);
        }
        
        for (var i = 6; i < 13; i++){            
            var headerCell = 'A' + i;
            var valueCell = 'B' + i;
            var headerValue = this.workbook.Sheets[sheetName][headerCell].v;
            var dataValue = this.workbook.Sheets[sheetName][valueCell].v;

            var setName = '';
            if(i < 8) { 
                setName = 'ANC Anaemia';
            } else if (i < 10){
                setName = 'ANC Proteinuria';
            }
            else if ( i < 11) {
                setName = 'HIV Rapid Antibody';
            }
            else {
                setName = 'Sputum AFB';
            }
            if(headerValue != '' && dataValue != '') {
                var metricName = 'Laboratory Default ' + headerValue;                
                console.log("Uploaded: " + metricName + ' ' + dataValue);
                try{
                    var setIdResult = await setsDataAccess.getSetId(setName);
                    var metricIdResult = await metricDataAccess.insertMetric(metricName, setIdResult.recordset[0].Id);
                    dataDataAccess.insertData(metricIdResult.recordset[0].Id, facilityViewId, dataValue, sheetDate);
                }
                catch(e){
                    console.log("uploadLaboratoryDefault error: " + e);
                }
            }     
        }
    }

    async uploadInpatient(sheetName: string, facilityViewId, sheetDate) {
        var sqlConfig = config.get('sqlConfig');
        var groupsDataAccess = new GroupsDataAccess(sqlConfig);
        var setsDataAccess = new SetsDataAccess(sqlConfig);
        var metricDataAccess = new MetricsDataAccess(sqlConfig);
        var dataDataAccess = new DataDataAccess(sqlConfig);

        try {
            var groupResult = await groupsDataAccess.insertGroup('Inpatient Default');
            await setsDataAccess.insertSet('Inpatient', groupResult.recordset[0].Id);     
        }
        catch(e) {
            console.log("Insert group/set error: " + e);
        }
        
        for (var i = 6; i < 9; i++){            
            var headerCell = 'A' + i;
            var valueCell = 'B' + i;
            var headerValue = this.workbook.Sheets[sheetName][headerCell].v;
            var dataValue = this.workbook.Sheets[sheetName][valueCell].v;

            var setName = 'Inpatient';
            if(headerValue != '' && dataValue != '') {
                var metricName = 'Inpatient ' + headerValue;                
                console.log("Uploaded: " + metricName + ' ' + dataValue);
                try{
                    var setIdResult = await setsDataAccess.getSetId(setName);
                    var metricIdResult = await metricDataAccess.insertMetric(metricName, setIdResult.recordset[0].Id);
                    dataDataAccess.insertData(metricIdResult.recordset[0].Id, facilityViewId, dataValue, sheetDate);
                }
                catch(e){
                    console.log("uploadInpatient error: " + e);
                }
            }     
        }
    }

    async uploadInpatientAdmissionsAge(sheetName: string, facilityViewId, sheetDate) {
        var sqlConfig = config.get('sqlConfig');
        var groupsDataAccess = new GroupsDataAccess(sqlConfig);
        var setsDataAccess = new SetsDataAccess(sqlConfig);
        var metricDataAccess = new MetricsDataAccess(sqlConfig);
        var dataDataAccess = new DataDataAccess(sqlConfig);

        try {
            var groupResult = await groupsDataAccess.insertGroup('Inpatient Admissions Age');
            await setsDataAccess.insertSet('Inpatient Admissions Age Male', groupResult.recordset[0].Id);
            await setsDataAccess.insertSet('Inpatient Admissions Age Female', groupResult.recordset[0].Id);
        }
        catch(e){
            console.log("Insert group/set error: " + e);
        }
        

        for (var i = 1; i < 13; i++){
            var currentCellCol = String.fromCharCode('A'.charCodeAt(0) + i);
            var headerCell = currentCellCol + 5;
            var valueCell = currentCellCol + 6;
            var headerValue = this.workbook.Sheets[sheetName][headerCell].v;
            var dataValue = this.workbook.Sheets[sheetName][valueCell].v;

            var setName = '';
            if(headerValue != '' && dataValue != '') {
                var metricName = 'Inpatient Admissions Age ' + headerValue;
                if (headerValue.includes('Female')) { 
                    setName = 'Inpatient Admissions Age Female';                    
                } 
                else {
                    setName = 'Inpatient Admissions Age Male'; 
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

    async uploadPharmaceuticalServiceDefault(sheetName: string, facilityViewId, sheetDate) {
        var sqlConfig = config.get('sqlConfig');
        var groupsDataAccess = new GroupsDataAccess(sqlConfig);
        var setsDataAccess = new SetsDataAccess(sqlConfig);
        var metricDataAccess = new MetricsDataAccess(sqlConfig);
        var dataDataAccess = new DataDataAccess(sqlConfig);

        try {
            var groupResult = await groupsDataAccess.insertGroup('Pharmaceutical Service');
            await setsDataAccess.insertSet('Pharmaceutical Service', groupResult.recordset[0].Id);     
        }
        catch(e) {
            console.log("Insert group/set error: " + e);
        }
        
        for (var i = 6; i < 10; i++){            
            var headerCell = 'A' + i;
            var valueCell = 'B' + i;
            var headerValue = this.workbook.Sheets[sheetName][headerCell].v;
            var dataValue = this.workbook.Sheets[sheetName][valueCell].v;

            var setName = 'Pharmaceutical Service';
            if(headerValue != '' && dataValue != '') {
                var metricName = 'Pharmaceutical Service ' + headerValue;                
                console.log("Uploaded: " + metricName + ' ' + dataValue);
                try{
                    var setIdResult = await setsDataAccess.getSetId(setName);
                    var metricIdResult = await metricDataAccess.insertMetric(metricName, setIdResult.recordset[0].Id);
                    dataDataAccess.insertData(metricIdResult.recordset[0].Id, facilityViewId, dataValue, sheetDate);
                }
                catch(e){
                    console.log("uploadPharmaceuticalServiceDefault error: " + e);
                }
            }     
        }
    }

    async uploadAdverseDrugReactionA(sheetName: string, facilityViewId, sheetDate) {
        var sqlConfig = config.get('sqlConfig');
        var groupsDataAccess = new GroupsDataAccess(sqlConfig);
        var setsDataAccess = new SetsDataAccess(sqlConfig);
        var metricDataAccess = new MetricsDataAccess(sqlConfig);
        var dataDataAccess = new DataDataAccess(sqlConfig);

        try {
            var groupResult = await groupsDataAccess.insertGroup('Adverse Drug Reaction');
            await setsDataAccess.insertSet('Adverse Drug Reaction', groupResult.recordset[0].Id);     
        }
        catch(e) {
            console.log("Insert group/set error: " + e);
        }
        
        for (var i = 6; i < 9; i++){            
            var headerCell = 'A' + i;
            var valueCell = 'B' + i;
            var headerValue = this.workbook.Sheets[sheetName][headerCell].v;
            var dataValue = this.workbook.Sheets[sheetName][valueCell].v;

            var setName = 'Adverse Drug Reaction';
            if(headerValue != '' && dataValue != '') {
                var metricName = headerValue;                
                console.log("Uploaded: " + metricName + ' ' + dataValue);
                try{
                    var setIdResult = await setsDataAccess.getSetId(setName);
                    var metricIdResult = await metricDataAccess.insertMetric(metricName, setIdResult.recordset[0].Id);
                    dataDataAccess.insertData(metricIdResult.recordset[0].Id, facilityViewId, dataValue, sheetDate);
                }
                catch(e){
                    console.log("uploadAdverseDrugReactionA error: " + e);
                }
            }     
        }
    }

    async uploadAdverseDrugReactionB(sheetName: string, facilityViewId, sheetDate) {
        var sqlConfig = config.get('sqlConfig');
        var groupsDataAccess = new GroupsDataAccess(sqlConfig);
        var setsDataAccess = new SetsDataAccess(sqlConfig);
        var metricDataAccess = new MetricsDataAccess(sqlConfig);
        var dataDataAccess = new DataDataAccess(sqlConfig);

        try {
            var groupResult = await groupsDataAccess.insertGroup('Adverse Drug Reaction B');
            await setsDataAccess.insertSet('Adverse Drug Reaction B', groupResult.recordset[0].Id);
        }
        catch(e){
            console.log("Insert group/set error: " + e);
        }
        
        for (var i = 1; i < 3; i++){
            var currentCellCol = String.fromCharCode('A'.charCodeAt(0) + i);
            var headerCell = currentCellCol + 5;
            var valueCell = currentCellCol + 6;
            var headerValue = this.workbook.Sheets[sheetName][headerCell].v;
            var dataValue = this.workbook.Sheets[sheetName][valueCell].v;

            var setName = 'Adverse Drug Reaction B';
            if(headerValue != '' && dataValue != '') {
                var metricName = 'Adverse Drug Reaction B ' + headerValue;
                console.log("Uploaded: " + metricName);
                try{
                    var setIdResult = await setsDataAccess.getSetId(setName);
                    var metricIdResult = await metricDataAccess.insertMetric(metricName, setIdResult.recordset[0].Id);
                    dataDataAccess.insertData(metricIdResult.recordset[0].Id, facilityViewId, dataValue, sheetDate);
                }
                catch(e){
                    console.log("uploadAdverseDrugReactionB error: " + e);
                }
            }     
        }
    }

    async uploadMortalityAge(sheetName: string, facilityViewId, sheetDate) {
        var sqlConfig = config.get('sqlConfig');
        var groupsDataAccess = new GroupsDataAccess(sqlConfig);
        var setsDataAccess = new SetsDataAccess(sqlConfig);
        var metricDataAccess = new MetricsDataAccess(sqlConfig);
        var dataDataAccess = new DataDataAccess(sqlConfig);

        try {
            var groupResult = await groupsDataAccess.insertGroup('Mortality Age');
            await setsDataAccess.insertSet('Mortality Age Male', groupResult.recordset[0].Id);
            await setsDataAccess.insertSet('Mortality Age Female', groupResult.recordset[0].Id);
        }
        catch(e){
            console.log("Insert group/set error: " + e);
        }
        

        for (var i = 1; i < 13; i++){
            var currentCellCol = String.fromCharCode('A'.charCodeAt(0) + i);
            var headerCell = currentCellCol + 5;
            var valueCell = currentCellCol + 6;
            var headerValue = this.workbook.Sheets[sheetName][headerCell].v;
            var dataValue = this.workbook.Sheets[sheetName][valueCell].v;

            var setName = '';
            if(headerValue != '' && dataValue != '') {
                var metricName = 'Mortality Age ' + headerValue;
                if (headerValue.includes('Female')) { 
                    setName = 'Mortality Age Female';                    
                } 
                else {
                    setName = 'Mortality Age Male'; 
                }

                console.log("Uploaded: " + metricName);
                try{
                    var setIdResult = await setsDataAccess.getSetId(setName);
                    var metricIdResult = await metricDataAccess.insertMetric(metricName, setIdResult.recordset[0].Id);
                    dataDataAccess.insertData(metricIdResult.recordset[0].Id, facilityViewId, dataValue, sheetDate);
                }
                catch(e){
                    console.log("uploadMortalityAge error: " + e);
                }
            }     
        }
    }

    async uploadMaternalMortalityA(sheetName: string, facilityViewId, sheetDate) {
        var sqlConfig = config.get('sqlConfig');
        var groupsDataAccess = new GroupsDataAccess(sqlConfig);
        var setsDataAccess = new SetsDataAccess(sqlConfig);
        var metricDataAccess = new MetricsDataAccess(sqlConfig);
        var dataDataAccess = new DataDataAccess(sqlConfig);

        try {
            var groupResult = await groupsDataAccess.insertGroup('Maternal Mortality');
            await setsDataAccess.insertSet('Maternal Mortality', groupResult.recordset[0].Id);     
        }
        catch(e) {
            console.log("Insert group/set error: " + e);
        }
        
        for (var i = 6; i < 8; i++){            
            var headerCell = 'A' + i;
            var valueCell = 'B' + i;
            var headerValue = this.workbook.Sheets[sheetName][headerCell].v;
            var dataValue = this.workbook.Sheets[sheetName][valueCell].v;

            var setName = 'Maternal Mortality';
            if(headerValue != '' && dataValue != '') {
                var metricName = headerValue;                
                console.log("Uploaded: " + metricName + ' ' + dataValue);
                try{
                    var setIdResult = await setsDataAccess.getSetId(setName);
                    var metricIdResult = await metricDataAccess.insertMetric(metricName, setIdResult.recordset[0].Id);
                    dataDataAccess.insertData(metricIdResult.recordset[0].Id, facilityViewId, dataValue, sheetDate);
                }
                catch(e){
                    console.log("uploadMaternalMortalityA error: " + e);
                }
            }     
        }
    }

    async uploadMaternalMortalityB(sheetName: string, facilityViewId, sheetDate) {
        var sqlConfig = config.get('sqlConfig');
        var groupsDataAccess = new GroupsDataAccess(sqlConfig);
        var setsDataAccess = new SetsDataAccess(sqlConfig);
        var metricDataAccess = new MetricsDataAccess(sqlConfig);
        var dataDataAccess = new DataDataAccess(sqlConfig);

        try {
            var groupResult = await groupsDataAccess.insertGroup('Maternal Mortality B Maternal D');
            await setsDataAccess.insertSet('Maternal Mortality B', groupResult.recordset[0].Id);
        }
        catch(e){
            console.log("Insert group/set error: " + e);
        }
        
        for (var i = 1; i < 11; i++){
            var currentCellCol = String.fromCharCode('A'.charCodeAt(0) + i);
            var headerCell = currentCellCol + 5;
            var valueCell = currentCellCol + 6;
            var headerValue = this.workbook.Sheets[sheetName][headerCell].v;
            var dataValue = this.workbook.Sheets[sheetName][valueCell].v;

            var setName = 'Maternal Mortality B';
            if(headerValue != '' && dataValue != '') {
                var metricName = 'Maternal Mortality B ' + headerValue;
                console.log("Uploaded: " + metricName);
                try{
                    var setIdResult = await setsDataAccess.getSetId(setName);
                    var metricIdResult = await metricDataAccess.insertMetric(metricName, setIdResult.recordset[0].Id);
                    dataDataAccess.insertData(metricIdResult.recordset[0].Id, facilityViewId, dataValue, sheetDate);
                }
                catch(e){
                    console.log("uploadMaternalMortalityB error: " + e);
                }
            }     
        }
    }

    //////

    async uploadNeoNatalDeaths(sheetName: string, facilityViewId, sheetDate) {
        var sqlConfig = config.get('sqlConfig');
        var groupsDataAccess = new GroupsDataAccess(sqlConfig);
        var setsDataAccess = new SetsDataAccess(sqlConfig);
        var metricDataAccess = new MetricsDataAccess(sqlConfig);
        var dataDataAccess = new DataDataAccess(sqlConfig);

        try {
            var groupResult = await groupsDataAccess.insertGroup('Neonatal Deaths');
            await setsDataAccess.insertSet('Neonatal Deaths', groupResult.recordset[0].Id);
        }
        catch(e){
            console.log("Insert group/set error: " + e);
        }
        
        for (var i = 1; i < 8; i++){
            var currentCellCol = String.fromCharCode('A'.charCodeAt(0) + i);
            var headerCell = currentCellCol + 5;
            var valueCell = currentCellCol + 6;
            var headerValue = this.workbook.Sheets[sheetName][headerCell].v;
            var dataValue = this.workbook.Sheets[sheetName][valueCell].v;

            var setName = 'Neonatal Deaths';
            if(headerValue != '' && dataValue != '') {
                var metricName = 'Neonatal Deaths Cause ' + headerValue;
                console.log("Uploaded: " + metricName);
                try{
                    var setIdResult = await setsDataAccess.getSetId(setName);
                    var metricIdResult = await metricDataAccess.insertMetric(metricName, setIdResult.recordset[0].Id);
                    dataDataAccess.insertData(metricIdResult.recordset[0].Id, facilityViewId, dataValue, sheetDate);
                }
                catch(e){
                    console.log("Neonatal Deaths error: " + e);
                }
            }     
        }
    }

    async uploadUnder5Mortality(sheetName: string, facilityViewId, sheetDate) {
        var sqlConfig = config.get('sqlConfig');
        var groupsDataAccess = new GroupsDataAccess(sqlConfig);
        var setsDataAccess = new SetsDataAccess(sqlConfig);
        var metricDataAccess = new MetricsDataAccess(sqlConfig);
        var dataDataAccess = new DataDataAccess(sqlConfig);

        try {
            var groupResult = await groupsDataAccess.insertGroup('Under 5 Mortality');
            await setsDataAccess.insertSet('Under 5 Mortality', groupResult.recordset[0].Id);
        }
        catch(e){
            console.log("Insert group/set error: " + e);
        }
        
        for (var i = 1; i < 6; i++){
            var currentCellCol = String.fromCharCode('A'.charCodeAt(0) + i);
            var headerCell = currentCellCol + 5;
            var valueCell = currentCellCol + 6;
            var headerValue = this.workbook.Sheets[sheetName][headerCell].v;
            var dataValue = this.workbook.Sheets[sheetName][valueCell].v;

            var setName = 'Under 5 Mortality';
            if(headerValue != '' && dataValue != '') {
                var metricName = 'Under 5 Mortality Cause ' + headerValue;
                console.log("Uploaded: " + metricName);
                try{
                    var setIdResult = await setsDataAccess.getSetId(setName);
                    var metricIdResult = await metricDataAccess.insertMetric(metricName, setIdResult.recordset[0].Id);
                    dataDataAccess.insertData(metricIdResult.recordset[0].Id, facilityViewId, dataValue, sheetDate);
                }
                catch(e){
                    console.log("Under 5 Mortality error: " + e);
                }
            }     
        }
    }

    async uploadHIVCounsellingAndTesting(sheetName: string, facilityViewId, sheetDate) {
        var sqlConfig = config.get('sqlConfig');
        var groupsDataAccess = new GroupsDataAccess(sqlConfig);
        var setsDataAccess = new SetsDataAccess(sqlConfig);
        var metricDataAccess = new MetricsDataAccess(sqlConfig);
        var dataDataAccess = new DataDataAccess(sqlConfig);

        try {
            var groupResult = await groupsDataAccess.insertGroup('HIV Counselling And Testing');
            await setsDataAccess.insertSet('HIV Counselling And Testing Female', groupResult.recordset[0].Id); 
            await setsDataAccess.insertSet('HIV Counselling And Testing Male', groupResult.recordset[0].Id);     
        }       
        catch(e) {
            console.log("Insert group/set error: " + e);
        }
        
        for (var j = 1; j < 15; j++) {
            var currentCellCol = String.fromCharCode('A'.charCodeAt(0) + j);
            var currentColumnTitle =  this.workbook.Sheets[sheetName][currentCellCol + 5].v;            
            for (var i = 6; i < 8; i++){            
                var headerCell = 'A' + i;
                var valueCell = currentCellCol + i;
                var headerValue = this.workbook.Sheets[sheetName][headerCell].v;
                var dataValue = this.workbook.Sheets[sheetName][valueCell].v;

                var setName = '';
                if (currentColumnTitle.includes('Female')) { 
                    setName = 'HIV Counselling And Testing Female';                    
                } 
                else {
                    setName = 'HIV Counselling And Testing Male'; 
                }
                if(headerValue != '' && dataValue != '') {
                    var metricName = headerValue + ' ' + currentColumnTitle;                
                    console.log("Uploaded: " + metricName);                
                    try{
                        var setIdResult = await setsDataAccess.getSetId(setName);
                        var metricIdResult = await metricDataAccess.insertMetric(metricName, setIdResult.recordset[0].Id);
                        dataDataAccess.insertData(metricIdResult.recordset[0].Id, facilityViewId, dataValue, sheetDate);
                    }
                    catch(e){
                        console.log("HIV Counselling And Testing error: " + e);
                    }
                }     
            }
        }
    }

    async uploadHIVCounsellingAndTestingB(sheetName: string, facilityViewId, sheetDate) {
        var sqlConfig = config.get('sqlConfig');
        var groupsDataAccess = new GroupsDataAccess(sqlConfig);
        var setsDataAccess = new SetsDataAccess(sqlConfig);
        var metricDataAccess = new MetricsDataAccess(sqlConfig);
        var dataDataAccess = new DataDataAccess(sqlConfig);

        try {
            var groupResult = await groupsDataAccess.insertGroup('HIV Counselling And Testing');
            await setsDataAccess.insertSet('HIV Counselling Couples', groupResult.recordset[0].Id);    
        }
        catch(e) {
            console.log("Insert group/set error: " + e);
        }
        
        for (var i = 6; i < 8; i++){            
            var headerCell = 'A' + i;
            var valueCell = 'B' + i;
            var headerValue = this.workbook.Sheets[sheetName][headerCell].v;
            var dataValue = this.workbook.Sheets[sheetName][valueCell].v;

            var setName = 'HIV Counselling Couples';
            if(headerValue != '' && dataValue != '') {
                var metricName = headerValue;                
                console.log("Uploaded: " + metricName);
                
                try{
                    var setIdResult = await setsDataAccess.getSetId(setName);
                    var metricIdResult = await metricDataAccess.insertMetric(metricName, setIdResult.recordset[0].Id);
                    dataDataAccess.insertData(metricIdResult.recordset[0].Id, facilityViewId, dataValue, sheetDate);
                }
                catch(e){
                    console.log("HIV Counselling Couples error: " + e);
                }
            }     
        }
    }

    async uploadHIVCareTreatment(sheetName: string, facilityViewId, sheetDate) {
        var sqlConfig = config.get('sqlConfig');
        var groupsDataAccess = new GroupsDataAccess(sqlConfig);
        var setsDataAccess = new SetsDataAccess(sqlConfig);
        var metricDataAccess = new MetricsDataAccess(sqlConfig);
        var dataDataAccess = new DataDataAccess(sqlConfig);

        try {
            var groupResult = await groupsDataAccess.insertGroup('HIV Care Treatment');
            await setsDataAccess.insertSet('HIV Care Treatment Female', groupResult.recordset[0].Id); 
            await setsDataAccess.insertSet('HIV Care Treatment Male', groupResult.recordset[0].Id);     
        }       
        catch(e) {
            console.log("Insert group/set error: " + e);
        }
        
        for (var j = 1; j < 7; j++) {
            var currentCellCol = String.fromCharCode('A'.charCodeAt(0) + j);
            var currentColumnTitle =  this.workbook.Sheets[sheetName][currentCellCol + 5].v;            
            for (var i = 6; i < 8; i++){            
                var headerCell = 'A' + i;
                var valueCell = currentCellCol + i;
                var headerValue = this.workbook.Sheets[sheetName][headerCell].v;
                var dataValue = this.workbook.Sheets[sheetName][valueCell].v;

                var setName = '';
                if (currentColumnTitle.includes('Female')) { 
                    setName = 'HIV Care Treatment Female';                    
                } 
                else {
                    setName = 'HIV Care Treatment Male'; 
                }
                if(headerValue != '' && dataValue != '') {
                    var metricName = headerValue + ' ' + currentColumnTitle;                
                    console.log("Uploaded: " + metricName);                
                    try{
                        var setIdResult = await setsDataAccess.getSetId(setName);
                        var metricIdResult = await metricDataAccess.insertMetric(metricName, setIdResult.recordset[0].Id);
                        dataDataAccess.insertData(metricIdResult.recordset[0].Id, facilityViewId, dataValue, sheetDate);
                    }
                    catch(e){
                        console.log("HIV Care Treatment: " + e);
                    }
                }     
            }
        }
    }

    async uploadSRHHIV(sheetName: string, facilityViewId, sheetDate) {
        var sqlConfig = config.get('sqlConfig');
        var groupsDataAccess = new GroupsDataAccess(sqlConfig);
        var setsDataAccess = new SetsDataAccess(sqlConfig);
        var metricDataAccess = new MetricsDataAccess(sqlConfig);
        var dataDataAccess = new DataDataAccess(sqlConfig);

        try {
            var groupResult = await groupsDataAccess.insertGroup('SRHHIV Integration');
            await setsDataAccess.insertSet('SRHHIV Integration', groupResult.recordset[0].Id);     
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

                var setName = 'SRHHIV Integration';
                if(headerValue != '' && dataValue != '') {
                    var metricName = 'SRHHIV ' + headerValue + ' ' + currentColumnTitle;                
                    console.log("Uploaded: " + metricName);                
                    try{
                        var setIdResult = await setsDataAccess.getSetId(setName);
                        var metricIdResult = await metricDataAccess.insertMetric(metricName, setIdResult.recordset[0].Id);
                        dataDataAccess.insertData(metricIdResult.recordset[0].Id, facilityViewId, dataValue, sheetDate);
                    }
                    catch(e){
                        console.log("SRHHIV Integration error: " + e);
                    }
                }     
            }
        }
    }

    async uploadTBHIV(sheetName: string, facilityViewId, sheetDate) {
        var sqlConfig = config.get('sqlConfig');
        var groupsDataAccess = new GroupsDataAccess(sqlConfig);
        var setsDataAccess = new SetsDataAccess(sqlConfig);
        var metricDataAccess = new MetricsDataAccess(sqlConfig);
        var dataDataAccess = new DataDataAccess(sqlConfig);

        try {
            var groupResult = await groupsDataAccess.insertGroup('TBHIV');
            await setsDataAccess.insertSet('TBHIV', groupResult.recordset[0].Id);    
        }
        catch(e) {
            console.log("Insert group/set error: " + e);
        }
        
        for (var i = 6; i < 14; i++){            
            var headerCell = 'A' + i;
            var valueCell = 'B' + i;
            var headerValue = this.workbook.Sheets[sheetName][headerCell].v;
            var dataValue = this.workbook.Sheets[sheetName][valueCell].v;

            var setName = 'TBHIV';
            if(headerValue != '' && dataValue != '') {
                var metricName = headerValue;                
                console.log("Uploaded: " + metricName);
                
                try{
                    var setIdResult = await setsDataAccess.getSetId(setName);
                    var metricIdResult = await metricDataAccess.insertMetric(metricName, setIdResult.recordset[0].Id);
                    dataDataAccess.insertData(metricIdResult.recordset[0].Id, facilityViewId, dataValue, sheetDate);
                }
                catch(e){
                    console.log("TBHIV error: " + e);
                }
            }     
        }
    }

    async uploadPMTCT(sheetName: string, facilityViewId, sheetDate) {
        var sqlConfig = config.get('sqlConfig');
        var groupsDataAccess = new GroupsDataAccess(sqlConfig);
        var setsDataAccess = new SetsDataAccess(sqlConfig);
        var metricDataAccess = new MetricsDataAccess(sqlConfig);
        var dataDataAccess = new DataDataAccess(sqlConfig);

        try {
            var groupResult = await groupsDataAccess.insertGroup('PMTCT');
            await setsDataAccess.insertSet('PMTCT', groupResult.recordset[0].Id);    
        }
        catch(e) {
            console.log("Insert group/set error: " + e);
        }
        
        for (var i = 6; i < 21; i++){            
            var headerCell = 'A' + i;
            var valueCell = 'B' + i;
            var headerValue = this.workbook.Sheets[sheetName][headerCell].v;
            var dataValue = this.workbook.Sheets[sheetName][valueCell].v;

            var setName = 'PMTCT';
            if(headerValue != '' && dataValue != '') {
                var metricName = headerValue;                
                console.log("Uploaded: " + metricName);
                
                try{
                    var setIdResult = await setsDataAccess.getSetId(setName);
                    var metricIdResult = await metricDataAccess.insertMetric(metricName, setIdResult.recordset[0].Id);
                    dataDataAccess.insertData(metricIdResult.recordset[0].Id, facilityViewId, dataValue, sheetDate);
                }
                catch(e){
                    console.log("PMTCT error: " + e);
                }
            }     
        }
    }

    async uploadPMTCTInfant(sheetName: string, facilityViewId, sheetDate) {
        var sqlConfig = config.get('sqlConfig');
        var groupsDataAccess = new GroupsDataAccess(sqlConfig);
        var setsDataAccess = new SetsDataAccess(sqlConfig);
        var metricDataAccess = new MetricsDataAccess(sqlConfig);
        var dataDataAccess = new DataDataAccess(sqlConfig);

        try {
            var groupResult = await groupsDataAccess.insertGroup('PMTCT Infant');
            await setsDataAccess.insertSet('PMTCT Infant Female', groupResult.recordset[0].Id); 
            await setsDataAccess.insertSet('PMTCT Infant Male', groupResult.recordset[0].Id);     
        }       
        catch(e) {
            console.log("Insert group/set error: " + e);
        }
        
        for (var j = 1; j < 3; j++) {
            var currentCellCol = String.fromCharCode('A'.charCodeAt(0) + j);
            var currentColumnTitle =  this.workbook.Sheets[sheetName][currentCellCol + 5].v;            
            for (var i = 6; i < 13; i++){            
                var headerCell = 'A' + i;
                var valueCell = currentCellCol + i;
                var headerValue = this.workbook.Sheets[sheetName][headerCell].v;
                var dataValue = this.workbook.Sheets[sheetName][valueCell].v;

                var setName = '';
                if (currentColumnTitle.includes('Female')) { 
                    setName = 'PMTCT Infant Female';                    
                } 
                else {
                    setName = 'PMTCT Infant Male'; 
                }
                if(headerValue != '' && dataValue != '') {
                    var metricName = headerValue + ' ' + currentColumnTitle;                
                    console.log("Uploaded: " + metricName);                
                    try{
                        var setIdResult = await setsDataAccess.getSetId(setName);
                        var metricIdResult = await metricDataAccess.insertMetric(metricName, setIdResult.recordset[0].Id);
                        dataDataAccess.insertData(metricIdResult.recordset[0].Id, facilityViewId, dataValue, sheetDate);
                    }
                    catch(e){
                        console.log("PMTCT Infant error: " + e);
                    }
                }     
            }
        }
    }

    async uploadTBLP(sheetName: string, facilityViewId, sheetDate) {
        var sqlConfig = config.get('sqlConfig');
        var groupsDataAccess = new GroupsDataAccess(sqlConfig);
        var setsDataAccess = new SetsDataAccess(sqlConfig);
        var metricDataAccess = new MetricsDataAccess(sqlConfig);
        var dataDataAccess = new DataDataAccess(sqlConfig);

        try {
            var groupResult = await groupsDataAccess.insertGroup('TB Cases');
            await setsDataAccess.insertSet('TB Cases Female', groupResult.recordset[0].Id); 
            await setsDataAccess.insertSet('TB Cases Male', groupResult.recordset[0].Id);     
        }       
        catch(e) {
            console.log("Insert group/set error: " + e);
        }
        
        for (var j = 1; j < 9; j++) {
            var currentCellCol = String.fromCharCode('A'.charCodeAt(0) + j);
            var currentColumnTitle =  this.workbook.Sheets[sheetName][currentCellCol + 5].v;            
            for (var i = 6; i < 13; i++){            
                var headerCell = 'A' + i;
                var valueCell = currentCellCol + i;
                var headerValue = this.workbook.Sheets[sheetName][headerCell].v;
                var dataValue = this.workbook.Sheets[sheetName][valueCell].v;

                var setName = '';
                if (currentColumnTitle.includes('Female')) { 
                    setName = 'TB Cases Female';                    
                } 
                else {
                    setName = 'TB Cases Male'; 
                }
                if(headerValue != '' && dataValue != '') {
                    var metricName = headerValue + ' ' + currentColumnTitle;                
                    console.log("Uploaded: " + metricName);                
                    try{
                        var setIdResult = await setsDataAccess.getSetId(setName);
                        var metricIdResult = await metricDataAccess.insertMetric(metricName, setIdResult.recordset[0].Id);
                        dataDataAccess.insertData(metricIdResult.recordset[0].Id, facilityViewId, dataValue, sheetDate);
                    }
                    catch(e){
                        console.log("TB Cases error: " + e);
                    }
                }     
            }
        }
    }

    async uploadMalariaTesting(sheetName: string, facilityViewId, sheetDate) {
        var sqlConfig = config.get('sqlConfig');
        var groupsDataAccess = new GroupsDataAccess(sqlConfig);
        var setsDataAccess = new SetsDataAccess(sqlConfig);
        var metricDataAccess = new MetricsDataAccess(sqlConfig);
        var dataDataAccess = new DataDataAccess(sqlConfig);

        try {
            var groupResult = await groupsDataAccess.insertGroup('Malaria Testing');
            await setsDataAccess.insertSet('Malaria Testing under 5y', groupResult.recordset[0].Id); 
            await setsDataAccess.insertSet('Malaria Testing over 5y', groupResult.recordset[0].Id);     
        }       
        catch(e) {
            console.log("Insert group/set error: " + e);
        }
        
        for (var j = 1; j < 3; j++) {
            var currentCellCol = String.fromCharCode('A'.charCodeAt(0) + j);
            var currentColumnTitle =  this.workbook.Sheets[sheetName][currentCellCol + 5].v;            
            for (var i = 6; i < 11; i++){            
                var headerCell = 'A' + i;
                var valueCell = currentCellCol + i;
                var headerValue = this.workbook.Sheets[sheetName][headerCell].v;
                var dataValue = this.workbook.Sheets[sheetName][valueCell].v;

                var setName = '';
                if (currentColumnTitle.includes('>=')) { 
                    setName = 'Malaria Testing over 5y';                    
                } 
                else {
                    setName = 'Malaria Testing under 5y'; 
                }
                if(headerValue != '' && dataValue != '') {
                    var metricName = headerValue + ' ' + currentColumnTitle;                
                    console.log("Uploaded: " + metricName);                
                    try{
                        var setIdResult = await setsDataAccess.getSetId(setName);
                        var metricIdResult = await metricDataAccess.insertMetric(metricName, setIdResult.recordset[0].Id);
                        dataDataAccess.insertData(metricIdResult.recordset[0].Id, facilityViewId, dataValue, sheetDate);
                    }
                    catch(e){
                        console.log("Malaria Test Cases error: " + e);
                    }
                }     
            }
        }
    }

    async uploadMalariaInPregnancy(sheetName: string, facilityViewId, sheetDate) {
        var sqlConfig = config.get('sqlConfig');
        var groupsDataAccess = new GroupsDataAccess(sqlConfig);
        var setsDataAccess = new SetsDataAccess(sqlConfig);
        var metricDataAccess = new MetricsDataAccess(sqlConfig);
        var dataDataAccess = new DataDataAccess(sqlConfig);

        try {
            var groupResult = await groupsDataAccess.insertGroup('Malaria In Pregnancy Cases');
            await setsDataAccess.insertSet('Malaria In Pregnancy', groupResult.recordset[0].Id);    
        }
        catch(e) {
            console.log("Insert group/set error: " + e);
        }
        
        for (var i = 6; i < 8; i++){            
            var headerCell = 'A' + i;
            var valueCell = 'B' + i;
            var headerValue = this.workbook.Sheets[sheetName][headerCell].v;
            var dataValue = this.workbook.Sheets[sheetName][valueCell].v;

            var setName = 'Malaria In Pregnancy';
            if(headerValue != '' && dataValue != '') {
                var metricName = headerValue;                
                console.log("Uploaded: " + metricName);
                
                try{
                    var setIdResult = await setsDataAccess.getSetId(setName);
                    var metricIdResult = await metricDataAccess.insertMetric(metricName, setIdResult.recordset[0].Id);
                    dataDataAccess.insertData(metricIdResult.recordset[0].Id, facilityViewId, dataValue, sheetDate);
                }
                catch(e){
                    console.log("Malaria In Pregnancy error: " + e);
                }
            }     
        }
    }

    async uploadMalariaCases(sheetName: string, facilityViewId, sheetDate) {
        var sqlConfig = config.get('sqlConfig');
        var groupsDataAccess = new GroupsDataAccess(sqlConfig);
        var setsDataAccess = new SetsDataAccess(sqlConfig);
        var metricDataAccess = new MetricsDataAccess(sqlConfig);
        var dataDataAccess = new DataDataAccess(sqlConfig);

        try {
            var groupResult = await groupsDataAccess.insertGroup('Malaria Cases');
            await setsDataAccess.insertSet('Malaria Cases under 5y', groupResult.recordset[0].Id); 
            await setsDataAccess.insertSet('Malaria Cases over 5y', groupResult.recordset[0].Id);     
        }       
        catch(e) {
            console.log("Insert group/set error: " + e);
        }
        
        for (var j = 1; j < 3; j++) {
            var currentCellCol = String.fromCharCode('A'.charCodeAt(0) + j);
            var currentColumnTitle =  this.workbook.Sheets[sheetName][currentCellCol + 5].v;            
            for (var i = 6; i < 9; i++){            
                var headerCell = 'A' + i;
                var valueCell = currentCellCol + i;
                var headerValue = this.workbook.Sheets[sheetName][headerCell].v;
                var dataValue = this.workbook.Sheets[sheetName][valueCell].v;

                var setName = '';
                if (currentColumnTitle.includes('>=')) { 
                    setName = 'Malaria Cases over 5y';                    
                } 
                else {
                    setName = 'Malaria Cases under 5y'; 
                }
                if(headerValue != '' && dataValue != '') {
                    var metricName = headerValue + ' ' + currentColumnTitle;                
                    console.log("Uploaded: " + metricName);                
                    try{
                        var setIdResult = await setsDataAccess.getSetId(setName);
                        var metricIdResult = await metricDataAccess.insertMetric(metricName, setIdResult.recordset[0].Id);
                        dataDataAccess.insertData(metricIdResult.recordset[0].Id, facilityViewId, dataValue, sheetDate);
                    }
                    catch(e){
                        console.log("Malaria Test Cases error: " + e);
                    }
                }     
            }
        }
    }

    async uploadMalariaTreament(sheetName: string, facilityViewId, sheetDate) {
        var sqlConfig = config.get('sqlConfig');
        var groupsDataAccess = new GroupsDataAccess(sqlConfig);
        var setsDataAccess = new SetsDataAccess(sqlConfig);
        var metricDataAccess = new MetricsDataAccess(sqlConfig);
        var dataDataAccess = new DataDataAccess(sqlConfig);

        try {
            var groupResult = await groupsDataAccess.insertGroup('Malaria Treatment');
            await setsDataAccess.insertSet('Malaria Treatment under 5y', groupResult.recordset[0].Id); 
            await setsDataAccess.insertSet('Malaria Treatment over 5y', groupResult.recordset[0].Id);     
        }       
        catch(e) {
            console.log("Insert group/set error: " + e);
        }
        
        for (var j = 1; j < 3; j++) {
            var currentCellCol = String.fromCharCode('A'.charCodeAt(0) + j);
            var currentColumnTitle =  this.workbook.Sheets[sheetName][currentCellCol + 5].v;            
            for (var i = 6; i < 9; i++){            
                var headerCell = 'A' + i;
                var valueCell = currentCellCol + i;
                var headerValue = this.workbook.Sheets[sheetName][headerCell].v;
                var dataValue = this.workbook.Sheets[sheetName][valueCell].v;

                var setName = '';
                if (currentColumnTitle.includes('>=')) { 
                    setName = 'Malaria Treatment over 5y';                    
                } 
                else {
                    setName = 'Malaria Treatment under 5y'; 
                }
                if(headerValue != '' && dataValue != '') {
                    var metricName = headerValue + ' ' + currentColumnTitle;                
                    console.log("Uploaded: " + metricName);                
                    try{
                        var setIdResult = await setsDataAccess.getSetId(setName);
                        var metricIdResult = await metricDataAccess.insertMetric(metricName, setIdResult.recordset[0].Id);
                        dataDataAccess.insertData(metricIdResult.recordset[0].Id, facilityViewId, dataValue, sheetDate);
                    }
                    catch(e){
                        console.log("Malaria Test Cases error: " + e);
                    }
                }     
            }
        }
    }

    async uploadFistula(sheetName: string, facilityViewId, sheetDate) {
        var sqlConfig = config.get('sqlConfig');
        var groupsDataAccess = new GroupsDataAccess(sqlConfig);
        var setsDataAccess = new SetsDataAccess(sqlConfig);
        var metricDataAccess = new MetricsDataAccess(sqlConfig);
        var dataDataAccess = new DataDataAccess(sqlConfig);

        try {
            var groupResult = await groupsDataAccess.insertGroup('Obstetric Fistula Cases');
            await setsDataAccess.insertSet('Obstetric Fistula', groupResult.recordset[0].Id);    
        }
        catch(e) {
            console.log("Insert group/set error: " + e);
        }
        
        for (var i = 6; i < 7; i++){            
            var headerCell = 'A' + i;
            var valueCell = 'B' + i;
            var headerValue = this.workbook.Sheets[sheetName][headerCell].v;
            var dataValue = this.workbook.Sheets[sheetName][valueCell].v;

            var setName = 'Obstetric Fistula';
            if(headerValue != '' && dataValue != '') {
                var metricName = headerValue;                
                console.log("Uploaded: " + metricName);
                
                try{
                    var setIdResult = await setsDataAccess.getSetId(setName);
                    var metricIdResult = await metricDataAccess.insertMetric(metricName, setIdResult.recordset[0].Id);
                    dataDataAccess.insertData(metricIdResult.recordset[0].Id, facilityViewId, dataValue, sheetDate);
                }
                catch(e){
                    console.log("Obstetric Fistula error: " + e);
                }
            }     
        }
    }

    async uploadCommodity(sheetName: string, facilityViewId, sheetDate) {
        var sqlConfig = config.get('sqlConfig');
        var groupsDataAccess = new GroupsDataAccess(sqlConfig);
        var setsDataAccess = new SetsDataAccess(sqlConfig);
        var metricDataAccess = new MetricsDataAccess(sqlConfig);
        var dataDataAccess = new DataDataAccess(sqlConfig);

        try {
            var groupResult = await groupsDataAccess.insertGroup('Commodity');
            await setsDataAccess.insertSet('Commodity', groupResult.recordset[0].Id);    
        }
        catch(e) {
            console.log("Insert group/set error: " + e);
        }
        
        for (var i = 6; i < 31; i++){            
            var headerCell = 'A' + i;
            var valueCell = 'B' + i;
            var headerValue = this.workbook.Sheets[sheetName][headerCell].v;
            var dataValue = this.workbook.Sheets[sheetName][valueCell].v;

            var setName = 'Commodity';
            if(headerValue != '' && dataValue != '') {
                var metricName = headerValue;                
                console.log("Uploaded: " + metricName);
                
                try{
                    var setIdResult = await setsDataAccess.getSetId(setName);
                    var metricIdResult = await metricDataAccess.insertMetric(metricName, setIdResult.recordset[0].Id);
                    dataDataAccess.insertData(metricIdResult.recordset[0].Id, facilityViewId, dataValue, sheetDate);
                }
                catch(e){
                    console.log("Obstetric Fistula error: " + e);
                }
            }     
        }
    }

    getDateFromWorkbook(workbook): Date{
        var sheets = this.workbook.SheetNames;
        var extractedDate = workbook.Sheets[sheets[0]]['A3'].v.split(" ").splice(-2);
        console.log(extractedDate);
        //TEMPORARY DATE FOR TESTING, REMOVE LATER
        //extractedDate = "December,2016";
        return new Date(extractedDate[0] + ' 1, ' + extractedDate[1] + ' 07:00:00');
    }

    getFileInfo(fileName){
        return fileName.split('-');
    }
}

//const dataUploader = new DataUploader();
//dataUploader.uploadXlsxFile("src/DataUploader/data.xls");