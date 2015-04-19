debugger;

var SERVER_URL = "https://thesigno.com/";
var CHECK_URL = SERVER_URL + "api/v1/check/";

var TWITTER = "https://twitter.com";
var FACEBOOK = "https://facebook.com";


/**
 * Object containing methods for checking the users on the platforms.
 * TW checker - implemented
 * FB - TODO
 */
var checker = function () {
    return {
        tw: function (userToElems) {
            var searchUrl = CHECK_URL;
            var x = new XMLHttpRequest();
            x.open('POST', searchUrl);
            x.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            x.onload = function () {
                // Parse and process the response from check API endpoint
                var response = x.response;

                if (!response || !response.result || response.result.length === 0) {
                    console.log('No response from from our check API!');
                    return;
                }

                // update the DOM with this new data
                updateDOM(userToElems, response.responseData.result);
            };
            x.onerror = function () {
                console.log("Error occurred when invoking check API");
            };

            var users = Object.keys(userToElems).join(",");
            x.send("site=" + TWITTER + "&users=" + users);
        },
        fb: function () {
            // TODO impl this
        }
    }
}();

function addReportElement(stream) {
    var actionFooters = stream.querySelectorAll("div.stream-item-footer");

    for (var i = 0, tot = actionFooters.length; i < tot; i++) {
        // only create report button if one is not already present
        if (actionFooters[i].querySelector('img[data-tweetId]') == null) {
            var tweetId = actionFooters[i].parentNode.parentNode.getAttribute("data-tweet-id");
            var username = actionFooters[i].parentNode.parentNode.getAttribute("data-screen-name");

            var reportButton = document.createElement("img");
            reportButton.setAttribute("data-tweetId", tweetId);
            reportButton.setAttribute("data-username", username);
            reportButton.setAttribute("src", "chrome-extension://" + chrome.i18n.getMessage("@@extension_id") + "/images/normal.png");

            reportButton.style.position = 'relative';
            reportButton.style.top = '32px';
            reportButton.style.left = '-32px';
            reportButton.style.width = '20px';
            reportButton.style.heigh = '20px';

            actionFooters[i].insertBefore(reportButton, actionFooters[i].firstChild);

            reportButton.addEventListener("mouseover", function () {
                this.setAttribute("src", "chrome-extension://" + chrome.i18n.getMessage("@@extension_id") + "/images/hover.png");
            });
            reportButton.addEventListener("mouseout", function () {
                this.setAttribute("src", "chrome-extension://" + chrome.i18n.getMessage("@@extension_id") + "/images/normal.png");
            });
        }
    }
}


/**
 * Object containing logic for getting the currently displayed users on the platform.
 * TW - implemented
 * FB - TODO
 *
 */
var crawler = function () {
    return {
        tw: function () {
            // main user stream
            var stream = document.getElementById("stream-items-id");

            addReportElement(stream);

            // every component holding a tweet
            var htmlCol = stream.querySelectorAll(".tweet.js-stream-tweet");
            var liElems = [].slice.call(htmlCol);

            var mapData = liElems.map(function (obj) {
                var tweetId = obj.getAttribute("data-tweet-id");
                var username = obj.getAttribute("data-screen-name");
                return {username: username, elemId: tweetId};
            });

            // now group them by username
            var data = {};
            for (var i = 0; i < mapData.length; i++) {
                if (data[mapData[i].username] == null)
                    data[mapData[i].username] = []

                data[mapData[i].username].push(mapData[i].elemId)
            }

            // lets check these users
            checker.tw(data);
        },
        fb: function () {
            // TODO impl this
        }
    }
}();
// crawl for the first time
crawler.tw();


// Receive messages from the background page
// This will trigger the crawler once again, depending on the url where user is
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.startScanning) {
            if (request.site === TWITTER)
                crawler.tw();
            else if (request.site == FACEBOOK)

                sendResponse({message: "started crawling"});
        }
    });

var THRESHOLD = 1;

function updateDOM(usersToElems, result) {
    for (var i = 0, tot = result.length; i < tot; i++) {
        var tweetId = usersToElems[result.user];
        var divElem = document.querySelector("[data-tweet-id=\"" + tweetId + "\"]");

        var negative = result.negative;
        var positive = result.positive;

        if (reviewFunction(tweetId, positive, negative) > THRESHOLD) {
            // change the look of the div element
            divElem.style.opacity = 0.5;
        }
    }
}

function reviewFunction(tweetId, positive, negative) {
    return {
        tweetId: tweetId,
        score: (negative - positive)
    };
}