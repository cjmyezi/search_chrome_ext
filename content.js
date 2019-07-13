//var debug = false;
var debug1 = false;
var debug = true;
//var debug1 = true;
var current_url = window.location.href;
var current_referrer = document.referrer;
var current_serp_link = "";

function storage_link() {
    //var temp_ref = current_referrer.match(/www\.(baidu)?(sogou)?(so)?\.com\/(s|web)/g);
	var temp_ref = current_referrer.match(/127.0.0.1:8000\/search_api\/(baidu|sogou)/g);
	if (temp_ref != null) { //SERP页面直接link的页面,serp_link是自身
        current_serp_link = current_url;
        /**
         * 请求background存储serp_link链接关系
         */
        chrome.runtime.sendMessage({
            link_store: "request",
            url: current_url,
            serp_link: current_serp_link
        }, function (response) {
            if (debug) console.log(response);
        });
    }
    else {
        /**
         * 请求background获取referrer的serp_link链接关系
         */
        chrome.runtime.sendMessage({ref_request: current_referrer}, function (response) {
            current_serp_link = response;
            if (current_serp_link != "") { //SERP页面间接link的页面
                /**
                 * 请求background存储serp_link链接关系
                 */
                chrome.runtime.sendMessage({
                    link_store: "request",
                    url: current_url,
                    serp_link: current_serp_link
                }, function (response) {
                    if (debug) console.log(response);
                });
            }
        });
    }
}

/**
 * 请求background判断用户是否登录,只有登录状态下插件才会执行初始化
 */
chrome.runtime.sendMessage({log_status: "request"}, function (response) {
    if (response.log_status == true) {
        storage_link();
        if (debug) console.log("content.js is loaded");
        /**
         * 页面初始化
         */
        viewState.initialize();
        if (debug) console.log("initialize done");
        /**
         * 监听页面变化
         */
        document.addEventListener("DOMSubtreeModified", function (event) {
            if (current_url != window.location.href) {
                viewState.sendMessage();

                current_referrer = current_url;
                current_url = window.location.href;
                storage_link();
                viewState.initialize(); //注意此处初始化时由于刚监听到url发生改变,页面结果大部分内容其实还没来得及发生变化,所以跟页面元素相关的初始化一定要注意.
                if (debug) console.log("initialize again");
            }
            else {
                var origin = "???";
                var temp = current_referrer.match(/127.0.0.1:8000\/search_api\/(baidu|sogou)/g);
                if (temp != null) { //SERP页面
                    switch (temp[0]) {
                        case "127.0.0.1:8000/search_api/sogou":
                            origin = "sogou";
                            break;

                        case "127.0.0.1:8000/search_api/baidu":
                            origin = "baidu";
                            break;

                        default:
                            break;
                    }
                }
                if (origin != "???") {
                    viewState.update();
                }
                //if (debug) console.log("update again");
            }
        });
    }
});


