import { PythonShell } from 'python-shell';
import { extractMbox } from "./mboxToDataset.js";
import fs from 'fs';
 
//The function to ask the content analysis classifier to predict is the content is legitimate or phishing
async function classifyText(textString) {
    return new Promise(resolve =>{
        let options = {
            args:[textString]
        }
        PythonShell.run("./ML/ContentAnalysis/CAClassify.py", options, function(err, result){
            if(err){
                resolve(err)
            }
            else{
                if(parseInt(result[0].charAt(1))==0){
                    resolve({legit: true, msg: "Passed the AI Model Check, This email should be treated as Safe"})
                }
                else{
                    resolve({legit: false, msg: "Failed the AI Model Check, This email should be treated as Potentially Dangerous"})
                }
            }
        })
    })
}

// When the User starts this function the old dataset will be overwritten with the original base dataset, the users uploaded mbox will then be added to it and the model trained.
async function trainModel() {
    return new Promise(resolve =>{
        fs.unlink('./ML/ContentAnalysis/CAModifiedDataset.csv', function (err) {
            if (err){
                console.log("Delete Error: "+ err)
            }
            else{
                console.log('Modified Dataset Deleted!');
                fs.copyFile("./ML/ContentAnalysis/CABaseDataset.csv", "./ML/ContentAnalysis/CAModifiedDataset.csv", async function(err){
                    if (err) {
                    console.log("Error Found:", err);
                    }
                    else {
                        console.log("Base Dataset Copied Correctly")
                        await extractMbox()
                        PythonShell.run("./ML/ContentAnalysis/CAModelTrainer.py", null, function(err, result){
                            if(err){
                                console.log(err)
                                resolve(err)
                            }
                            else{
                                console.log("Model Trained Successfully")
                                resolve("Trained Successfully!")
                            }
                        }) 
                    }
                });
            } 
        });
    })
}


const _classifyText = classifyText;
export { _classifyText as classifyText };
const _trainModel = trainModel;
export { _trainModel as trainModel };