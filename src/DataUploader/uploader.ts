import * as xlsx from 'xlsx';

class DataUploader {

    parse(file: string){
        var workbook: xlsx.WorkBook = xlsx.readFile(file);
        var sheetNameList: string[] = workbook.SheetNames;
        console.log('Sheets: ' + sheetNameList);
        console.log(xlsx.utils.sheet_to_json(workbook.Sheets[sheetNameList[8]]));
    }

}

const du = new DataUploader();

du.parse('C://Users//aayush//Desktop//data.xls');