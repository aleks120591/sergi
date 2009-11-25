// Copyright 2006 Kalid Azad, instacalc.com. All rights reserved.  
var InstaCalc={};
var I=InstaCalc;
logging=false;
I.cells=0;
I.startcells=7;
I.maxCells=40;
I.version=0.6;
I.inputs=[];
I.outputs=[];
I.outputCache=[];
I.inputCache=[];
I.titles=[];
I.comments=[];
I.separator="z#x3!~";
I.description="";
I.saved=[];
I.permalink="";
I.plotter=null;
I.settings=[];
I.settings.visibility=[];
I.settings.basic=true;
I.settings.round=false;
I.settings.embed=false;
I.divs=["instructions","overview","tutorial","examples","comments","reference","chart"];
function getVersion(){
return I.version;
}
I.PHI=1.6180339887;
I.MOL=6.0221415e+23;
I.fibonacci=function(n){
var t=(Math.pow(I.PHI,n)-Math.pow(1-I.PHI,n))/Math.sqrt(5);
return Math.round(t);
};
I.factorial=function(n){
if(n<0){
return "undefined";
}
if(n===0||n==1){
return 1;
}
if(n>170){
return "too large";
}
var i=1;
while(n>1){
i*=n;
n--;
}
return i;
};
I.nchoosek=function(n,k){
return I.factorial(n)/(I.factorial(n-k)*I.factorial(k));
};
I.convert=function(n,_8){
var i=0;
var _a=0;
while(n>0){
var _b=n%10;
_a+=_b*Math.pow(_8,i);
i++;
n=Math.floor(n/10);
}
return _a;
};
I.sbin=function(n){
var i=0;
var _e="";
for(i=0;i<32;i++){
var _f=(n&(1<<i))>>i;
if(_f==0){
_e+="0";
}else{
_e+="1";
}
}
_e=_e.split("").reverse().join("");
return _e;
};
I.bin=function(n){
var tmp;
var _12="0";
if(n<0){
return I.sbin(n);
}else{
tmp=n.toString(2);
}
var i;
var _14="";
var _15=(8-(tmp.length%8))%8;
for(i=0;i<_15;i++){
_14+=_12;
}
return _14+tmp;
};
I.oct=function(n){
return n.toString(8);
};
I.hex=function(n){
var tmp=n.toString(16);
var i;
var _1a="0x";
var _1b=(4-(tmp.length%4))%4;
for(i=0;i<_1b;i++){
_1a+="0";
}
return _1a+tmp;
};
I.dec=function(n){
return n;
};
I.frombin=function(n){
return I.convert(n,2);
};
I.fromhex=function(n){
return I.convert(n,16);
};
I.fromoct=function(n){
return I.convert(n,8);
};
I.deg=function(n){
return n*180/Math.PI;
};
I.rad=function(n){
return n*Math.PI/180;
};
I.time=function(n){
years=days=hours=minutes=seconds=0;
var _23=false;
if(n<0){
n=Math.abs(n);
}
if(n>=31536000){
years=Math.floor(n/31536000);
n-=Math.round(years*31536000);
}
if(n>=86400){
days=Math.floor(n/86400);
n-=Math.round(days*86400);
}
if(n>=3600){
hours=Math.floor(n/3600);
n-=Math.round(hours*3600);
}
if(n>=60){
minutes=Math.floor(n/60);
n-=Math.round(minutes*60);
}
seconds=n;
str="";
if(years>0){
str+=(years+"y ");
_23=true;
}
if(days>0||_23){
str+=(days+"d ");
_23=true;
}
if(hours>0||_23){
str+=(hours+"h ");
_23=true;
}
if(minutes>0||_23){
str+=(minutes+"m ");
_23=true;
}
if(seconds>0||_23){
str+=(seconds.toPrecision(4)+"s ");
_23=true;
}
return str;
};
I.plot=new ReplotObject();
I.plotTimeout=null;
I.plotRefresh=500;
I.linechart=function(_24){
I.plot.data=_24;
I.plot.type="line";
self.clearTimeout(I.plotTimeout);
I.plotTimeout=self.setTimeout("I.plot.update()",I.plotRefresh);
};
I.barchart=function(_25){
I.plot.data=_25;
I.plot.type="bar";
self.clearTimeout(I.plotTimeout);
I.plotTimeout=self.setTimeout("I.plot.update()",I.plotRefresh);
};
I.piechart=function(_26){
I.plot.data=_26;
I.plot.type="pie";
self.clearTimeout(I.plotTimeout);
I.plotTimeout=self.setTimeout("I.plot.update()",I.plotRefresh);
};
I.arraymax=function(a){
if(a==[]){
return "";
}
max=a[0][1];
for(i=0;i<a.length;i++){
if(a[i][1]>max){
max=a[i][1];
}
}
return max;
};
I.arraymin=function(a){
if(a==[]){
return "";
}
min=a[0][1];
for(i=0;i<a.length;i++){
if(a[i][1]<min){
min=a[i][1];
}
}
return min;
};
I.arraysum=function(a){
if(a==[]){
return "";
}
total=0;
for(i=0;i<a.length;i++){
total+=a[i][1];
}
return total;
};
I.arraydifference=function(a){
if(a==[]){
return "";
}
total=a[0][1];
for(i=1;i<a.length;i++){
total-=a[i][1];
}
return total;
};
I.arrayavg=function(a){
if(a==[]){
return "";
}
var _2c=I.arraysum(a);
var _2d=_2c/a.length;
return _2d;
};
I.random=function(a){
return Math.ceil(Math.random()*a);
};
function setError(str){
I.error=str;
}
function getError(){
return I.error;
}
function rowselect(a,b){
rows=[];
if(b>a){
return rows;
}
if(b>I.cells){
return rows;
}
for(i=a;i<=b;i++){
rows.push(getOutput(i+1).innerHTML);
}
return rows;
}
I.allowedfn={};
I.locals={};
I.safeprepend="I.locals.__qweasdzxc";
I.stringprepend="InstaCalc__String__qweasdzxc";
I.clearLocals=function(){
I.locals={};
};
var a=I.allowedfn;
a.IF="if";
a.ABS="Math.abs";
a.ACOS="Math.acos";
a.ASIN="Math.asin";
a.ATAN="Math.atan";
a.ATAN2="Math.atan2";
a.CEIL="Math.ceil";
a.COS="Math.cos";
a.EXP="Math.exp";
a.FLOOR="Math.floor";
a.LN="Math.log";
a.MAX="Math.max";
a.MIN="Math.min";
a.POWER="Math.pow";
a.ROUND="Math.round";
a.ROUNDDOWN="Math.floor";
a.ROUNDUP="Math.ceil";
a.SIN="Math.sin";
a.SQRT="Math.sqrt";
a.TAN="Math.tan";
a.CHARCODE=true;
a.FROMCHARCODE=true;
a.FIB=true;
a.FAC=true;
a.NCHOOSEK=true;
a.TIME=true;
a.BIN="I.bin";
a.OCT="I.oct";
a.HEX="I.hex";
a.DEC="I.dec";
a.FROMBIN="I.frombin";
a.FROMOCT="I.fromoct";
a.RANDOM="I.random";
a.DEG=true;
a.RAD=true;
a.LINECHART="I.linechart";
a.BARCHART="I.barchart";
a.PIECHART="I.piechart";
a.PARSENUMBER="parseNumber";
a.GETROWVALUES="getRowValues";
a.GETOUTPUTVALUE="getOutputValue";
a.MAX="I.arraymax";
a.MIN="I.arraymin";
a.SUM="I.arraysum";
a.SUB="I.arraydifference";
a.AVERAGE="I.arrayavg";
a.FUNCTION="function";
a.TIME="I.time";
I.allowedcn={};
var c=I.allowedcn;
c.RANDOM="Math.random()";
c.PI="Math.PI";
c.pi="Math.PI";
c.Pi="Math.PI";
c.pI="Math.PI";
c.PHI="I.PHI";
c.E="Math.E";
I.keywords={};
var k=I.keywords;
k.IF="if";
k.ELSE="else";
k.FUNCTION="function";
k.RETURN="return";
k.TRUE="true";
k.FALSE="false";
k.AND="&";
k.OR="|";
k.NOT="~";
k.XOR="^";
k.MOD="%";
I.expressions=[];
var re=new RegExp("\\b"+I.stringprepend+"(\\d+)\\b","g");
I.expressions.push([re,I.stringprepend+"$1"]);
I.prefilter=[];
var p=I.prefilter;
p.push([/\b\s*[+]\s*([\d.]+)\s*%/g," * (1 + .01 * $1)"]);
p.push([/\b\s*[-]\s*([\d.]+)\s*%/g," * (1 - .01 * $1)"]);
p.push([/\b\s*%/g," * .01"]);
p.push([/\b((\d|[,.])+)\s*KB\b/ig,"($1 * 1024)"]);
p.push([/\b((\d|[,.])+)\s*MB\b/ig,"($1 * 1024 * 1024)"]);
p.push([/\b((\d|[,.])+)\s*GB\b/ig,"($1 * 1024 * 1024 * 1024)"]);
p.push([/\b((\d|[,.])+)\s*TB\b/ig,"($1 * 1024 * 1024 * 1024 * 1024)"]);
p.push([/\b((\d|[,.])+)\s*PB\b/ig,"($1 * 1024 * 1024 * 1024 * 1024 * 1024)"]);
p.push([/\b((\d|[,.])+)\s*KBPS\b/ig,"($1 * 1024 / 8)"]);
p.push([/\b((\d|[,.])+)\s*MBPS\b/ig,"($1 * 1024 * 1024 / 8)"]);
p.push([/\b((\d|[,.])+)\s*GBPS\b/ig,"($1 * 1024 * 1024 * 1024 / 8)"]);
p.push([/((\d|[,.])+)\s*K\b/ig,"($1 * 1e3)"]);
p.push([/((\d|[,.])+)\s*M\b/ig,"($1 * 1e6)"]);
p.push([/((\d|[,.])+)\s*B\b/ig,"($1 * 1e9)"]);
p.push([/((\d|[,.])+)\s*T\b/ig,"($1 * 1e12)"]);
p.push([/((\d|[,.])+)\s*thousand\b/ig,"($1 * 1e3)"]);
p.push([/((\d|[,.])+)\s*million\b/ig,"($1 * 1e6)"]);
p.push([/((\d|[,.])+)\s*billion\b/ig,"($1 * 1e9)"]);
p.push([/((\d|[,.])+)\s*trillion\b/ig,"($1 * 1e12)"]);
p.push([/((\b|[.])+([0-9.,]|e-|e)+)\b/g,"PARSENUMBER(\"$1\")"]);
p.push([/\bR(\d+):R(\d+)\b/ig,"getRowValues($1,$2)"]);
p.push([/\bR(\d+),R(\d+)\b/ig,"getRowValues($1,$2)"]);
p.push([/\bR(\d+)\b/ig,"getOutputValue($1 - 1)"]);
p.push([/:/g,","]);
p.push([/\brandom\b/ig,"RANDOM"]);
I.postfilter=[];
function changeRow(row){
if(getInputValue(row)===""){
deleteRow(row);
}else{
insertRow(row);
}
}
function eraseRows(){
var _33=document.getElementById("myTbody");
if(isdefined(_33)&&!isNull(_33)){
var _34=document.getElementById("myTbody");
while(_34.childNodes.length>0){
_34.removeChild(_34.firstChild);
}
}
I.cells=0;
I.inputs=[];
I.titles=[];
}
function clearAllRows(){
var tmp=[];
for(i=0;i<I.cells;i++){
tmp.push("");
}
setCells(tmp);
recalculate();
}
function deleteRow(row){
if(I.cells<=1){
return;
}
saveCells();
saved.splice(row,1);
var v=getVisibility();
v.splice(row,1);
var tmp=createDataString(saved);
if(row>0){
selectRow(getSelectedRow()-1);
}else{
selectRow(0);
}
loadCellsFromString2(tmp);
showAllInputs();
recalculate();
setVisibility(v);
return;
}
function insertRow(row){
if(I.cells>=(I.maxCells-1)){
setStatus("You hit the max -- can't insert any more rows");
return;
}
saveCells();
saved.splice(row+1,0,"");
var v=getVisibility();
v.splice(row+1,0,"s");
var tmp=createDataString(saved);
loadCellsFromString2(tmp);
recalculate();
setVisibility(v);
return;
}
function getVisibility(){
I.settings.visibility=[];
for(i=0;i<I.inputs.length;i++){
if(inputHidden(i)){
I.settings.visibility[i]="h";
}else{
I.settings.visibility[i]="s";
}
}
return I.settings.visibility;
}
function setVisibility(_3c){
var i=0;
for(i=0;i<I.inputs.length;i++){
if(_3c[i]=="h"){
hideInput(i);
}else{
showInput(i);
}
}
getVisibility();
}
function updateReferences(_3e,row){
var i;
var str="";
for(i=0;i<_3e;i++){
str=_3e[i];
if(str.match(/\bR(\d+)\b/ig)){
}
}
I.expressions.push([/\bR(\d+)\b/ig,"getOutputValue($1 - 1)"]);
}
function getRowValues(_42,end){
if(typeof (_42)=="string"){
_42=parseInt(_42,10);
}
if(typeof (end)=="string"){
end=parseInt(end,10);
}
if(end<_42){
return [];
}
if(_42<1||end>I.cells){
return [];
}
var a=[];
var t=[];
for(row=_42;row<=end;row++){
var _46=row-1;
var _47="Row "+row;
var val;
try{
val=getOutputValue(_46);
_47=getTitleText(_46);
}
catch(e){
val=0;
_47="Row "+row;
}
if(typeof (val)!="number"){
val=parseNumber(val);
}
if(_47===""){
_47="Row "+row;
}
a.push([row,val]);
t.push([_47,val]);
}
I.datatitles=t;
I.data=a;
return a;
}
I.plotColorScheme=0;
I.colors={};
I.colors.blue=0;
I.colors.red=1;
I.colors.green=2;
I.colors.purple=3;
I.colors.teal=4;
I.colors.orange=5;
function changePlotColor(x){
var foo=document.getElementById("example2");
foo.innerHTML="";
I.plotColorScheme=x;
I.plot.update();
}
function ReplotObject(){
this.data=[];
this.type="";
this.update=function(){
replot(this.data,this.type);
};
}
I.firstChart=true;
I.hasChart=false;
I.plotter=null;
function replot(_4b,_4c){
if(I.settings.embed){
return;
}
if(I.firstChart){
showItem("chart");
I.firstChart=false;
}
I.hasChart=true;
if(_4c!="line"&&_4c!="pie"&&_4c!="bar"){
_4c="line";
}
var foo=document.getElementById("example2");
foo.innerHTML="";
try{
var i;
var _4f=[];
var _50=[];
for(i=0;i<I.datatitles.length;i++){
_4f.push({label:I.datatitles[i][0],v:i+1});
_50.push([[i+1],I.datatitles[i][1]]);
}
var _51=(_4c=="bar"||_4c=="line")?false:true;
I.plotter=new EasyPlot(_4c,{"xTicks":_4f,"padding":{top:5,bottom:15,left:70,right:10},"colorScheme":PlotKit.Base.palette(PlotKit.Base.baseColors()[I.plotColorScheme]),"backgroundColor":PlotKit.Base.baseColors()[I.plotColorScheme].lighterColorWithLevel(0.45),"xOriginIsZero":_51,"pieRadius":0.35},$("example2"),[_50]);
}
catch(e){
setStatus("Sorry, there was an error plotting...");
}
}
function findTitle(str){
if(isNull(str)){
return "";
}
var _53=str.match(/[a-zA-Z_][a-zA-Z0-9_:\.]*\s*=/);
if(isNull(_53)){
return "";
}
var _54="";
_54=_53[0].match(/[a-zA-Z_][a-zA-Z0-9_:\.]*/)[0];
re=new RegExp("_","g");
_54=_54.replace(re," ");
return _54;
}
function replacefn(_55){
replace="";
if(I.allowedfn[_55.toUpperCase()]){
replace=I.allowedfn[_55.toUpperCase()];
}else{
replace=I.safeprepend+_55;
}
return replace;
}
function replacekeyword(_56){
var _57=I.keywords[_56.toUpperCase()];
if(_57){
return _57;
}
return _56;
}
function replacecn(_58){
if(I.allowedcn[_58]){
return I.allowedcn[_58];
}
return "";
}
function validcn(_59){
if(_59===""){
return false;
}
if(I.allowedcn[_59]){
return true;
}
return false;
}
function validkeyword(_5a){
if(_5a===""){
return false;
}
if(I.keywords[_5a.toUpperCase()]){
return true;
}
return false;
}
function validExpression(_5b){
var i;
for(i=0;i<I.expressions.length;i++){
if(_5b.match(I.expressions[i][0])){
return i;
}
}
return -1;
}
function replaceExpression(_5d){
var i;
for(i=0;i<I.expressions.length;i++){
if(_5d.match(I.expressions[i][0])){
return _5d.replace(I.expressions[i][0],I.expressions[i][1]);
}
}
return _5d;
}
function replacevariable(_5f){
return I.safeprepend+_5f;
}
function cleanVariable(_60){
myregexp=new RegExp(I.safeprepend,"g");
return _60.replace(myregexp,"");
}
function tokenType(_61){
if(_61.match(/[(]/)){
return "function";
}
if(validcn(_61)){
return "constant";
}
if(validkeyword(_61)){
return "keyword";
}
if(validExpression(_61)!=-1){
return "expression";
}
return "variable";
}
function findString(_62){
var i;
for(i=0;i<_62.length;i++){
}
}
function isOperator(str){
if(str===""){
return false;
}
var c=str[0];
}
function parser(str){
var i;
for(i=0;i<str.length;i++){
}
}
function prefilter(str){
var i;
for(i=0;i<I.prefilter.length;i++){
re=I.prefilter[i][0];
var _6a=I.prefilter[i][1];
str=str.replace(re,_6a);
}
return str;
}
function postfilter(str){
var i;
for(i=0;i<I.postfilter.length;i++){
re=I.postfilter[i][0];
var _6d=I.postfilter[i][1];
str=str.replace(re,_6d);
}
return str;
}
function cleanup2(str){
str=prefilter(str);
var _6f=str.split(/\s+/);
var _70=tokenType(token);
}
function extractStrings2(str){
var i;
var _73=false;
var _74="";
var _75=[];
var _76=[];
var _77=str.match(/"([\\]"|[^"])+"/g);
if(isNull(_77)){
return [str,[]];
}
for(i=0;i<_77.length;i++){
var _78=I.stringprepend+i;
var _79=_77[i];
str=str.replace(_79,_78);
_76.push([_78,_79]);
}
return [str,_76];
}
function extractStrings(str){
var i;
var _7c=false;
var _7d="";
var _7e=[];
var _7f=[];
for(i=0;i<str.length;i++){
if(i==0&&str[i]=="\""){
_7c=true;
_7d+=str[i];
continue;
}
if(str[i]=="\""&&(str[i-1]!="\\")){
_7c=!_7c;
if(_7d!==""){
var _80=I.stringprepend+_7f.length;
str=str.replace(_7d,_80);
_7f.push([_80,_7d]);
}
_7d="";
continue;
}
if(_7c===true){
_7d+=str[i];
}
}
return [str,_7f];
}
function replaceStrings(str,_82){
var i;
for(i=0;i<_82.length;i++){
var _84=_82[i];
str=str.replace(_84[0],_84[1]);
}
return str;
}
function cleanup(str){
var i;
if(isNull(str)||!isdefined(str)||str===""){
return str;
}
var ret=extractStrings2(str);
str=ret[0];
var _88=ret[1];
str=prefilter(str);
var _89=str.match(/[a-zA-Z_][a-zA-Z0-9_:]*\s*[(]*/g);
if(isNull(_89)){
return str;
}
var _8a,_8b,_8c;
for(i=0;i<_89.length;i++){
_8a=_89[i];
_8a=_8a.match(/\S+/)[0];
_8b=tokenType(_8a);
if(_8b=="function"){
var _8d=_8a.match(/\w+/)[0];
_8c=replacefn(_8d);
re=new RegExp("([^.]|^)"+_8d+"s*[(]","g");
str=str.replace(re,"$1"+_8c+"(");
continue;
}
if(_8b=="constant"){
var _8e=_8a.match(/\w+/)[0];
re=new RegExp("\\b"+_8e+"\\b","");
str=str.replace(re,replacecn(_8e));
continue;
}
if(_8b=="keyword"){
var _8f=_8a.match(/\w+/)[0];
re=new RegExp("\\b"+_8f+"\\b","");
str=str.replace(re,replacekeyword(_8f));
continue;
}
if(_8b=="expression"){
var _90=replaceExpression(_8a);
re=new RegExp("\\b"+_8a+"\\b","");
str=str.replace(re,_90);
continue;
}
var _91=I.safeprepend+_8a.toLowerCase();
re=new RegExp("\\b"+_8a+"\\b","g");
str=str.replace(re,_91);
}
str=postfilter(str);
str=replaceStrings(str,_88);
return str;
}
function getValueArray(_92){
if(!isdefined(_92)){
return _92;
}
var i;
var _94=[];
for(i=0;i<_92.length;i++){
_94[i]=_92[i].value;
}
return _94;
}
function setValueArray(_95,_96){
var i;
for(i=0;i<_95.length;i++){
if(isdefined(_95[i])&&isdefined(_96[i])){
_96[i].value=_95[i];
}
}
}
function addCell(_98,i,_9a){
var _9b=document.getElementById("myTbody");
var _9c,_9d;
_9c=_9b.insertRow(_9b.rows.length);
_9c.className="tr0";
_9d=_9c.insertCell(_9c.cells.length);
_9d.className="col0";
_9d.innerHTML="<span class=\"number\" title=\"Click to modify row\" onContextMenu=\"return false;\" id=\"parentmenu_"+i+"\" >"+"R"+(i+1)+"</span>";
_9d.innerHTML+="<div class=\"popitmenu\" id=\"childmenu_"+i+"\">"+"<a href=\"javascript:toggleInput("+i+")\">Show/Hide This Row</a>"+"<a href=\"javascript:selectRow("+i+"); insertRow("+i+")\">Insert Row Below </a>"+"<a href=\"javascript:selectRow("+i+"); deleteRow("+i+")\">Delete Row "+(i+1)+"</a>"+"</div>";
at_attach("parentmenu_"+i,"childmenu_"+i,"click","y","pointer");
_9d=_9c.insertCell(_9c.cells.length);
_9d.className="col1";
_9d.innerHTML="<div class=\"col1\"><input id=\"input_"+i+"\" autocomplete=\"OFF\" class=\"inputArea\" onFocus= \"selectRow("+i+")\" /><div id=\"title_"+i+"\" class=\"titleArea\" onClick=\"toggleInput("+i+")\">"+"</div></div>";
_9d=_9c.insertCell(_9c.cells.length);
_9d.className="col2";
_9d.innerHTML="<div id=\"output_"+i+"\" onClick=\"toggleInput("+i+")\" title = \"Click to show/hide details\" class=\"outputArea\" >"+"</div>";
hideObject(getTitle(i));
showInput(i);
}
function selectRow(n){
var _9f=I.selected;
I.selected=n;
}
function selectFirstRow(){
I.selected=-1;
selectNextRow();
}
function selectNextRow(){
while(I.selected<I.inputs.length-1){
I.selected++;
var x=getInput(I.selected);
if(isObjectVisible(x)){
selectRow(I.selected);
try{
x.focus();
x.select();
}
catch(e){
}
return;
}
}
return;
}
function selectPrevRow(){
while(I.selected>0){
I.selected--;
var x=getInput(I.selected);
if(isObjectVisible(x)){
selectRow(I.selected);
try{
x.focus();
x.select();
}
catch(e){
}
return;
}
}
return;
}
function getSelectedRow(){
return I.selected;
}
function addMultipleCells(n){
if(I.cells+n>=I.maxCells){
setStatus("Whoa there, that's a lot of cells. Do you have an equation that wont't fit? Send me feedback about what you need!");
return;
}
var v=getVisibility();
saveCells();
var i;
for(i=0;i<n;i++){
addCell("",I.cells,I.cells);
I.cells++;
}
setCells();
recalculate();
setVisibility(v);
}
function setCells(_a5){
var i;
if(!isdefined(_a5)){
_a5=saved;
}
for(i=0;i<I.cells;i++){
I.inputs[i]=document.getElementById("input_"+i);
I.outputs[i]=document.getElementById("output_"+i);
if(isdefined(_a5[i])){
I.inputs[i].value=_a5[i];
}else{
I.inputs[i].value="";
}
}
}
function setStatus(str,_a8){
if(isdefined(status)){
status.innerHTML=str;
if(_a8===true){
status.className="statusError";
}else{
status.className="statusOK";
}
}
}
function toggleInput(i){
if(inputHidden(i)){
showInput(i);
}else{
hideInput(i);
}
}
function hideAllInputs(){
var i;
for(i=0;i<I.cells;i++){
hideInput(i);
}
}
function showAllInputs(){
var i;
for(i=0;i<I.cells;i++){
showInput(i);
}
}
function hideInput(i){
if(I.settings.embed||true){
hideObject(getInput(i));
showObject(getTitle(i));
return;
}
var foo=new Effect.Fade(getInput(i),{duration:0.1});
foo=new Effect.Appear(getTitle(i),{duration:0.2,scaleY:false});
}
function showInput(i){
if(I.settings.embed||true){
hideObject(getTitle(i));
showObject(getInput(i));
return;
}
hideObject(getTitle(i));
var foo=new Effect.Appear(getInput(i),{duration:0.2});
}
function inputHidden(i){
return getInput(i).style.display=="none";
}
function getInput(i){
if(!isdefined(I.inputs[i])||I.inputs[i]===null){
I.inputs[i]=document.getElementById("input_"+i);
}
return I.inputs[i];
}
function reloadInputs(){
var i;
for(i=0;i<I.cells;i++){
I.inputs[i]=null;
getInput(i);
}
return;
}
function getInputValue(i){
return getInput(i).value;
}
function setInputValue(str,i){
getInput(i).value=str;
}
function getComment(i){
if(!isdefined(I.comments[i])){
I.comments[i]=document.getElementById("comment_"+i);
}
return I.comments[i];
}
function setComment(i,str){
}
function getOutput(i){
if(!isdefined(I.outputs[i])){
I.outputs[i]=document.getElementById("output_"+i);
}
return I.outputs[i];
}
function getOutputValue(i){
if(i>=0&&i<I.cells){
str=I.outputCache[i];
return parseNumber(I.outputCache[i]);
}else{
return 0;
}
}
function getTitle(i){
if(!isdefined(I.titles[i])){
I.titles[i]=document.getElementById("title_"+i);
}
return I.titles[i];
}
function setTitleText(i,str){
getTitle(i).innerHTML=str;
}
function getTitleText(i){
return getTitle(i).innerHTML;
}
function textMode(){
var _bf=document.getElementById("textmode");
var _c0=document.getElementById("gridmode");
hideObject(_c0);
var foo=new Effect.Appear(_bf);
}
function gridMode(){
var _c2=document.getElementById("textmode");
var _c3=document.getElementById("gridmode");
var foo=new Effect.Appear(_c3);
hideObject(_c2);
}
KeyEvents={};
KeyEvents.specialKeyMap={13:selectNextRow,40:selectNextRow,38:selectPrevRow};
function specialKeyMap(e){
}
function keyListener(e){
if(e==null){
keycode=event.keyCode;
}else{
keycode=e.which;
}
var key=keycode;
var fn=KeyEvents.specialKeyMap[key];
if(fn){
fn();
}
recalculate();
}
function iscomment(str){
if(str.match(/[\/][\/]/)){
return true;
}else{
return false;
}
}
function extractComment(str){
var a=str.match(/([\/][\/].*)/);
var _cc;
if(!isNull(a)){
_cc=str.split(/[\/][\/]+/)[0];
if(!isNull(_cc)&&isdefined(_cc)){
}else{
_cc="";
}
var _cd=str.match("[/][/](.*)")[1];
return [_cc,_cd];
}
return [str,""];
}
function extractTitle(str){
var a=str.split(/^\[[^\]]*\]/);
return a;
}
function recalculate(){
var tmp="";
var _d1="";
var _d2=false;
var i;
I.clearLocals();
for(i=0;i<I.cells;i++){
I.inputs[i]=document.getElementById("input_"+i);
I.outputs[i]=document.getElementById("output_"+i);
I.outputCache[i]="";
I.outputs[i].innerHTML="";
tmp="";
var _d4="";
var _d5="";
var _d6="";
var _d7="";
setTitleText(i,"");
if(!isdefined(I.outputs[i])||!isdefined(I.inputs[i])){
continue;
}
if(isNull(I.inputs[i].value)||!isdefined(I.inputs[i].value)||I.inputs[i].value===""){
continue;
}
_d7=I.inputs[i].value;
var a=extractComment(_d7);
_d7=a[0];
_d5=escapeHTML(a[1].toString());
if(isdefined(_d5)){
}else{
}
_d6=findTitle(_d7);
if(!isNull(_d6)){
setTitleText(i,_d6);
}else{
setTitleText(i,"");
}
if(I.inputCache[i]!=null&&I.inputCache[i][0]==_d7){
_d7=I.inputCache[i][1];
}else{
var _d9=_d7;
_d7=cleanup(_d7);
I.inputCache[i]=[_d9,_d7];
}
if(!isNull(_d7)){
try{
tmp=eval(_d7);
}
catch(e){
if(e instanceof ReferenceError){
if(!_d2){
_d1="Waiting to define variable in row "+(i+1)+"...";
_d2=true;
}
}else{
if(!_d2){
_d1="Waiting on row "+(i+1)+"...";
_d2=true;
}
}
tmp="";
}
}else{
tmp="";
}
if(tmp=="NaN"||tmp=="undefined"){
if(!_d2){
tmp="Error -- please fix";
_d1="Sorry, a variable in row "+(i+1)+"is not defined.";
_d2=true;
}
}
if(typeof (tmp)=="function"){
tmp="";
}
if(typeof (tmp)=="number"){
if(tmp==Infinity){
tmp="Infinity";
}else{
tmp=formatNumber(tmp);
if(tmp==Infinity){
tmp="Infinity";
}
}
}
if(typeof (tmp)=="boolean"){
tmp=tmp.toString();
}
if(!tmp){
tmp="";
}
I.outputCache[i]=tmp;
_d4=cleanVariable(escapeHTML(tmp.toString()));
I.outputs[i].innerHTML=_d4;
if(!isNull(_d5)&&isdefined(_d5)){
if(_d4!=""){
I.outputs[i].innerHTML+="<span class = \"outputCommentSpacer\"></span>";
}
I.outputs[i].innerHTML+="<span class=\"outputComment\">"+_d5+"</span>";
}
}
setStatus(_d1);
}
function parseNumber(n){
if(n==Infinity){
return Infinity;
}
if(n.match(/^0x[0-9a-f]+/i)){
n=parseInt(n,16);
}
var num=new NumberFormat();
num.setInputDecimal(".");
num.setNumber(n);
num.setPlaces("-1",false);
num.setCurrencyValue("$");
num.setCurrency(false);
num.setCurrencyPosition(num.LEFT_OUTSIDE);
num.setNegativeFormat(num.LEFT_DASH);
num.setNegativeRed(false);
num.setSeparators(false,",",",");
return parseFloat(num.toFormatted());
}
function formatNumber(n){
var str=n.toString();
n=parseFloat(n.toPrecision(15));
n=n.toFixed(11);
var num=new NumberFormat();
num.setInputDecimal(".");
num.setCurrencyValue("$");
num.setCurrency(false);
num.setCurrencyPosition(num.LEFT_OUTSIDE);
num.setNegativeFormat(num.LEFT_DASH);
num.setNegativeRed(false);
num.setSeparators(true,",",",");
if(n>=1000000000){
n=parseFloat(n).toPrecision(16);
}else{
num.setPlaces("-1",false);
}
num.setPlaces("-1",false);
num.setNumber(n);
return num.toFormatted();
}
function init(){
if(I.settings.embed){
return;
}
var foo;
if(I.hasChart){
showItem("chart");
}else{
showItem("overview");
}
}
function isNull(obj){
if(obj===null){
return true;
}
if(isdefined(obj)===false){
return true;
}
if(obj===""){
return true;
}
return false;
}
function compressURL(str){
str=encodeBase64ForURL(str);
return str;
}
function decompressURL(str){
str=decodeBase64ForURL(str);
return str;
}
function shrinkspaces(str){
if(iscomment(str)){
return;
}
str=str.replace(/\s*[=]\s*/g,"=");
str=str.replace(/\s*[\+]\s*/g,"+");
str=str.replace(/\s*[\/]\s*/g,"/");
str=str.replace(/\s*[\-]\s*/g,"-");
str=str.replace(/\s*[\*]\s*/g,"*");
return str;
}
function expandspaces(str){
if(iscomment(str)){
return;
}
str=str.replace(/[=]/g," = ");
str=str.replace(/[\+]/g," + ");
str=str.replace(/[\/]/g," / ");
str=str.replace(/[\-]/g," - ");
str=str.replace(/[\*]/g," * ");
return str;
}
function createDataString(_e5){
var str="";
var tmp="";
for(i=0;i<_e5.length;i++){
tmp=_e5[i];
tmp=tmp.replace(/[|]/g,I.separator);
if(i===0){
str+=tmp;
}else{
str+="|"+tmp;
}
}
return str;
}
function encodeDescription(str){
return encodeBase64ForURL(str);
}
function decodeDescription(str){
return decodeBase64ForURL(str);
}
function createURL(){
saveCells();
var str="";
var tmp="";
var i;
str=createDataString(saved);
str=compressURL(str);
var _ed=encodeDescription(getDescription());
var _ee="";
for(i=0;i<I.cells;i++){
if(inputHidden(i)){
_ee+="h";
}else{
_ee+="s";
}
}
var url=getURLNoParams();
var _f0=url+"mini/";
var _f1="?d="+_ed+"&c="+str+"&s="+_ee+"&v="+I.version;
I.permalink=url+_f1;
I.minipermalink="http://instacalc.com/"+_f1;
I.minipermalinkdemo=_f0+_f1;
I.embedlink=url+"/embed.html"+_f1;
if(I.permalink.length>2000){
urlbox.value="Sorry, that URL is too large! Try splitting your calculation into 2 pages...";
}
var h=80+(24*I.cells);
I.miniembed="<iframe src=\""+I.minipermalinkdemo+"\" width=\"425\" height=\""+h+"\" frameborder=\"0\" scrolling=\"auto\" valign=\"top\"> </iframe>";
}
function hasURLParams(){
str=getURLParam("c");
if(isNull(str)){
return false;
}else{
return true;
}
}
function loadURLParams(){
str=getURLParam("c");
str=decompressURL(str);
if(isNull(str)){
return;
}
loadCellsFromString(str);
str=unescape(getURLParam("s"));
I.showHide=str;
if(isObjectVisible(getInput(0))&&(!InstaCalc.settings.embed)){
document.getElementById("input_0").focus();
}
showHideCells(str);
str=getURLParam("d");
if(str!==""){
I.description=decodeDescription(str);
setDescription(I.description);
}
recalculate();
}
function showHideCells(_f3){
if(isNull(_f3)){
return;
}
var i;
for(i=0;i<I.cells;i++){
if(_f3.charAt(i)=="h"){
hideInput(i);
}else{
showInput(i);
}
}
return _f3;
}
function insertRowIntoString(row){
saveCells();
}
function loadCellsFromString2(str){
var _f7=str.split("|");
eraseRows();
addMultipleCells(_f7.length);
setCells(_f7);
saveCells();
}
function loadCellsFromString(str){
var _f9=str.split("|");
var i=0;
for(i=0;i<_f9.length;i++){
var re=new RegExp(I.separator,"g");
_f9[i]=_f9[i].replace(re,"|");
}
while(_f9.length>I.cells&&I.cells<I.maxCells){
addCell("",I.cells,"");
I.cells+=1;
}
setCells(_f9);
saveCells();
}
function saveCells(){
saved=getValueArray(I.inputs);
}
function loadCells(){
setValueArray(saved,I.inputs);
}
function hideAll(_fc){
var i;
for(i=0;i<_fc.length;i++){
hideItem(_fc[i]);
}
return;
}
function toggleAndHide(_fe,_ff){
for(i=0;i<_ff.length;i++){
if(_fe==_ff[i]){
toggleItem(_ff[i]);
}else{
hideItem(_ff[i]);
}
}
}
function loadInput(_100){
var i;
if(_100.length>I.cells){
addMultipleCells(_100.length-I.cells);
}
for(i=0;i<_100.length&&i<I.cells;i++){
var _102=getInput(i);
_102.value=_100[i];
}
}
function loadOutput(){
var foo=document.getElementById("textoutput");
foo.innerHTML="";
for(i=0;i<I.outputs.length;i++){
foo.innerHTML+="<div class=\"textitem\">"+I.outputs[i].innerHTML+"</div>";
}
}
function getOutputs(){
var i;
var a=[];
for(i=0;i<I.outputCache.length;i++){
a.push(I.outputCache[i]);
}
return a;
}
function createPage(_106){
var _107=document.getElementById("variablearea");
I.status=document.getElementById("status");
var _108={};
document.getElementById("myTable").onkeyup=keyListener;
hideAll(I.divs);
if(hasURLParams()){
loadURLParams();
}else{
for(i=0;i<I.startcells;i++){
addCell("",i,"");
I.cells++;
}
if(_106!=null){
loadInput(_106);
}
}
recalculate();
setStatus("Ready to go! Just start typing...");
}
I.timer=null;
I.delay=300;
function startTimer(){
I.timer=self.setTimeout("startTimer()",I.delay);
setStatus(Math.random().toString());
}
function exportHTML(){
var str="";
str+="<div><table>";
str+="<tr><td colspan=\"2\">"+"InstaCalc"+"</td></tr>";
var i;
for(i=0;i<I.inputs.length;i++){
str+="<tr>";
str+="<td style=\"font:11px verdana, arial\">"+getInputValue(i)+"</td>";
str+="<td style=\"font:11px verdana, arial\">"+getOutputValue(i)+"</td>";
str+="</tr>";
}
str+="</table></div>";
return str;
}
function inputReplace(find,_10c){
var i;
for(i=0;i<I.inputs.length;i++){
var str=getInputValue(i);
if(str.match(find)){
var _10f=str.replace(find,_10c);
setInputValue(_10f,i);
}
}
recalculate();
}
function setBarChart(){
inputReplace(/^\s*\w+chart/,"barchart");
}
function setLineChart(){
inputReplace(/^\s*\w+chart/,"linechart");
}
function setPieChart(){
inputReplace(/^\s*\w+chart/,"piechart");
}

