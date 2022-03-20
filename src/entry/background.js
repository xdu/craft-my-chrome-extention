const DOMParser = require('xmldom').DOMParser

chrome.runtime.onMessage.addListener(
    function (request, user, sendResponse) {
        console.log("Request: " + request.action)

        if (request.action == "feed") {
            fetch(request.url)
                .then(resp => resp.text())
                .then(xml => {
                    const doc = new DOMParser().parseFromString(xml, 'text/xml')
                    const title = doc.getElementsByTagName('title')[0].firstChild.nodeValue
                    const list = []

                    const entries = doc.getElementsByTagName('item')
                    for(let i = 0; i < entries.length; i ++) {

                        const entry = entries[i]
                        const json = {}

                        json.id = entry.getElementsByTagName('link')[0].firstChild.nodeValue
                        json.title = entry.getElementsByTagName('title')[0].firstChild.nodeValue
                        json.summary = entry.getElementsByTagName('description')[0].firstChild.nodeValue
                        json.date = entry.getElementsByTagName('pubDate')[0].firstChild.nodeValue

                        list.push(json)
                    }

                    sendResponse({
                        title: title,
                        url: request.url,
                        entries: list
                    })
                })
            return true
            }
        }
);