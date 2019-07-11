//var baseUrl = "http://166.111.138.86:15016";
var baseUrl = "http://127.0.0.1:8000";

if (jQuery) {
	chrome.browserAction.setBadgeText({text: 'on'});
	chrome.browserAction.setBadgeBackgroundColor({color: [255, 0, 0, 255]});
} else {
    console.log("jQuery is needed!");
}


