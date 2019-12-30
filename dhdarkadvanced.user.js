// ==UserScript==
// @name         DH Dark Advanced
// @namespace    https://github.com/impulsiva/dh-dark-advanced
// @version      0.1
// @description  DH için gelişmiş gece modu
// @author       The Time Lord
// @match        *://forum.donanimhaber.com/*
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.xmlHttpRequest
// ==/UserScript==

(async function() {
    'use strict';

    $('body').append('<div class="TTL_CustomToolbar"></div>');

    $(window).on('load', function() {

        var currentPage = $($('body')).html();
        var forumIDregex = new RegExp(/GetReplyForm\?forumID\=(.*?)\&/g);
        var forumID = forumIDregex.exec(currentPage)[1];
        $.get("https://forum.donanimhaber.com/api2/GlobalApi/gettopics?forumId="+forumID+"&page=1&filter=", function( data ) {
            var userData = data["Data"]["Html"];
            var elements = $($.parseHTML(userData)).find("h3");
            var elementsWithAds = $($.parseHTML(userData)).find(".kl-konu");
            var adsCount = (elementsWithAds.length - elements.length);
            var elements_replies = $($.parseHTML(userData)).find(".kl-cevap span");
            var injectContent ="";
            $.each(elements, function(i,v){
                if(i != 0) {
                    var iwa = i+adsCount-1;
                    var content = "<div class=\"TTL_ToolboxItem\">" + v.parentElement.outerHTML + " <span>(" + elements_replies[iwa].innerHTML + ")</span></div>";
                    injectContent += content;
                }
            });
            $('.TTL_CustomToolbar').html(injectContent);
        });
        $.get("https://forum.donanimhaber.com/api2/GlobalApi/gettopics?forumId="+forumID+"&page=2&filter=", function( data ) {
            var userData = data["Data"]["Html"];
            var elements = $($.parseHTML(userData)).find("h3");
            var elementsWithAds = $($.parseHTML(userData)).find(".kl-konu");
            var adsCount = (elementsWithAds.length - elements.length);
            var elements_replies = $($.parseHTML(userData)).find(".kl-cevap span");
            var injectContent ="";
            $.each(elements, function(i,v){
                if(i != 0) {
                    var iwa = i+adsCount-1;
                    var content = "<div class=\"TTL_ToolboxItem\">" + v.parentElement.outerHTML + " <span>(" + elements_replies[iwa].innerHTML + ")</span></div>";
                    injectContent += content;
                }
            });
            $('.TTL_CustomToolbar').append(injectContent);
        });
})();