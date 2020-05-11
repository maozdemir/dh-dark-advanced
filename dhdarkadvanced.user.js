// ==UserScript==
// @name         DH Dark Advanced
// @namespace    https://github.com/impulsivus/dh-dark-advanced
// @version      1.0
// @description  Gelişmiş Gece Modu
// @author       The Time Lord
// @match        *://forum.donanimhaber.com/*
// @match        *://github.com/*
// @grant        GM.getValue
// @run-at       document-start
// @grant        GM.setValue
// @grant        GM.xmlHttpRequest
// @resource     DH_DARK https://github.com/impulsiva/dh-dark-advanced/raw/master/internal/forum.style.css
// @grant           GM_addStyle
// @grant           GM_getResourceText
// ==/UserScript==
(function() {
    'use strict';
    var cssTxt = GM_getResourceText ("DH_DARK");
    GM_addStyle (cssTxt);

    window.onload = function() {
        $('body').append('<div class="TTL_CustomToolbar"></div>');
        var myVersion = GM_info.script.version;
        var headBar = "<div class=\"TTL_ToolboxHead\">"+
            "<div class=\"text\">"+
            "DH Dark Advanced <span>"+myVersion+"</span>"+
            "</div>"+
            "</div>";
        $('.TTL_CustomToolbar').append(headBar);


        var currentPage = $($('body')).html();
        var forumIDregex = new RegExp(/\/api2\/GlobalApi\/GetReplyForm\?forumID\=([a-z])\w+\&amp\;/g);
        var forumIDregex = new RegExp(/GetReplyForm\?forumID\=(.*?)\&/g);
        if(forumIDregex == "") {
            forumIDregex = new RegExp(/yeni-konu-(.*?)\" class\=\"kl-btn/g);
        }

        var forumID = forumIDregex.exec(currentPage)[1];
        console.log("REGEX RESULT: "+forumIDregex.exec(currentPage)[1]);
        //var forumID = 2108;
        var kin = 1;
        var maxPageOnLeftBar = 2;
        var injectContent = "";
        while(kin <= maxPageOnLeftBar) {
            $.get("https://forum.donanimhaber.com/api2/GlobalApi/gettopics?forumId="+forumID+"&page="+kin+"&filter=", function( data ) {
                var userData = data["Data"]["Html"];
                var elements = $($.parseHTML(userData)).find("h3");
                var elementsWithAds = $($.parseHTML(userData)).find(".kl-konu");
                var adsCount = (elementsWithAds.length - elements.length);
                var elements_replies = $($.parseHTML(userData)).find(".kl-cevap span");
                $.each(elements, function(i,v){
                    if(i != 0) {
                        var iwa = i+adsCount-1;
                        var content = "<div class=\"TTL_ToolboxItem\">" + v.parentElement.outerHTML + " <span>(" + elements_replies[iwa].innerHTML + ")</span></div>";
                        $('.TTL_CustomToolbar').append(content);
                    }
                });
            });
            kin++;
        }
    }

    function getUrlParameter(url) {
        var toReturn = {};
        var questionSplit = url.split('?');
        questionSplit.shift();
        var onlyParameters = questionSplit.join('?');
        var splittedParameters = onlyParameters.split('&');
        for (var c = 0; c < splittedParameters.length; c++) {
            var parts = splittedParameters[c].split('=');
            if ($.trim(parts[0]) != '') {
                toReturn[parts[0]] = parts[1];
            }
        }
        return toReturn;
    }
})();
