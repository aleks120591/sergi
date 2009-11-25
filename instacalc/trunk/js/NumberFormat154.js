function NumberFormat(_1,_2){
this.VERSION="Number Format v1.5.4";
this.COMMA=",";
this.PERIOD=".";
this.DASH="-";
this.LEFT_PAREN="(";
this.RIGHT_PAREN=")";
this.LEFT_OUTSIDE=0;
this.LEFT_INSIDE=1;
this.RIGHT_INSIDE=2;
this.RIGHT_OUTSIDE=3;
this.LEFT_DASH=0;
this.RIGHT_DASH=1;
this.PARENTHESIS=2;
this.NO_ROUNDING=-1;
this.num;
this.numOriginal;
this.hasSeparators=false;
this.separatorValue;
this.inputDecimalValue;
this.decimalValue;
this.negativeFormat;
this.negativeRed;
this.hasCurrency;
this.currencyPosition;
this.currencyValue;
this.places;
this.roundToPlaces;
this.truncate;
this.setNumber=setNumberNF;
this.toUnformatted=toUnformattedNF;
this.setInputDecimal=setInputDecimalNF;
this.setSeparators=setSeparatorsNF;
this.setCommas=setCommasNF;
this.setNegativeFormat=setNegativeFormatNF;
this.setNegativeRed=setNegativeRedNF;
this.setCurrency=setCurrencyNF;
this.setCurrencyPrefix=setCurrencyPrefixNF;
this.setCurrencyValue=setCurrencyValueNF;
this.setCurrencyPosition=setCurrencyPositionNF;
this.setPlaces=setPlacesNF;
this.toFormatted=toFormattedNF;
this.toPercentage=toPercentageNF;
this.getOriginal=getOriginalNF;
this.moveDecimalRight=moveDecimalRightNF;
this.moveDecimalLeft=moveDecimalLeftNF;
this.getRounded=getRoundedNF;
this.preserveZeros=preserveZerosNF;
this.justNumber=justNumberNF;
this.expandExponential=expandExponentialNF;
this.getZeros=getZerosNF;
this.moveDecimalAsString=moveDecimalAsStringNF;
this.moveDecimal=moveDecimalNF;
this.addSeparators=addSeparatorsNF;
if(_2==null){
this.setNumber(_1,this.PERIOD);
}else{
this.setNumber(_1,_2);
}
this.setCommas(true);
this.setNegativeFormat(this.LEFT_DASH);
this.setNegativeRed(false);
this.setCurrency(false);
this.setCurrencyPrefix("$");
this.setPlaces(2);
}
function setInputDecimalNF(_3){
this.inputDecimalValue=_3;
}
function setNumberNF(_4,_5){
if(_5!=null){
this.setInputDecimal(_5);
}
this.numOriginal=_4;
this.num=this.justNumber(_4);
}
function toUnformattedNF(){
return (this.num);
}
function getOriginalNF(){
return (this.numOriginal);
}
function setNegativeFormatNF(_6){
this.negativeFormat=_6;
}
function setNegativeRedNF(_7){
this.negativeRed=_7;
}
function setSeparatorsNF(_8,_9,_a){
this.hasSeparators=_8;
if(_9==null){
_9=this.COMMA;
}
if(_a==null){
_a=this.PERIOD;
}
if(_9==_a){
this.decimalValue=(_a==this.PERIOD)?this.COMMA:this.PERIOD;
}else{
this.decimalValue=_a;
}
this.separatorValue=_9;
}
function setCommasNF(_b){
this.setSeparators(_b,this.COMMA,this.PERIOD);
}
function setCurrencyNF(_c){
this.hasCurrency=_c;
}
function setCurrencyValueNF(_d){
this.currencyValue=_d;
}
function setCurrencyPrefixNF(cp){
this.setCurrencyValue(cp);
this.setCurrencyPosition(this.LEFT_OUTSIDE);
}
function setCurrencyPositionNF(cp){
this.currencyPosition=cp;
}
function setPlacesNF(p,tr){
this.roundToPlaces=!(p==this.NO_ROUNDING);
this.truncate=(tr!=null&&tr);
this.places=(p<0)?0:p;
}
function addSeparatorsNF(_12,inD,_14,sep){
_12+="";
var _16=_12.indexOf(inD);
var _17="";
if(_16!=-1){
_17=_14+_12.substring(_16+1,_12.length);
_12=_12.substring(0,_16);
}
var rgx=/(\d+)(\d{3})/;
while(rgx.test(_12)){
_12=_12.replace(rgx,"$1"+sep+"$2");
}
return _12+_17;
}
function toFormattedNF(){
var pos;
var _1a=this.num;
var _1b;
var _1c=new Array(2);
if(this.roundToPlaces){
_1a=this.getRounded(_1a);
_1b=this.preserveZeros(Math.abs(_1a));
}else{
_1b=this.expandExponential(Math.abs(_1a));
}
if(this.hasSeparators){
_1b=this.addSeparators(_1b,this.PERIOD,this.decimalValue,this.separatorValue);
}else{
_1b=_1b.replace(new RegExp("\\"+this.PERIOD),this.decimalValue);
}
var c0="";
var n0="";
var c1="";
var n1="";
var n2="";
var c2="";
var n3="";
var c3="";
var _25=(this.negativeFormat==this.PARENTHESIS)?this.LEFT_PAREN:this.DASH;
var _26=(this.negativeFormat==this.PARENTHESIS)?this.RIGHT_PAREN:this.DASH;
if(this.currencyPosition==this.LEFT_OUTSIDE){
if(_1a<0){
if(this.negativeFormat==this.LEFT_DASH||this.negativeFormat==this.PARENTHESIS){
n1=_25;
}
if(this.negativeFormat==this.RIGHT_DASH||this.negativeFormat==this.PARENTHESIS){
n2=_26;
}
}
if(this.hasCurrency){
c0=this.currencyValue;
}
}else{
if(this.currencyPosition==this.LEFT_INSIDE){
if(_1a<0){
if(this.negativeFormat==this.LEFT_DASH||this.negativeFormat==this.PARENTHESIS){
n0=_25;
}
if(this.negativeFormat==this.RIGHT_DASH||this.negativeFormat==this.PARENTHESIS){
n3=_26;
}
}
if(this.hasCurrency){
c1=this.currencyValue;
}
}else{
if(this.currencyPosition==this.RIGHT_INSIDE){
if(_1a<0){
if(this.negativeFormat==this.LEFT_DASH||this.negativeFormat==this.PARENTHESIS){
n0=_25;
}
if(this.negativeFormat==this.RIGHT_DASH||this.negativeFormat==this.PARENTHESIS){
n3=_26;
}
}
if(this.hasCurrency){
c2=this.currencyValue;
}
}else{
if(this.currencyPosition==this.RIGHT_OUTSIDE){
if(_1a<0){
if(this.negativeFormat==this.LEFT_DASH||this.negativeFormat==this.PARENTHESIS){
n1=_25;
}
if(this.negativeFormat==this.RIGHT_DASH||this.negativeFormat==this.PARENTHESIS){
n2=_26;
}
}
if(this.hasCurrency){
c3=this.currencyValue;
}
}
}
}
}
_1b=c0+n0+c1+n1+_1b+n2+c2+n3+c3;
if(this.negativeRed&&_1a<0){
_1b="<font color=\"red\">"+_1b+"</font>";
}
return (_1b);
}
function toPercentageNF(){
nNum=this.num*100;
nNum=this.getRounded(nNum);
return nNum+"%";
}
function getZerosNF(_27){
var _28="";
var i;
for(i=0;i<_27;i++){
_28+="0";
}
return _28;
}
function expandExponentialNF(_2a){
if(isNaN(_2a)){
return _2a;
}
var _2b=parseFloat(_2a)+"";
var _2c=_2b.toLowerCase().indexOf("e");
if(_2c!=-1){
var _2d=_2b.toLowerCase().indexOf("+");
var _2e=_2b.toLowerCase().indexOf("-",_2c);
var _2f=_2b.substring(0,_2c);
if(_2e!=-1){
var _30=_2b.substring(_2e+1,_2b.length);
_2f=this.moveDecimalAsString(_2f,true,parseInt(_30));
}else{
if(_2d==-1){
_2d=_2c;
}
var _30=_2b.substring(_2d+1,_2b.length);
_2f=this.moveDecimalAsString(_2f,false,parseInt(_30));
}
_2b=_2f;
}
return _2b;
}
function moveDecimalRightNF(val,_32){
var _33="";
if(_32==null){
_33=this.moveDecimal(val,false);
}else{
_33=this.moveDecimal(val,false,_32);
}
return _33;
}
function moveDecimalLeftNF(val,_35){
var _36="";
if(_35==null){
_36=this.moveDecimal(val,true);
}else{
_36=this.moveDecimal(val,true,_35);
}
return _36;
}
function moveDecimalAsStringNF(val,_38,_39){
var _3a=(arguments.length<3)?this.places:_39;
if(_3a<=0){
return val;
}
var _3b=val+"";
var _3c=this.getZeros(_3a);
var re1=new RegExp("([0-9.]+)");
if(_38){
_3b=_3b.replace(re1,_3c+"$1");
var re2=new RegExp("(-?)([0-9]*)([0-9]{"+_3a+"})(\\.?)");
_3b=_3b.replace(re2,"$1$2.$3");
}else{
var _3f=re1.exec(_3b);
if(_3f!=null){
_3b=_3b.substring(0,_3f.index)+_3f[1]+_3c+_3b.substring(_3f.index+_3f[0].length);
}
var re2=new RegExp("(-?)([0-9]*)(\\.?)([0-9]{"+_3a+"})");
_3b=_3b.replace(re2,"$1$2$4.");
}
_3b=_3b.replace(/\.$/,"");
return _3b;
}
function moveDecimalNF(val,_41,_42){
var _43="";
if(_42==null){
_43=this.moveDecimalAsString(val,_41);
}else{
_43=this.moveDecimalAsString(val,_41,_42);
}
return parseFloat(_43);
}
function getRoundedNF(val){
val=this.moveDecimalRight(val);
if(this.truncate){
val=val>=0?Math.floor(val):Math.ceil(val);
}else{
val=Math.round(val);
}
val=this.moveDecimalLeft(val);
return val;
}
function preserveZerosNF(val){
var i;
val=this.expandExponential(val);
if(this.places<=0){
return val;
}
var _47=val.indexOf(".");
if(_47==-1){
val+=".";
for(i=0;i<this.places;i++){
val+="0";
}
}else{
var _48=(val.length-1)-_47;
var _49=this.places-_48;
for(i=0;i<_49;i++){
val+="0";
}
}
return val;
}
function justNumberNF(val){
newVal=val+"";
var _4b=false;
if(newVal.indexOf("%")!=-1){
newVal=newVal.replace(/\%/g,"");
_4b=true;
}
var re=new RegExp("[^\\"+this.inputDecimalValue+"\\d\\-\\+\\(\\)eE]","g");
newVal=newVal.replace(re,"");
var _4d=new RegExp("["+this.inputDecimalValue+"]","g");
var _4e=_4d.exec(newVal);
if(_4e!=null){
var _4f=newVal.substring(_4e.index+_4e[0].length);
newVal=newVal.substring(0,_4e.index)+this.PERIOD+_4f.replace(_4d,"");
}
if(newVal.charAt(newVal.length-1)==this.DASH){
newVal=newVal.substring(0,newVal.length-1);
newVal="-"+newVal;
}else{
if(newVal.charAt(0)==this.LEFT_PAREN&&newVal.charAt(newVal.length-1)==this.RIGHT_PAREN){
newVal=newVal.substring(1,newVal.length-1);
newVal="-"+newVal;
}
}
newVal=parseFloat(newVal);
if(!isFinite(newVal)){
newVal=0;
}
if(_4b){
newVal=this.moveDecimalLeft(newVal,2);
}
return newVal;
}

