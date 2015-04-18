var SERVER_URL = "https://thesigno.com/";
var REPORT_URL = SERVER_URL + "api/v1/report/";

var TWITTER = "https://twitter.com";
var FACEBOOK = "https://facebook.com";

var selectionAction = function (info, tab){
    report(info.pageUrl, info.linkUrl)
};

// Create contextual menu item(s)
var contexts = ["link"];
var menuTitles = ["Report?"];
var listeners = [selectionAction];
for (var i = 0; i < contexts.length; i++) {
    var context = contexts[i];
    var title = menuTitles[i];
    chrome.contextMenus.create({"title": title, "contexts":[context],
        "onclick": listeners[i]});
}


/**
 * Report the malicious username on website specified by the url parameter.
 * @param url - website that the user is currently browsing
 * @param username - username that exhibited malicious behaviour
 */
function report(url, username){
    if (username == null || username.lastIndexOf("/") == -1)
        return;
    username = username.substring(username.lastIndexOf("/") + 1);

    var searchUrl = REPORT_URL;
    var x = new XMLHttpRequest();
    x.open('POST', searchUrl);
    x.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    x.onload = function() {
        console.log("Successful load")
        reportHandler.success();
    };
    x.onerror = function() {
        console.log("Error occurred")
        reportHandler.failure();
    };
    x.send("site="+url+"&username="+username);
}

// handler server reponse
var reportHandler = function () {
    return{
        success: function(){
            console.log("reported successfully");
        },
        failure: function(){
            console.log("report failed");
        }
    }
}();

// -- Handle ajax data loading:
// 1. When ajax request is triggered to load new data we will attach listener
// 2. onCompleted is triggered when the request has been processed
// 3. send the message to the content script to crawl the DOM
chrome.webRequest.onCompleted.addListener(
    function(details) {
        if (details.url != null)
            if (details.url.indexOf("twitter.com") != -1)
                sendMessage(TWITTER);
            else if (details.url.indexOf("facebook.com") != -1)
                sendMessage(FACEBOOK);
    },
    {urls: ["https://twitter.com/i/timeline?include_available_features*",
           "https://twitter.com/i/expanded/batch/*"]},
    []);

function sendMessage(){
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {startScanning: true, site: TWITTER}, function(response) {
            console.log(response.messsage);
        });
    });
}