import * as fs from 'fs';
import * as readline from 'readline';

export class TextFileLogger {

    private textFilePath: string;
    private textSet: Set<any>;
    private textToBeAdded = [];
    private writeStream;

    constructor(textFilePath?: string){
        if(textFilePath){
            this.textFilePath = textFilePath;
        }
        else{
            this.textFilePath = "src/DataUploader/testLog.txt";
        }
        this.writeStream = fs.createWriteStream(this.textFilePath, { flags: 'a', encoding: 'utf8' });
    }

    public processTextFile(){
        return new Promise((resolve, reject) => {
            this.textSet = new Set();
            readline.createInterface({
                input: fs.createReadStream(this.textFilePath),
                terminal: false
            }).on('line', (line) => {
               this.textSet.add(line);
            }).on('close', () => {
                resolve();
             });
        })
    }

    public writeToTextFile(){
        return Promise.all(this.textToBeAdded).then((result) => {
            this.textToBeAdded = [];
            return;
        });
    }

    public log(text: string){
        console.log("text: " + text);
      //  this.textToBeAdded.push(new Promise((resolve, reject) => {
            this.writeStream.write( text + '\n', (err) => {
                if(err) {
                    console.log("error while writing: " + text + " Error: " + err);
                    //reject();
                }
                else{
                   // resolve();
                }   
            });
      //  }));

        this.textSet.add(text);
    }

    public containsText(text: string): boolean {
        return this.textSet.has(text);
    }


}