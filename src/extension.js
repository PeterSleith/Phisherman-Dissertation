"use strict";

// loader-code: wait until gmailjs has finished loading, before triggering actual extensiode-code.
const loaderId = setInterval(() => {
    if (!window._gmailjs) {
        return;
    }

    clearInterval(loaderId);
    startExtension(window._gmailjs);
}, 100);

async function CheckURLIndex(){
    user_agent = 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/48.0.2564.116 Safari/537.36'
    let response = await fetch('info:https://www.google.com/search?' + new URLSearchParams({
        url: 'https%3A%2F%2Fcareers.google.com%2Fjobs%2Fgoogle%2Ftechnical-writer'
    }),
    {
        headers : { 'User-Agent' : user_agent}
    })

    let data = await response.text();
    console.log(data);
}



async function fetchContentClassification(emailcontent) {
    let bodyContent = JSON.stringify({
        "data": emailcontent
    })
    let response = await fetch('http://localhost:4000/CAClassify', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: bodyContent
    });
    let data = await response.text();
    console.log(data);
}


submitBtn=document.getElementById('submitUpload')
submitBtn.onclick = function(e){
    if (document.getElementById('MBOXFile').value != ''){
        submitBtn.value='Submitted!'
    }
};

function extractContent(s, space) {
    var span= document.createElement('span');
    span.innerHTML= s;
    if(space) {
      var children= span.querySelectorAll('*');
      for(var i = 0 ; i < children.length ; i++) {
        if(children[i].textContent)
          children[i].textContent+= ' ';
        else
          children[i].innerText+= ' ';
      }
    }
    return [span.textContent || span.innerText].toString().replace(/ +/g,' ');
};

async function startExtension(gmail) {
    console.log("Phisherman loading...");
    window.gmail = gmail;

    gmail.observe.on("load", () => {
        //const userEmail = gmail.dom.visible_messages();
        console.log("Phisherman is injected and ready for use!");
        //console.log(userEmail);

        gmail.observe.on("view_email", (domEmail) => {
            //console.log("Looking at email:", domEmail);
            const emailData = gmail.new.get.email_data(domEmail);
            //console.log(emailData.content_html)
            //console.log(extractContent(emailData.content_html))
            CheckURLIndex()
            //fetchContentClassification(extractContent(emailData.content_html, true))
            //console.log("Email data:", emailData);
        });

        gmail.observe.on("compose", (compose) => {
            console.log("New compose window is opened!", compose);
        });
    });
}
