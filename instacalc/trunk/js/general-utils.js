function hideItem(_1){
var i=document.getElementById(_1);
if(i!=null){
i.style.display="none";
}
}
function showItem(_3){
var i=document.getElementById(_3);
if(i!=null){
i.style.display="";
}
}
function isObjectHidden(_5){
if(_5!=null){
return _5.style.display=="none";
}
return null;
}
function isObjectVisible(_6){
if(_6!=null){
return !(_6.style.display=="none");
}
return null;
}
function isHidden(_7){
var i=document.getElementById(_7);
if(i!=null){
return i.style.display=="none";
}
return null;
}
function isVisible(_9){
var i=document.getElementById(_9);
if(i!=null){
return i.style.display=="";
}
return null;
}
function hideObject(_b){
if(_b!=null){
_b.style.display="none";
}
}
function showObject(_c){
if(_c!=null){
_c.style.display="";
}
}
function toggle(i){
if(i.style.display=="none"){
i.style.display="";
}else{
i.style.display="none";
}
}
function toggleItem(_e){
var i=document.getElementById(_e);
if(i.style.display=="none"){
showObject(i);
}else{
hideObject(i);
}
}
function clearItem(_10){
var i=document.getElementById(_10);
i.innerHTML="";
}
function hideAllItems(_12){
var i=0;
for(i=0;i<_12.length;i++){
hideItem(_12[i]);
}
}
function changeCSS(id,_15){
var _16=document.getElementById(id);
_16.className=_15;
}
function setFont(_17,_18){
var i=document.getElementById(_17);
i.style.display=ParseInt(_18);
}
function sleep(ms){
date=new Date();
var _1b=null;
do{
var _1b=new Date();
}while(_1b-date<ms);
}
function toggleBoolean(i){
return !i;
}
function toggle(i){
if(i==1){
i=0;
}else{
if(i==0){
i=1;
}
}
return i;
}
function getURLParams(str){
var _1f;
if(str==null){
var _20=window.location.href;
}else{
var _20=str;
}
if(_20.indexOf("?")>-1){
var a=_20.split("?");
_20="?"+a[1];
}else{
_20="";
}
return _20;
}
function getURLParam(_22){
var _23="";
var _24=window.location.href;
if(_24.indexOf("?")>-1){
var _25=_24.substr(_24.indexOf("?"));
var _26=_25.split("&");
for(var _27=0;_27<_26.length;_27++){
if(_26[_27].indexOf(_22+"=")>-1){
var _28=_26[_27].split("=");
_23=_28[1];
break;
}
}
}
return _23;
}
function getURLNoParams(){
var _29=window.location.href;
if(_29.indexOf("?")>-1){
var a=_29.split("?");
_29=a[0];
}
return _29;
}
function log_old(_2b){
if(logging>0&&(statusarea!=null)){
statusarea.innerHTML+=_2b;
statusarea.innerHTML+="<br/>";
}
}
function setlogging(i){
logging=i;
}
function log_old(msg){
var _2e=document.getElementById("log");
if(_2e!=null){
_2e.innerHTML+=msg;
_2e.innerHTML+="<br/>";
}
}
function log1(msg){
if(logging!=null&&logging>=1){
log(msg);
}
}
function log2(msg){
if(logging!=null&&logging>=2){
log(msg);
}
}
function log3(msg){
if(logging!=null&&logging>=3){
log(msg);
}
}
function getTime(){
var now=new Date();
var _33="am";
hours=now.getHours();
minutes=now.getMinutes();
seconds=now.getSeconds();
if(hours>=12){
hours-=12;
_33="pm";
}
if(minutes<10){
minutes="0"+minutes;
}
if(seconds<10){
seconds="0"+seconds;
}
return hours+":"+minutes+":"+seconds+" "+_33;
}
function uniqueArray(a){
if(a==[]){
return [];
}
var i;
a=a.sort();
b=[];
for(i=0;i<a.length;i++){
if(b.length==0){
b.push(a[i]);
}
if(b[b.length-1]!=a[i]){
b.push(a[i]);
}
}
return b;
}
function isdefined(_36){
return (typeof (_36)=="undefined")?false:true;
}
function arraySearch(_37,a){
if(!isdefined(a)){
return -1;
}
for(i=0;i<a.length;i++){
if(_37==a[i]){
return i;
}
}
return -1;
}
function objectSearchI(_39,obj){
for(var i in obj){
if(obj[i].toString().toUpperCase()==_39.toString().toUpperCase()){
return i;
}
}
return null;
}
function confirmClick(str){
if(str==""){
str="Are you sure you wish to continue?";
}
var _3d=confirm(str);
if(_3d){
return true;
}else{
return false;
}
}
function txt2url(str){
str=str.replace(/_/g,"%5f");
str=str.replace(/ /g,"_");
str=escape(str);
return str;
}
function url2txt(str){
str=unescape(str);
str=str.replace(/_/g," ");
str=str.replace(/%5f/ig,"_");
return str;
}

