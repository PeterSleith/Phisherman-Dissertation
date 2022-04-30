import fetch from 'node-fetch';

async function GoogleSafe(urlArray) {
    let urls = urlArray
    let threatEntries = []
    for (let i = 0; i < urls.length; i++) {
        threatEntries.push({url: urls[i]})
    }
    console.log(threatEntries)
    let body = {
        "client": {
            "clientId":      "Phisherman",
            "clientVersion": "1.0"
        },
        "threatInfo": {
            "threatTypes":      ["MALWARE", "SOCIAL_ENGINEERING", "THREAT_TYPE_UNSPECIFIED", "UNWANTED_SOFTWARE", "POTENTIALLY_HARMFUL_APPLICATION"],
            "platformTypes":    ["WINDOWS"],
            "threatEntryTypes": ["URL"],
            "threatEntries": threatEntries
        }
    }
    let response = await fetch('https://safebrowsing.googleapis.com/v4/threatMatches:find?key=AIzaSyCORBTVL-CezIRVNBXIDoRRYRif5udi1hA', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    });
    let data = await response.text();
    data = JSON.parse(data)
    matchedURLs=[]
    data.matches.forEach(match => {
        matchedURLs.push(match.threat.url)
    })
    return matchedURLs
}

const _GoogleSafe = GoogleSafe;
export { _GoogleSafe as GoogleSafe };