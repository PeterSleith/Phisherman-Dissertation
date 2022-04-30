import {MailParser} from 'mailparser';
import Mbox from 'node-mbox';
import ObjectsToCsv from 'objects-to-csv';
import { createReadStream } from 'fs';

const mboxpath = './uploads/uploadedMbox.mbox'

const delay = ms => new Promise(res => setTimeout(res, ms));

async function extractMbox(){
  return new Promise(resolve =>{
    try {
      if (fs.existsSync(mboxpath)) {
        const extractedList = []
        const stream = createReadStream('uploads/uploadedMbox.mbox');
        const mbox = new Mbox(stream);

        mbox.on('message', function(msg) {
          var extractedText='';
          // parse message using MailParser
          let mailparser = new MailParser({ streamAttachments : true });
          mailparser.on('headers', function(headers) {
            extractedText = ('Subject:', headers.get('subject'));
          });
          mailparser.on('data', data => {
            if (data.text != undefined){
              extractedText += data.text;
              extractedList.push({text: extractedText, label: 1})
            }
          });
          mailparser.write(msg);
          mailparser.end();
        });
          
        mbox.on('error', function(err) {
          console.log('got an error', err);
        });
          
        mbox.on('end', async function() {
          console.log('done reading mbox file');
          await delay(200)
          console.log(extractedList)
          const csv = new ObjectsToCsv(extractedList)
          //Extremely Short delay added, to allow for small mbox files to be parsed.
          await csv.toDisk('./ML/ContentAnalysis/CAModifiedDataset.csv', { append: true })
          resolve()
        })
      }
    } 
    catch(err) {
      console.log('No Mbox File Uploaded')
      resolve()
    }
  });
}

const _extractMbox = extractMbox;
export { _extractMbox as extractMbox };
