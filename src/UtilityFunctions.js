// // A File to Contain Utility JS functions

submitbtn = document.getElementById('submitUpload')
trainbtn = document.getElementById('TrainModel')


//Ensure Uploaded File is mbox
document.getElementById('MBOXFile').onchange = function(e){ 
    if (!this.value.match(/.(mbox)$/i))
    {
        alert('Uploaded file type not supported. Please upload a .mbox file. See the "Help" page for more info.');
        this.value='';
    }
};


async function trainModelCMD() {
    let response = await fetch('http://localhost:5000/train', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    let data = await response.text()
    return data
}

async function deleteUploadCMD() {
    let response = await fetch('http://localhost:5000/delete', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    let data = await response.text()
    return data
}

document.getElementById('test').onsubmit = function(e){
    submitbtn.innerText='Uploaded!'

    trainbtn.disabled = false;
    document.getElementById('TrainHeader').innerText = "Click to retrain the AI model:";

    document.getElementById('DeleteUpload').disabled = false;
    document.getElementById('DeleteUpload').innerText = "Delete Your Data?";
}

// document.getElementById('submitUpload').onclick = function(e){
//     if (document.getElementById('MBOXFile').value != ''){
//         
//         submitbtn.disabled="true"

//         trainbtn.disabled = false;
//         document.getElementById('TrainHeader').innerText = "Click to retrain the AI model:";

//         document.getElementById('DeleteUpload').disabled = false;
//         document.getElementById('DeleteUpload').innerText = "Delete Your Data?";
//     }
// }

trainbtn.onclick = async function(e){
    trainbtn.disabled = true;
    trainbtn.innerText = "Training...";
    alert (await trainModelCMD())
    trainbtn.disabled = false;
    trainbtn.innerText = "Train Model";
}


document.getElementById('DeleteUpload').onclick = async function(e){
    if (confirm('Are you sure you want to delete your uploaded data?')) {
        alert(await deleteUploadCMD())
        document.getElementById('DeleteUpload').disabled = true;
        document.getElementById('DeleteUpload').innerText = "All Data Deleted";
        trainbtn.disabled = true;
        document.getElementById('TrainHeader').innerText = "Please upload a .mbox file before training.";
        submitbtn.disabled="false"
    } 
}
