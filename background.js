debugger;

var SERVER_URL = "OUR_SERVER_URL";
var CHECK_URL = SERVER_URL + "/check";

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
            x.onload = function () {
                // fiddle with the elements
                for (var key in userToElems) {
                    var elemsToCheck = userToElems[key];
                    for (var i = 0, tot = elemsToCheck.length; i < tot; i++) {
                        var liElem = document.getElementById(elemsToCheck[i]);
                        if (Math.random() > 0.5) {
                            liElem.style.backgroundColor = 'red'
                        }
                        else{
                            liElem.style.backgroundColor = ''
                        }
                    }
                }
            };
            x.onerror = function () {
                console.log("Error occurred")
                // fiddle with the elements
                for (var key in userToElems) {
                    var elemsToCheck = userToElems[key];
                    for (var i = 0, tot = elemsToCheck.length; i < tot; i++) {
                        if (Math.random() > 0.5) {
                            var liElem = document.getElementById(elemsToCheck[i]);
                            liElem.style.backgroundColor = 'red'
                        }
                    }
                }
            };

            var users = Object.keys(userToElems).join(",");
            x.send("site=" + TWITTER + "&users=" + users);
        },
        fb: function () {
            // TODO impl this
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
            var htmlCol = stream.querySelectorAll("li[data-item-type=tweet]");
            var liElems = [].slice.call(htmlCol);

            var mapData = liElems.map(function (obj) {
                var elemId = obj.getAttribute("id");

                var divWithData = obj.querySelector("div.tweet.original-tweet");
                var username = divWithData.getAttribute("data-screen-name");
                return {username: username, elemId: elemId};
            });

            // now group them by username
            var data = {};
            for (var i = 0; i < mapData.length; i++) {
                if (data[mapData[i].username] == null)
                    data[mapData[i].username] = []

                data[mapData[i].username].push(mapData[i].elemId)
            }
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
    function(request, sender, sendResponse) {
        if (request.startScanning) {
            if (request.site === TWITTER)
                crawler.tw();
            else if (request.site == FACEBOOK)

            sendResponse({farewell: "started crawling"});
        }
    });