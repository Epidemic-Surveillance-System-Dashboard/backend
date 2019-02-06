import { DataUploader } from './uploader';
import * as fs from 'fs';

const folder = "/Users/jackiengo/Google Drive/Capstone/data";
const uploader = new DataUploader();
fs.readdir(folder, (err, files) => {

    if(err){
        console.log(err);
    }
    files.forEach(file => {
        console.log(file);
        uploader.uploadXlsxFile(file);
    });
})
