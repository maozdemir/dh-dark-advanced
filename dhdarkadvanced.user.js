// ==UserScript==
// @name         Donanım Haber Supercharged
// @namespace    http://tampermonkey.net/
// @version      1.1-b1
// @description  Gelişmiş Gece Modu ve bi' ton özellik
// @author       The Time Lord
// @match        *://forum.donanimhaber.com/*
// @grant        GM.getValue
// @run-at       document-start
// @grant        GM.setValue
// @grant        GM.xmlHttpRequest
// @resource     DH_DARK https://github.com/impulsiva/dh-dark-advanced/raw/beta/internal/forum.style.css
// @resource     DH_LIGHT https://github.com/impulsiva/dh-dark-advanced/raw/beta/internal/forum.style.light.css?ver=6
// @grant           GM_addStyle
// @grant           GM_getResourceText
// ==/UserScript==


(async function() {
    'use strict';
    var cssTxt = GM_getResourceText ("DH_DARK");
    var cssLightTxt = GM_getResourceText ("DH_LIGHT");
    var ValDark = await GM.getValue("TTL_Dark", false);
    if(ValDark) GM_addStyle (cssTxt);
    if(!ValDark) GM_addStyle (cssLightTxt);

    var ValCevap = await GM.getValue("TTL_Cevap", false);
    var ValPM = await GM.getValue("TTL_PM", false);
    var ValFav = await GM.getValue("TTL_Fav", false);
    var ValGec = await GM.getValue("TTL_Gec", false);
    var ValFrm = await GM.getValue("TTL_Frm", false);
    var ValBO = await GM.getValue("TTL_BO", false);
    var ValSB = await GM.getValue("TTL_SB", false);

    window.onload = async function() {

        if(ValCevap) {
            $("#login_header > div > div.sag > div.ana-menu > a:nth-child(1)").attr("style", "display: none !important");
        }
        if(ValPM) {
            $("#login_header > div > div.sag > div.ana-menu > a:nth-child(2)").attr("style", "display: none !important");
        }
        if(ValFav) {
            $("#login_header > div > div.sag > div.ana-menu > a:nth-child(3)").attr("style", "display: none !important");
        }
        if(ValGec) {
            $("#login_header > div > div.sag > div.ana-menu > a:nth-child(4)").attr("style", "display: none !important");
        }
        if(ValFrm) {
            $("#login_header > div > div.sag > div.ana-menu > span:nth-child(5)").attr("style", "display: none !important");
        }
        if(ValBO) {
            $("#login_header > div > div.sag > div.ana-menu > span:nth-child(6)").attr("style", "display: none !important");
        }
        if(ValSB) {
            $("#login_header > div > div.foruma-git").attr("style", "display: none !important");
        }


        $('body').append('<div class="TTL_CustomToolbar"></div>');
        var myVersion = GM_info.script.version;
        var settingsIcon = "https://raw.githubusercontent.com/impulsivus/DH-Gece-Modu/master/internals/baseline_settings_white_18dp.png";
        var headBar = "<div class=\"TTL_ToolboxHead\">"+
            "<div class=\"text\">"+
            "DH Dark Advanced <span>"+myVersion+"</span>"+
            "</div>"+
            "</div>";
        $('.TTL_CustomToolbar').append(headBar);


        var currentPage = $($('body')).html();
        var forumIDregex = new RegExp(/GetReplyForm\?forumID\=(.*?)\&/g);
        if(forumIDregex == "") {
            forumIDregex = new RegExp(/yeni-konu-(.*?)\" class\=\"kl-btn/g);
        }
        var forumID;
        if (forumIDregex.exec(currentPage) == null) {
            forumID = 0;
        } else {
            forumID = forumIDregex.exec(currentPage)[1];
        }
        console.log("REGEX RESULT: "+forumID);
        if(forumID != 0) {
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
                            console.log(content);
                        }
                    });
                });
                kin++;
            }
            console.log(injectContent);
        }

        
        var HTML_Settings = '<div class="TTL_Settings">'+
            '<input type="checkbox" name="TTL_Dark" id="TTL_Dark"/>'+
            '<label for="TTL_Dark">Dark mod</label><br/>'+
            '<input type="checkbox" name="TTL_Cevap" id="TTL_Cevap"/>'+
            '<label for="TTL_Cevap">"Cevaplanan" düğmesini gizle</label><br/>'+
            '<input type="checkbox" name="TTL_PM" id="TTL_PM"/>'+
            '<label for="TTL_PM">"Özel Mesaj" düğmesini gizle</label><br/>'+
            '<input type="checkbox" name="TTL_Fav" id="TTL_Fav"/>'+
            '<label for="TTL_Fav">"Favoriler" düğmesini gizle</label><br/>'+
            '<input type="checkbox" name="TTL_Gec" id="TTL_Gec"/>'+
            '<label for="TTL_Gec">"Geçmiş" düğmesini gizle</label><br/>'+
            '<input type="checkbox" name="TTL_Frm" id="TTL_Frm"/>'+
            '<label for="TTL_Frm">"Forumlarım" düğmesini gizle</label><br/>'+
            '<input type="checkbox" name="TTL_BO" id="TTL_BO"/>'+
            '<label for="TTL_BO">"Bana Özel" düğmesini gizle</label><br/>'+
            '<input type="checkbox" name="TTL_SB" id="TTL_SB"/>'+
            '<label for="TTL_SB">Arama kutusunu gizle</label><br/>'+
            '<input type="button" value="Kaydet" id="TTL_Save"/></div>';
        
        $('body').append('<div class="TTL_Popup" title="Ayarlar" id="dialog"></div>');
        $(".TTL_Popup").html(HTML_Settings);
        $('.sag .uye .avatar').before('<a href="#" title="Supercharger" id="TTL_SettingsButton" class="supercharger">⚡</a>');
        $('#TTL_SettingsButton').click(function() {
            $(".TTL_Popup").dialog(
                {
                    modal: true,
                    hide: { effect: "fade", duration: 500 }
                }
                );
        })
        
        if(ValDark == true) { $('#TTL_Dark').prop("checked", true);}
        if(ValCevap == true) { $('#TTL_Cevap').prop("checked", true);}
        if(ValPM == true)  { $('#TTL_PM').prop("checked", true);}
        if(ValFav == true)  { $('#TTL_Fav').prop("checked", true);}
        if(ValGec == true)  { $('#TTL_Gec').prop("checked", true);}
        if(ValFrm == true)  { $('#TTL_Frm').prop("checked", true);}
        if(ValBO == true)  { $('#TTL_BO').prop("checked", true);}
        if(ValSB == true)  { $('#TTL_SB').prop("checked", true);}

        $("#TTL_SettingsButton").click(function(){
            $(".TTL_Popup").html(HTML_Settings);
            $("#TTL_Save").click(function() {
                var TTL_Cevap  = $('#TTL_Cevap').is(":checked");
                var TTL_PM     = $('#TTL_PM').is(":checked");
                var TTL_Fav    = $('#TTL_Fav').is(":checked");
                var TTL_Gec    = $('#TTL_Gec').is(":checked");
                var TTL_Frm    = $('#TTL_Frm').is(":checked");
                var TTL_BO     = $('#TTL_BO').is(":checked");
                var TTL_SB     = $('#TTL_SB').is(":checked");
                var TTL_Dark     = $('#TTL_Dark').is(":checked");
                GM.setValue("TTL_Cevap", TTL_Cevap);
                GM.setValue("TTL_PM", TTL_PM);
                GM.setValue("TTL_Fav", TTL_Fav);
                GM.setValue("TTL_Gec", TTL_Gec);
                GM.setValue("TTL_Frm", TTL_Frm);
                GM.setValue("TTL_BO", TTL_BO);
                GM.setValue("TTL_SB", TTL_SB);
                GM.setValue("TTL_Dark", TTL_Dark);
                alert("Kaydedildi!");
            });
        });
    }
})();