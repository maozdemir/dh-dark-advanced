// ==UserScript==
// @name         DH Dark Advanced
// @namespace    http://tampermonkey.net/
// @version      0.3-b1
// @description  Gelişmiş Gece Modu
// @author       The Time Lord
// @match        *://forum.donanimhaber.com/*
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

        var currentPage = $($('body')).html();
        console.log(currentPage);
        var forumIDregex = new RegExp(/GetReplyForm\?forumID\=(.*?)\&/g);
        if(forumIDregex == null) forumIDregex = new RegExp(/yeni-konu-(.*?)\" class\=\"kl-btn/g);

        var forumID = forumIDregex.exec(currentPage)[1];
        console.log("REGEX RESULT: "+forumIDregex.exec(currentPage)[1]);
        $.get("https://forum.donanimhaber.com/api2/GlobalApi/gettopics?forumId="+forumID+"&page=1&filter=", function( data ) {
            var userData = data["Data"]["Html"];
            var elements = $($.parseHTML(userData)).find("h3");
            var elementsWithAds = $($.parseHTML(userData)).find(".kl-konu");
            var adsCount = (elementsWithAds.length - elements.length);
            console.log("Ads count:"+adsCount);
            var elements_replies = $($.parseHTML(userData)).find(".kl-cevap span");
            var injectContent ="";
            $.each(elements, function(i,v){
                if(i != 0) {
                    var iwa = i+adsCount-1;
                    var content = "<div class=\"TTL_ToolboxItem\">" + v.parentElement.outerHTML + " <span>(" + elements_replies[iwa].innerHTML + ")</span></div>";
                    injectContent += content;
                    console.log(content);
                    console.log("i"+i+"iwa"+iwa);
                }
            });
            $('.TTL_CustomToolbar').html(injectContent);
            console.log( "Load was performed for Page1.");
        });
        $.get("https://forum.donanimhaber.com/api2/GlobalApi/gettopics?forumId="+forumID+"&page=2&filter=", function( data ) {
            var userData = data["Data"]["Html"];
            var elements = $($.parseHTML(userData)).find("h3");
            var elementsWithAds = $($.parseHTML(userData)).find(".kl-konu");
            var adsCount = (elementsWithAds.length - elements.length);
            console.log("Ads count:"+adsCount);
            var elements_replies = $($.parseHTML(userData)).find(".kl-cevap span");
            var injectContent ="";
            $.each(elements, function(i,v){
                if(i != 0) {
                    var iwa = i+adsCount-1;
                    var content = "<div class=\"TTL_ToolboxItem\">" + v.parentElement.outerHTML + " <span>(" + elements_replies[iwa].innerHTML + ")</span></div>";
                    injectContent += content;
                    console.log(content);
                    console.log("i"+i+"iwa"+iwa);
                }
            });
            $('.TTL_CustomToolbar').append(injectContent);
            console.log( "Load was performed for Page1.");
        });
        const queryString = window.location.search;
        console.log(queryString);



    if(getUrlParameter(window.location.href)["configPage"] === "true") {
        console.log("INIT xhr");
        GM.xmlHttpRequest({
            method: "GET",
            url: "https://github.com/impulsiva/DH-Gece-Modu/raw/master/internals/config.html",
            onload: function(response) {
                var responseXML = null;

                $(".dhorta").html(response.response);
                console.log(response.response);
                if (!response.responseXML) {
                    responseXML = new DOMParser()
                        .parseFromString(response.responseText, "text/xml");
                }

                console.log([
                    response.status,
                    response.statusText,
                    response.readyState,
                    response.responseHeaders,
                    response.responseText,
                    response.finalUrl,
                    responseXML
                ].join("\n"));
            }
        });
        var HTML_Settings = '<div class="TTL_Settings"><input type="checkbox" name="TTL_Cevap" id="TTL_Cevap"/><label for="TTL_Cevap">"Cevaplanan" düğmesini gizle</label><br/><input type="checkbox" name="TTL_PM" id="TTL_PM"/><label for="TTL_PM">"Özel Mesaj" düğmesini gizle</label><br/><input type="checkbox" name="TTL_Fav" id="TTL_Fav"/><label for="TTL_Fav">"Favoriler" düğmesini gizle</label><br/><input type="checkbox" name="TTL_Gec" id="TTL_Gec"/><label for="TTL_Gec">"Geçmiş" düğmesini gizle</label><br/><input type="checkbox" name="TTL_Frm" id="TTL_Frm"/><label for="TTL_Frm">"Forumlarım" düğmesini gizle</label><br/><input type="checkbox" name="TTL_BO" id="TTL_BO"/><label for="TTL_BO">"Bana Özel" düğmesini gizle</label><br/><input type="checkbox" name="TTL_SB" id="TTL_SB"/><label for="TTL_SB">Arama kutusunu gizle</label><br/><input type="button" value="Kaydet" id="TTL_Save"/></div>';
        $(".dhorta").html(HTML_Settings);
        $("#TTL_Save").click(function() {
            var TTL_Cevap  = $('#TTL_Cevap').is(":checked");
            var TTL_PM     = $('#TTL_PM').is(":checked");
            var TTL_Fav    = $('#TTL_Fav').is(":checked");
            var TTL_Gec    = $('#TTL_Gec').is(":checked");
            var TTL_Frm    = $('#TTL_Frm').is(":checked");
            var TTL_BO     = $('#TTL_BO').is(":checked");
            var TTL_SB     = $('#TTL_SB').is(":checked");
            GM.setValue("TTL_Cevap", TTL_Cevap);
            GM.setValue("TTL_PM", TTL_PM);
            GM.setValue("TTL_Fav", TTL_Fav);
            GM.setValue("TTL_Gec", TTL_Gec);
            GM.setValue("TTL_Frm", TTL_Frm);
            GM.setValue("TTL_BO", TTL_BO);
            GM.setValue("TTL_SB", TTL_SB);
            alert("Kaydedildi!");
        });
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
