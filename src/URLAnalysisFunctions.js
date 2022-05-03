import { createReadStream } from 'fs';
import { PythonShell } from 'python-shell';
import { parse } from 'fast-csv';
import { GoogleSafe } from './GoogleSB.js'

let pTank = [];


function LoadPhishtank(){
    createReadStream("./ML/URLAnalysis/PhishTank.csv")
    .pipe(parse({ headers: true }))
    .on('error', error => console.error(error))
    .on('data', row => {
        //each row can be written to db
        pTank.push(row.url);
    })
    .on('end', rowCount => {
        console.log(`Parsed ${rowCount} rows`);
    });
}


async function PythonClassify(url) {
    return new Promise(resolve =>{
        let options = {
            args:[url]
        }
        PythonShell.run("./ML/URLAnalysis/URL Evaluation.py", options, function(err, result){
            if(err){
            }
            else{
                resolve(result[0])
            }
        })
    })
}

async function ClassifyURLs (URLArray) {
    let FailedUrls=[]
    //Step 1: Check Phishtank
    URLArray.forEach(element => {
        if(CheckPhishTank(element)){
            return {legit: false, msg: element+ "Failed the Phishtank Check, This email should be treated as Malicious", failedUrls: []}
        }
    });
    //Step 2: Run Index Query
    let potentialPhish = await GoogleSafe(URLArray)
    if (potentialPhish.length !== 0){
        FailedUrls = potentialPhish
        return {legit: false, msg: "Failed the Google Safe Browsing Check, This email should be treated as Malicious", failedUrls: FailedUrls}
    }
    else {
        let pred = await PythonClassify(URLArray)
        for (let i = 0; i<pred.length; i++){
            if (pred[i] == 'bad'){
                FailedUrls.push(URLArray[i])
            }
        }

        if(FailedUrls.length == 0){
            return {legit: true, msg: "Passed All Checks, This email should be considered safe", failedUrls: []}
        }
        else{
            return {legit: null, msg: "Failed the AI Model Check, This email should be treated as Potentially Dangerous", failedUrls: FailedUrls}
        }
    }
}


async function CheckPhishTank(url){
    if(pTank.includes(url)){
        return true
    }
    else
    {
        return false
    }
}

const _LoadPhishtank = LoadPhishtank;
export { _LoadPhishtank as LoadPhishtank };
const _ClassifyURLs = ClassifyURLs;
export { _ClassifyURLs as ClassifyURLs };
const _CheckPhishTank = CheckPhishTank;
export { _CheckPhishTank as CheckPhishTank };
