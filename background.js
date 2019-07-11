var baseUrl = "http://127.0.0.1:8000";
//var baseUrl = "http://166.111.138.86:15016";
var checkUrl = baseUrl + "/user/check/";
var dataUrl = baseUrl + "/chromeext_ajax/save_interaction";
var version = "1.0";
//var debug1 = false;
var debug1 = true;
var lastReminder = 0;

/**
 * 把消息存在LocalStorge
 * 并且返回相应的Key
 * @param {Message} Msg 需要储存的消息
 */
function storgeInfo(Msg) {
    var key = (new Date()).getTime();
    localStorage["" + key] = Msg;
    return "" + key;
}

/**
 * 传入Key,删除文件
 * @param {String} key 用来删除东西用的
 */
function deleteInfo(key) {
    localStorage.removeItem(key);
}

/**
 * 把消息发给服务器
 * 首先储存这个消息，避免发送过程中被关掉导致数据丢失。
 * 发送完成后删除本地储存。
 * @param {Message} Msg 需要发给服务器的消息
 */
function sendInfo(Msg) {
    var key = storgeInfo(Msg);
    $.ajax({
        type: "POST",
        dataType: "text",
        //dataType: 'json',
        url: dataUrl,
        data: {message: Msg},
        //contentType: "application/json; charset=utf-8",
        success: function (data) {
            deleteInfo(key);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            //if (jqXHR.status == 400) {//需要更新
            //    if ((new Date()).getTime() - lastReminder < 10 * 60 * 1000) return;
            //    lastReminder = (new Date()).getTime();
            //    deleteInfo(key);
            //    // 用户授权
            //    if (Notification.permission != "granted") {
            //        window.open(downloadLink);
            //    } else {
            //        var notification = new Notification('升级提醒', {
            //            icon: 'https://www.silog.fr/wp-content/uploads/2015/04/Rouages-Grand.png',
            //            body: "您的插件目前不是最新版，可能影响使用结果，请尽快更新。点击下载最新版本。"
            //        });
            //        notification.onclick = function () {
            //            window.open(downloadLink);
            //            //window.location.href = "http://on9i1rseh.bkt.clouddn.com/Extension/ASmallPlugin.crx"
            //        };
            //    }
            //
            //}
        }
    });
}

/**
 * 把以前没有发送成功的数据发送出去
 */
function flush() {
    for (var i = localStorage.length - 1; i >= 0; i--) {
        var lastkey = localStorage.key(i);
        if (lastkey.match(/[0-9]*/g)[0] != lastkey) continue;
        var Msg = localStorage[lastkey];
        deleteInfo(lastkey);
        sendInfo(Msg);
    }
}
flush();


/**
 * 用来进行不同的通讯
 *
 * content.js 会请求判断登录状态,传输链接关系,要求加载一些脚本
 *
 * popup.js 会传递用户名和密码
 *
 * basic.js 会要求发送所有信息
 */
chrome.runtime.onMessage.addListener(function (Msg, sender, sendResponse) {
    if (debug1) console.log(Msg);
    /**
     * 监听到判断用户登录请求
     */
    if (Msg.log_status == "request") {
    	chrome.browserAction.setBadgeText({text: 'on'});
    	chrome.browserAction.setBadgeBackgroundColor({color: [255, 0, 0, 255]});
    	sendResponse({log_status: true});
        return;
    }
    /**
     * 监听到储存serp_link链接关系请求
     */
    if (Msg.link_store == "request") {
        sessionStorage.setItem(Msg.url, Msg.serp_link);
        sendResponse("sessionStorage done");
        return;
    }
    /**
     * 监听到查询serp_link链接关系请求
     */
    if (Msg.ref_request != undefined) {
        var serp_link = sessionStorage.getItem(Msg.ref_request);
        if (serp_link != undefined)
            sendResponse(serp_link);
        else
            sendResponse("");
        return;
    }
    /**
     * 监听到执行脚本请求
     */
    if (Msg.file != undefined) {
        chrome.tabs.executeScript(sender.tab.id, Msg);
        sendResponse({scriptFinish: true});
        return;
    }

    /**
     * 监听到basic.js发送信息请求
     */
    if (Msg.send_flag == true) {
        Msg.username = localStorage['username'];
        Msg = JSON.stringify(Msg);
        sendInfo(Msg);//交给发送吧
    }
    //if (Msg == null || !("wkl" in Msg)) return;//这是谁乱发的消息？？？ QAQ
    //if (Msg.referrer.startsWith("https://www.image-feedback.com")) return;
    //Msg.username = username;
    //Msg.version = version;
});


