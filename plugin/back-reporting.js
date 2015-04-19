var SERVER_URL = "https://thesigno.com/";
var REPORT_URL = SERVER_URL + "api/v1/report/";

var TWITTER = "https://twitter.com";
var FACEBOOK = "https://facebook.com";

/**
 * Report the malicious username on website specified by the url parameter.
 * @param url - website that the user is currently browsing
 * @param username - username that exhibited malicious behaviour
 */
function report(url, username, button) {
    if (username == null || username.length == 0)
        return;

    var searchUrl = REPORT_URL;
    var x = new XMLHttpRequest();
    x.open('POST', searchUrl);
    x.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    x.onload = function () {
        console.log("Successful load")
        reportHandler.success(button);
    };
    x.onerror = function () {
        console.log("Error occurred")
        reportHandler.failure(button);
    };
    x.send("site=" + url + "&username=" + username);
}

// handler server reponse
var reportHandler = function () {
    return {
        success: function (button) {
            var centerMessageCont = document.createElement("div");

            var centerMessage = document.createElement("p");
            centerMessage.style.color = '#ee9900';
            centerMessage.style.fontWeight = 'bold';
            centerMessage.style.fontSize = '1.5em';
            centerMessage.style.lineHeight = '180%';
            centerMessage.appendChild(document.createTextNode("Thanks for reporting and helping the community."));

            centerMessageCont.style.position = 'fixed';
            centerMessageCont.style.textAlign = 'center';
            centerMessageCont.style.padding = '40px';
            centerMessageCont.style.height = '120px';
            centerMessageCont.style.width = '300px';
            centerMessageCont.style.border = '0px solid #000000';
            centerMessageCont.style.borderRadius = '10px 10px 10px 10px';
            centerMessageCont.style.boxShadow= '2px 7px 10px 0px rgba(0,0,0,0.75)';
            centerMessageCont.style.left = '40%';
            centerMessageCont.style.top = '35%';
            centerMessageCont.style.backgroundColor = '#fff';
            centerMessageCont.style.zIndex = 1003;

            centerMessageCont.appendChild(centerMessage);

            document.querySelector('body').appendChild(centerMessageCont);
            setTimeout(function () {
                document.querySelector('body').removeChild(centerMessageCont);
            }, 1800);


            button.setAttribute("src", "chrome-extension://" + chrome.i18n.getMessage("@@extension_id") + "/images/reported.png");
            button.setAttribute("data-no-change", "yes");

            console.log("reported successfully");
        },
        failure: function (button) {
            setTimeout(function () {
                button.setAttribute("src", "chrome-extension://" + chrome.i18n.getMessage("@@extension_id") + "/images/reported.png");
                button.setAttribute("data-no-change", "yes");
            }, 400);
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
            reportButton.setAttribute("title", "Report this user");

            reportButton.style.position = 'relative';
            reportButton.style.top = '32px';
            reportButton.style.left = '-40px';
            reportButton.style.width = '20px';
            reportButton.style.height = '20px';
            reportButton.style.zIndex = '999';

            actionFooters[i].insertBefore(reportButton, actionFooters[i].firstChild);

            reportButton.addEventListener("mouseover", function () {
                if (this.getAttribute("data-no-change") !== "yes") {
                    this.setAttribute("src", "chrome-extension://" + chrome.i18n.getMessage("@@extension_id") + "/images/hover.png");
                }
            });
            reportButton.addEventListener("mouseout", function () {
                if (this.getAttribute("data-no-change") !== "yes") {
                    this.setAttribute("src", "chrome-extension://" + chrome.i18n.getMessage("@@extension_id") + "/images/normal.png");
                }
            });

            reportButton.addEventListener("click", function () {
                var uname = username;
                return function (e) {
                    e.stopPropagation();
                    this.setAttribute("src", "chrome-extension://" + chrome.i18n.getMessage("@@extension_id") + "/images/loader.gif");
                    report(TWITTER, uname, this);
                };
            }());
        }
    }
}