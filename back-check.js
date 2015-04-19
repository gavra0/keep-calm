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
                if (!x.response) {
                    console.log('No response from from our check API!');
                    return;
                }
                // Parse and process the response from check API endpoint

                var response = []
                try {
                    response = JSON.parse(x.response);
                }
                catch (e) {
                    console.log(e);
                }

                // update the DOM with this new data
                updateDOM(userToElems, response.result);
            };
            x.onerror = function () {
                console.log("Error occurred when invoking check API");
            };

            var users = Object.keys(userToElems).join(",");
            x.send("site=" + TWITTER + "&users=" + users);
        },
        fb: function () {
            // TODO impl this?
        }
    }
}();


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
            var htmlCol = stream.querySelectorAll("div.tweet.js-stream-tweet");
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
            // TODO impl this?
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
        var tweetIds = usersToElems[result[i].username];

        var views = result[i].views;
        var reports = result[i].reports;

        var negativeReview = reviewFunction(views, reports) > THRESHOLD;

        // each of the tweet container should be updated
        for (var j = 0; j < tweetIds.length; j++) {
            var divElems = document.querySelectorAll("[data-tweet-id=\"" + tweetIds[j] + "\"]");
            for (var k = 0; k < divElems.length; k++) {
                if (negativeReview) {
                    if (divElems[k].querySelectorAll("[role=\"keep-calm-badge\"]").length == 0) {
                        var repButton = divElems[k].querySelector("[role=\"keep-calm-reporter\"]");

                        var reportBadge = document.createElement("img");
                        reportBadge.setAttribute("src", "chrome-extension://" + chrome.i18n.getMessage("@@extension_id") + "/images/sad.png");
                        reportBadge.setAttribute("role", "keep-calm-badge");

                        reportBadge.style.position = 'absolute';
                        reportBadge.style.top = '40%';
                        reportBadge.style.left = '50%';
                        reportBadge.style.width = '55px';
                        reportBadge.style.heigth = '55px';
                        reportBadge.style.zIndex = '1003';

                        // set the opacity on hover to disappear
                        var tweetContainer = repButton.parentNode.parentNode;
                        tweetContainer.style.opacity = 0.6;
                        tweetContainer.addEventListener("mouseover", function () {
                            var tC = tweetContainer;
                            return function () {
                                tC.style.opacity = 1;
                                tC.querySelector("[role=\"keep-calm-badge\"]").style.display = 'none';
                            };
                        }());
                        tweetContainer.addEventListener("mouseout", function () {
                            var tC = tweetContainer;
                            return function () {
                                tC.style.opacity = 0.6;
                                tC.querySelector("[role=\"keep-calm-badge\"]").style.display = 'inline-block';
                            };
                        }());

                        tweetContainer.insertBefore(reportBadge, tweetContainer.firstChild);
                    }
                }
                else
                    divElems[k].style.opacity = 1;
            }
        }
    }
}

function reviewFunction(views, negative) {
    return 90 * negative - views;
}