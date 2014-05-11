// ==UserScript==
// @name aiit_video_helper
// @namespace pingineer
// @description aiit video without silverlight
// @include https://v.aiit.ac.jp/*
// @include http://v.aiit.ac.jp/*
// @grant       none
// ==/UserScript==

    

(function(){

    function Make_asx_link(){
        // metaタグ内からasxのURLを探してページトップにそのリンクを作成
       var metaTags = document.getElementsByTagName('meta');
       for(var i=0;i<metaTags.length; i++){
           if(metaTags[i].name=="MediaPlayer-video.asxurl"){
               var asx_url = metaTags[i].content;
           }
       }

       if(asx_url){
           var asx_link = document.createElement('div');
           asx_url = '<a href="' + asx_url;
           asx_url += '" style="margin:10pt;">asx</a><HR>';
           asx_link.innerHTML = asx_url;
           document.body.insertBefore(asx_link, document.body.firstChild); 
       }
        
    }
    
    
    function Disable_popup(){
       var aTags = document.getElementsByTagName('a');
       var re = /embedPlaySilverLight\((\d+),(\d+)\).*/;
       for(var i=0;i<aTags.length; i++){
           var aTag = unescape(aTags[i].getAttribute("onclick"));
           var video_param= aTag.match(re);
           if(video_param){
               var contentsCode = video_param[1];
               var categoryCode = video_param[2];
               var url = "https://v.aiit.ac.jp/pcsweb/SilverlightMediaPlayer/play.html?"
                 + "contentsCode=" + contentsCode
                 + "&categoryCode=" + categoryCode;
               Get_silverlight_page(url,Parse_silverlight_page)
           }
       }

        // 邪魔なのでpopupを潰して直リンクに変える
       function evalInPage(func) {
          location.href = "javascript:void (" + func + ")()";
       }

        
       evalInPage(function () {
          embedPlaySilverLight = function(contentsCode,categoryCode){
              var url = "http://v.aiit.ac.jp/pcsweb/SilverlightMediaPlayer/play.html?"
                 + "contentsCode=" + contentsCode
                 + "&categoryCode=" + categoryCode;
              location.href=url; 
          }
       }); 
    }
    

    var silverlight_page;
    var asx_url;
    function Get_silverlight_page(url,parse_page){

        silverlight_page = new XMLHttpRequest();
        silverlight_page.onload = parse_page;
        silverlight_page.open("GET",url,true);
        silverlight_page.send(null);
    }
    
    function Parse_silverlight_page() {
 
        var re = /<meta name=\"MediaPlayer-video.asxurl\" content=\"(.*)\" \/>/;
        var line = new Array();
        var lines=silverlight_page.responseText;
 
        line = lines.split("\n");
        for(var i=0;i<line.length; i++){
           var match_line= line[i].match(re);
           if(match_line){
               asx_url=match_line[1];
               Get_asx_page(asx_url,Parse_asx_page)
           }
       }

    }
    
    
    var asx_page;
    function Get_asx_page(url,parse_page){
       url=url.replace("http","https");
        asx_page = new XMLHttpRequest();
        asx_page.onload = parse_page;
        asx_page.open("GET",url,true);
        asx_page.send(null);
    }
    
    function Parse_asx_page() {
        var re = /<ref href=\"(.*)\" \/>/;
        var line = new Array();
        var lines=asx_page.responseText;
 
        line = lines.split("\n");
        for(var i=0;i<line.length; i++){
           var match_line= line[i].match(re);
           if(match_line){
               Make_wmv_link(match_line[1]);
           }
               
       }

    }
    

    function Make_wmv_link(wmv_url){
        // contents-details.do内の再生ボタンの次にwmvへのリンクを作成
        var divTags = document.getElementsByTagName('div');
        for(var i=0;i<divTags.length; i++){
            if(divTags[i].id=="details_text_box"){
                var wmv_link = document.createElement('div');
                wmv_url = '<a href="' + wmv_url;
                wmv_url += '" style="margin:130px;">wmv</a>';
                wmv_link.innerHTML = wmv_url;
                divTags[i].parentNode.insertBefore(wmv_link,divTags[i].nextSibling);
            }
        }
    }

    
    Make_asx_link();
    Disable_popup();
})();
