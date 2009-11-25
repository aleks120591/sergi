function urlDecode(_1){
_1=_1.replace(new RegExp("\\+","g")," ");
return unescape(_1);
}
function urlEncode(_2){
_2=escape(_2);
_2=_2.replace(new RegExp("\\+","g"),"%2B");
return _2.replace(new RegExp("%20","g"),"+");
}
var END_OF_INPUT=-1;
var base64Chars=new Array("A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","0","1","2","3","4","5","6","7","8","9","+","/");
var reverseBase64Chars=new Array();
for(var i=0;i<base64Chars.length;i++){
reverseBase64Chars[base64Chars[i]]=i;
}
var base64Str;
var base64Count;
function setBase64Str(_3){
base64Str=_3;
base64Count=0;
}
function readBase64(){
if(!base64Str){
return END_OF_INPUT;
}
if(base64Count>=base64Str.length){
return END_OF_INPUT;
}
var c=base64Str.charCodeAt(base64Count)&255;
base64Count++;
return c;
}
function encodeBase64(_5){
setBase64Str(_5);
var _6="";
var _7=new Array(3);
var _8=0;
var _9=false;
while(!_9&&(_7[0]=readBase64())!=END_OF_INPUT){
_7[1]=readBase64();
_7[2]=readBase64();
_6+=(base64Chars[_7[0]>>2]);
if(_7[1]!=END_OF_INPUT){
_6+=(base64Chars[((_7[0]<<4)&48)|(_7[1]>>4)]);
if(_7[2]!=END_OF_INPUT){
_6+=(base64Chars[((_7[1]<<2)&60)|(_7[2]>>6)]);
_6+=(base64Chars[_7[2]&63]);
}else{
_6+=(base64Chars[((_7[1]<<2)&60)]);
_6+=("=");
_9=true;
}
}else{
_6+=(base64Chars[((_7[0]<<4)&48)]);
_6+=("=");
_6+=("=");
_9=true;
}
_8+=4;
if(_8>=76){
_6+=("\n");
_8=0;
}
}
return _6;
}
function encodeBase64ForURL(_a){
return encodeBase64(_a).replace(/=/g,"").replace(/\+/g,"*").replace(/\//g,"-");
}
function decodeBase64ForURL(_b){
return decodeBase64(_b.replace(/\*/g,"+").replace(/-/g,"/"));
}
function readReverseBase64(){
if(!base64Str){
return END_OF_INPUT;
}
while(true){
if(base64Count>=base64Str.length){
return END_OF_INPUT;
}
var _c=base64Str.charAt(base64Count);
base64Count++;
if(reverseBase64Chars[_c]){
return reverseBase64Chars[_c];
}
if(_c=="A"){
return 0;
}
}
return END_OF_INPUT;
}
function ntos(n){
n=n.toString(16);
if(n.length==1){
n="0"+n;
}
n="%"+n;
return unescape(n);
}
function decodeBase64(_e){
setBase64Str(_e);
var _f="";
var _10=new Array(4);
var _11=false;
while(!_11&&(_10[0]=readReverseBase64())!=END_OF_INPUT&&(_10[1]=readReverseBase64())!=END_OF_INPUT){
_10[2]=readReverseBase64();
_10[3]=readReverseBase64();
_f+=ntos((((_10[0]<<2)&255)|_10[1]>>4));
if(_10[2]!=END_OF_INPUT){
_f+=ntos((((_10[1]<<4)&255)|_10[2]>>2));
if(_10[3]!=END_OF_INPUT){
_f+=ntos((((_10[2]<<6)&255)|_10[3]));
}else{
_11=true;
}
}else{
_11=true;
}
}
return _f;
}
var digitArray=new Array("0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f");
function toHex(n){
var _13="";
var _14=true;
for(var i=32;i>0;){
i-=4;
var _16=(n>>i)&15;
if(!_14||_16!=0){
_14=false;
_13+=digitArray[_16];
}
}
return (_13==""?"0":_13);
}
function pad(str,len,pad){
var _1a=str;
for(var i=str.length;i<len;i++){
_1a=pad+_1a;
}
return _1a;
}
function encodeHex(str){
var _1d="";
for(var i=0;i<str.length;i++){
_1d+=pad(toHex(str.charCodeAt(i)&255),2,"0");
}
return _1d;
}
function decodeHex(str){
str=str.replace(new RegExp("s/[^0-9a-zA-Z]//g"));
var _20="";
var _21="";
for(var i=0;i<str.length;i++){
_21+=str.charAt(i);
if(_21.length==2){
_20+=ntos(eval("0x"+_21));
_21="";
}
}
return _20;
}

