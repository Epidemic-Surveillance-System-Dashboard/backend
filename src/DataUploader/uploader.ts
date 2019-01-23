import * as xlsx from 'xlsx';

class DataUploader {

    parse(file: string){
        var workbook: xlsx.WorkBook = xlsx.read(file);
        var sheetNameList: string[] = workbook.SheetNames;
        console.log(xlsx.utils.sheet_to_json(workbook.Sheets[sheetNameList[0]])[1]);
    }

}

const du = new DataUploader();

du.parse('src\\DataUploader\\a.xls');