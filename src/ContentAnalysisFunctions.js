import { PythonShell } from 'python-shell';
import { extractMbox } from "./mboxToDataset.js";
import fs from 'fs';
 
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
                resolve(result[0].charAt(1))
            }
        })
    })
}

async function trainModel() {
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
                        }
                        else{
                            console.log(result)
                            console.log("Model Trained")
                        }
                    }) 
                }
            });
        } 
    });
}


const _classifyText = classifyText;
export { _classifyText as classifyText };
const _trainModel = trainModel;
export { _trainModel as trainModel };