var SERVER_URL = "https://thesigno.com/";
var REPORT_URL = SERVER_URL + "api/v1/report/";

var TWITTER = "https://twitter.com";
var FACEBOOK = "https://facebook.com";

/**
 * Report the malicious username on website specified by the url parameter.
 * @param url - website that the user is currently browsing
 * @param username - username that exhibited malicious behaviour
 */
function report(url, username){
    if (username == null || username.length == 0)
        return;

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

/**
 * Inputs report buttons in the twitter timeline
 * @param stream
 */
function addReportElement(stream) {
    var actionFooters = stream.querySelectorAll("div.stream-item-footer");

    for (var i = 0, tot = actionFooters.length; i < tot; i++) {
        // only create report button if one is not already present
        if (actionFooters[i].querySelector("[role=\"keep-calm-reporter\"]") == null) {
            var tweetId = actionFooters[i].parentNode.parentNode.getAttribute("data-tweet-id");
            var username = actionFooters[i].parentNode.parentNode.getAttribute("data-screen-name");

            var reportButton = document.createElement("img");
            reportButton.setAttribute("data-tweetId", tweetId);
            reportButton.setAttribute("data-username", username);
            reportButton.setAttribute("src", "chrome-extension://" + chrome.i18n.getMessage("@@extension_id") + "/images/normal.png");
            reportButton.setAttribute("role", "keep-calm-reporter");

            reportButton.style.position = 'relative';
            reportButton.style.top = '32px';
            reportButton.style.left = '-40px';
            reportButton.style.width = '20px';
            reportButton.style.heigth = '20px';
            reportButton.style.zIndex = '1002';

            actionFooters[i].insertBefore(reportButton, actionFooters[i].firstChild);

            reportButton.addEventListener("mouseover", function () {
                this.setAttribute("src", "chrome-extension://" + chrome.i18n.getMessage("@@extension_id") + "/images/hover.png");
            });
            reportButton.addEventListener("mouseout", function () {
                this.setAttribute("src", "chrome-extension://" + chrome.i18n.getMessage("@@extension_id") + "/images/normal.png");
            });

            reportButton.addEventListener("click", function(){
                var uname = username;
                return function(e){
                    e.stopPropagation();
                    report(TWITTER, uname);
                };
            }());
        }
    }
}