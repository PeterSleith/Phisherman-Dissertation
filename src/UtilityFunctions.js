// A File to Contain Utility JS functions

//Ensure Uploaded File is mbox
document.getElementById('MBOXFile').onchange = function(e){ 
    var ext = this.value.match(/\.(.+)$/)[1];
    if (!this.value.match(/.(mbox)$/i))
    {
        alert('Uploaded file type not supported. Please upload a .mbox file. See the "Help" page for more info.');
        this.value='';
    }
};

document.getElementById('Train Model').onclick = function(e){
    document.getElementById('Train Model').disabled = true;

    mboxToDataset.js

    document.getElementById('Train Model').disabled = false;
}
