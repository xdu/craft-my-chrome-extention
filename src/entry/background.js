const DOMParser = require('xmldom').DOMParser

function parseRSS2(doc) {
    const title = doc.getElementsByTagName('title')[0].firstChild.nodeValue
    const link = doc.getElementsByTagName('link')[0].firstChild.nodeValue
    const list = []

    const entries = doc.getElementsByTagName('item')
    for(let i = 0; i < entries.length; i ++) {

        const entry = entries[i]
        const json = {}

        json.id = entry.getElementsByTagName('guid')[0].firstChild.nodeValue
        json.title = entry.getElementsByTagName('title')[0].firstChild.nodeValue
        if (entry.getElementsByTagName('content:encoded').length > 0) {
            json.summary = entry.getElementsByTagName('content:encoded')[0].firstChild.nodeValue
        } else {
            json.summary = entry.getElementsByTagName('description')[0].firstChild.nodeValue
        }
        json.date = entry.getElementsByTagName('pubDate')[0].firstChild.nodeValue

        list.push(json)
    }

    return {
        title: title, url: link, entries: list
    }
}

function parseATOM1(doc) {
    const title = doc.getElementsByTagName('title')[0].firstChild.nodeValue
    const link = doc.getElementsByTagName('link')[0].firstChild.nodeValue
    const list = []

    const entries = doc.getElementsByTagName('entry')
    for(let i = 0; i < entries.length; i ++) {

        const entry = entries[i]
        const json = {}

        json.id = entry.getElementsByTagName('guid')[0].firstChild.nodeValue
        json.title = entry.getElementsByTagName('title')[0].firstChild.nodeValue
        if (entry.getElementsByTagName('content').length > 0) {
            json.summary = entry.getElementsByTagName('content')[0].firstChild.nodeValue
        } else {
            json.summary = entry.getElementsByTagName('summary')[0].firstChild.nodeValue
        }
        json.date = entry.getElementsByTagName('pubDate')[0].firstChild.nodeValue

        list.push(json)
    }

    return {
        title: title, url: link, entries: list
    }
}

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        console.log("Request: " + request.action + ", " + sender)

        if (request.action == "feed") {
            fetch(request.url)
            .then(resp => resp.text())
            .then(xml => {
                const doc = new DOMParser().parseFromString(xml, 'text/xml')

                if (doc.getElementsByTagName('rss').length > 0) {
                    sendResponse( parseRSS2(doc) )
                }
                else if (doc.getElementsByTagName('feed').length > 0) {
                    sendResponse( parseATOM1(doc) )
                }
            })
        }
        return true;
    }
);