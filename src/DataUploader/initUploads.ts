import { DataUploader } from './uploader';
import * as fs from 'fs';
import { TextFileLogger } from './textFileLogger';

//const folder = "/Users/jackiengo/Google Drive/Capstone/data";
const folder = "/Users/jackiengo/Documents/4th Year Eng/SE4450 Software Engineering Design 2/Implementation/Backend/src/DataUploader/testUpload/dhis2data";

const uploader = new DataUploader();
var logger = new TextFileLogger();
var killProcess = false;
var rdyToKillProcess = false;

var currentFileNum = 0;
var filesCount = 0;

var batch = [];

run();

async function run(){

    var batchCount = 0;
    var maxBatch = 100;
    
    await logger.processTextFile();
    console.log("finished processing file");

    fs.readdir(folder, async (err, files) => {
        if(err){
            console.log("read dir error: " + err);
        }
        else{
            filesCount = files.length;
            for(var i = 0; i < files.length; i++){
                if(files[i] == ".DS_Store"){
                    continue;
                }
                if(killProcess){
                    rdyToKillProcess = true;
                    break;
                }
                if(logger.containsText(files[i])){
                    console.log("already uploaded: " + files[i] + ". Skipping...");
                    currentFileNum++;
                    continue;
                }
                if(batchCount < maxBatch){
                    batch.push(files[i]);
                    batchCount++;
                }
                if(i == files.length - 1 || batchCount >= maxBatch) {
                    await batchRun(batch);
                    //console.log("########################UPLOAD$$$$$$$$$$$$$$$$$");
                    batch = [];
                    batchCount = 0;
                }      
                
                if(i == files.length -1){
                    rdyToKillProcess = true;
                }
            }

            //process.exit();
        }
    });
}

async function batchRun(files){
    for(var i = 0; i < files.length; i++){
        currentFileNum++;
        try{
            await uploader.uploadXlsxFile("src/DataUploader/testUpload/dhis2data/" + files[i], files[i]);
            logger.log(files[i]);
        }
        catch(e){
            console.log("ERROR: " + e + ". SKIPPING TO NEXT FILE.");
        }
        
        console.log("Uploaded: " + currentFileNum + "/" + filesCount);
    }
}

process.on('SIGTERM', () => {
    executeProcessShutdown();
}).on('SIGINT', () => {
    executeProcessShutdown();
})

async function executeProcessShutdown(){
    console.log("process is shutting down...")
    killProcess = true;
    while(!rdyToKillProcess){}

    await batchRun(batch);
    console.log("successful shutdown")
    process.exit();
}

