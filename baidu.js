if (debug) console.log("Baidu Main Page is Loaded!");

mPage.initialize = function () {
    mPage.query = $("#query_input").val();
    mPage.page_id = parseInt($("#page strong span.pc").text());
    mPage.html = document.documentElement.outerHTML;
    $(".c-container").each(function (id, element) {
        var result_id = parseInt($(element).attr("id"));
        console.log(result_id);
        $(element).find("a").each(function (child_id, child_element) {
            if ($(child_element).attr("bindClick") == undefined) {
                $(child_element).attr("bindClick", true);
                $(child_element).click(function () {
                    mPage.click($(this).get(0), "content", result_id);
                });
            }
        });
    });
};

setTimeout(mPage.initialize, 1500);

mPage.update = function () {
    $("#s_tab a").each(function (id, element) {
        if ($(element).attr("bindClick") == undefined) {
            $(element).attr("bindClick", true);
            $(element).click(function () {
                mPage.click($(this).get(0), "tab", 0);
            });
        }
    });
    $(".c-container").each(function (id, element) {
    	if (debug) console.log(id);
        var result_id = parseInt($(element).attr("id"));
        console.log(result_id);
        $(element).find("a").each(function (child_id, child_element) {
            if ($(child_element).attr("bindClick") == undefined) {
                $(child_element).attr("bindClick", true);
                $(child_element).click(function () {
                    mPage.click($(this).get(0), "content", result_id);
                });
            }
        });
    });
};