import { createReadStream } from 'fs';
import { parse } from 'fast-csv';
import { GoogleSafe } from './src/googleSB.js'

let rows = [];

function LoadPhishtank(){
    createReadStream("./ML/URLAnalysis/PhishTank.csv")
    .pipe(parse({ headers: true }))
    .on('error', error => console.error(error))
    .on('data', row => {
        //each row can be written to db
        rows.push(row.url);
    })
    .on('end', rowCount => {
        console.log(`Parsed ${rowCount} rows`);
        console.log(rows)
    });
}

async function ClassifyURLs () {
    FailedUrls=[]
    //Step 1: Check Phishtank
    urls.forEach(element => {
        if(CheckPhishTank(element)){
            return {legit: false, msg: element+ " Failed the Phishtank Check, This email should be treated as Malicious", validURLs: []}
        }
    });
    //Step 2: Run Index Query
    potentialPhish =  await GoogleSafe(urls)
    if (potentialPhish != []){
        //Step 3: Pass to ML Model
    }
    else {
        return {legit: true, msg: "All URLs are deemed Safe by Google, and can be treated as Legitimate", validURLs: urls}
    }
}


function CheckPhishTank(url){
    if(rows.includes(url)){
        return true
    }
    else
    {
        return false
    }
}


const _LoadPhishtank = LoadPhishtank;
export { _LoadPhishtank as LoadPhishtank };
const _CheckPhishTank = CheckPhishTank;
export { _CheckPhishTank as CheckPhishTank };
