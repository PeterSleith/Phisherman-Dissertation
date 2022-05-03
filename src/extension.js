"use strict";

// loader-code: wait until gmailjs has finished loading, before triggering actual extensiode-code.
const loaderId = setInterval(() => {
    if (!window._gmailjs) {
        return;
    }

    clearInterval(loaderId);
    startExtension(window._gmailjs);
}, 100);


//Calls the Content Analysis Classification functions on the Server-Side waits for a classification response
async function fetchContentClassification(emailcontent) {
    let bodyContent = JSON.stringify({
        "data": emailcontent
    })
    let response = await fetch('http://localhost:5000/CAClassify', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: bodyContent
    });
    let data = JSON.parse(await response.text())
    return data
}

//Calls the URL Classification functions on the Server-Side waits for a classification response
async function fetchURLClassification(rawHTML) {
    var doc = document.createElement("html");
    doc.innerHTML = rawHTML;
    var links = doc.getElementsByTagName("a")
    var urls = [];

    for (var i=0; i<links.length; i++) {
        if(links[i].getAttribute("href")){
            urls.push(links[i].getAttribute("href"));
        }
    }

    let bodyContent = JSON.stringify({
        "data": urls
    })
    let response = await fetch('http://localhost:5000/URLClassify', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: bodyContent
    });
    let data = JSON.parse(await response.text())
    return data
}

//Function to extract plaintext from the HTML text returned by Gmail.js
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

//Implementation of Gmail.js listeners
async function startExtension(gmail) {
    console.log("Phisherman loading...");
    window.gmail = gmail;

    gmail.observe.on("load", async () => {
        //const userEmail = gmail.dom.visible_messages();
        console.log("Phisherman is injected and ready for use!");

        gmail.observe.on("view_email", async (domEmail) => {
            //console.log("Looking at email:", domEmail);
            const emailData = gmail.new.get.email_data(domEmail);
            console.log(emailData.content_html)
            let URLResult = await fetchURLClassification(emailData.content_html)
            let CAResult 
            if (URLResult.legit !== false){
                CAResult = await fetchContentClassification(extractContent(emailData.content_html, true))
                if ((URLResult.legit == true) && (CAResult.legit == true)){
                    alert(URLResult.msg)
                }
                else if((URLResult.legit == true) && (CAResult.legit == false)){
                    alert("The email content has been flagged as suspicious, but all links appear to be safe. Proceed with caution")
                }
                else if((URLResult.legit == null) && (CAResult.legit == true)){
                    alert("This email has been flagged with suspicious links, but content appears legitimate. Proceed with caution when following links")
                }
            }
        });
    });
}
