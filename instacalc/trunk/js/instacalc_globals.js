function getEmailLink(){
var _1="mailto:?subject=check out my calculation&body=Hi, I found this website and thought you might like it http://www.geocities.com/wowhtml/";
return _1;
}
function editDescription(){
hideItem("readdescription");
showItem("editdescription");
loadDescription();
}
function cancelDescription(){
showItem("readdescription");
hideItem("editdescription");
}
function updateDescription(){
setDescription(document.getElementById("descriptiontextarea").value);
showItem("readdescription");
hideItem("editdescription");
}
function getDescription(){
return InstaCalc.description;
}
function setDescription(_2){
var x=document.getElementById("descriptiontext");
InstaCalc.description=_2;
x.innerHTML=txt2html(InstaCalc.description);
}
function html2txt(_4){
_4=_4.replace(/<a href="(https?:\S*)"[^>]*>([^<]*)<\/a>/ig,"[$2]($1)");
_4=unescapeHTML(_4);
return _4;
}
function txt2html(_5){
_5=escapeHTML(_5);
_5=_5.replace(/\[([^\]]*)\]\s*[(](https?:\S*)[)]/ig,"<a href=\"$2\" target=\"_blank\">$1</a>");
return _5;
}
function escapeHTML(_6){
return _6.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\n/g," <br/> ");
}
function unescapeHTML(_7){
return _7.replace(/&amp;/g,"&").replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/\s?<br[\/]?>\s?/ig,"\n");
}
function loadDescription(){
var x=document.getElementById("descriptiontext");
var y=document.getElementById("descriptiontextarea");
y.value=html2txt(x.innerHTML);
InstaCalc.description=html2txt(x.innerHTML);
}
function createDeliciousLink(){
var _a="&tags=instacalc";
var _b="&title=InstaCalc:%20";
var _c="&noui&jump=close&v=4";
createURL();
var _d="http://del.icio.us/jshell.com?url="+InstaCalc.permalink.replace(/&/g,"%26")+_b+_a+_c;
return _d;
}
function createEmbedURL(){
createURL();
return InstaCalc.embedlink;
}

