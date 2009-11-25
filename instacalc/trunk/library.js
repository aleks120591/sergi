function logger(_1) {
   var _2 = document.getElementById("log");
   if(_2) {
      _2.innerHTML += _1;
      }
   }
function InstaCalcLoaded() {
   return typeof (I) == "object";
   }
function updateLocalPermalink() {
   if(!InstaCalcLoaded()) {
      return;
      }
   createURL();
   $("inputpermalink").value = I.permalink;
   }
function createEmbedWindow() {
   if(!InstaCalcLoaded()) {
      return;
      }
   window.open(createEmbedURL(), "", "width=750,height=700");
   }
function createDeliciousWindow() {
   if(!InstaCalcLoaded()) {
      return;
      }
   window.open(createDeliciousLink(), "", "width=750,height=350");
   }
delay_id = 1000;
function delayLoadImage(_3, _4) {
   var id = "delay_" + delay_id.toString();
   delay_id++;
   var _6 = "<img id=\"" + id + "\"></img>";
   document.write(_6);
   var _7 = "setImage('" + id + "','" + _3 + "')";
   if(!_4 || _4 < 0) {
      _4 = 2;
      }
   setTimeout(_7, _4 * 1000);
   }
function setImage(id, _9) {
   var _a = document.getElementById(id);
   if(_a) {
      _a.src = _9;
      }
   }
function append(_b) {
   var i = getSelectedRow();
   var _d = getInput(i);
   _d.value += _b;
   recalculate();
   selectRow(i);
   getInput(i).focus();
   }
function prepend(_e) {
   var i = getSelectedRow();
   var _10 = getInput(i);
   _10.value = _e + _10.value;
   recalculate();
   selectRow(i);
   }
function setCommandDropDown() {
   var _11 = ["second (sec)", "minute (min)", "hour (hr)", "day", "week", "month", "year", "decade", "century", "-------", "millisecond (ms)", "microsecond (us)", "nanosecond (ns)"];
   var _12 = ["kilometer (km)", "meter (m)", "centimeter (cm)", "millimeter (mm)", "micrometer (um)", "nanometer (nm)", "-------", "inch (in)", "foot (ft)", "yard (yd)", "mile", "knot", "rod", "league"];
   var _13 = ["km^2 (sq km)", "m^2", "cm^2", "mm^2", "-------", "in^2", "ft^2", "yd^2", "acre", "mile^2"];
   var _14 = ["liter (L)", "milliliter (mL)", "cm^3 (cubic cm)", "-------", "teaspoon (tsp)", "tablespoon (tbsp)", "fluid ounce (fl oz)", "cup", "pint (pt)", "quart (qt)", "gallon (gal)"];
   var _15 = ["kilogram (kg)", "gram (g)", "milligram (mg)", "microgram (ug)", "--------", "pound (lb)", "ounce (oz)", "ton"];
   var _16 = ["bit", "byte", "kilobit", "kilobyte (kb)", "megabyte (mb)", "gigabyte (gb)", "terabyte (tb)", "petabyte (pb)", "exabyte (eb)"];
   var _17 = [];
   _17.push( {
      text : "+", tooltip : "Addition: 2 + 2 = 4", command : "append('+')"}
   );
   _17.push( {
      text : "-", tooltip : "Subtraction: 5 - 2 = 3", command : "append('-')"}
   );
   _17.push( {
      text : "*", tooltip : "Multiplication: 3 * 3 = 9", command : "append('*')"}
   );
   _17.push( {
      text : "/", tooltip : "Division: 8 / 4 = 2", command : "append('/')"}
   );
   _17.push( {
      text : ""}
   );
   _17.push( {
      text : "sqrt", tooltip : "Square root: sqrt(9) = 3", command : "append('sqrt(')"}
   );
   _17.push( {
      text : "x^y", tooltip : "Exponent: 3^2 = 9", command : "append('^')"}
   );
   _17.push( {
      text : ""}
   );
   _17.push( {
      text : "$", tooltip : "Format as currency: $5/3 = 1.67", command : "append('$')"}
   );
   _17.push( {
      text : "%", tooltip : "Use percentage: 100 + 20% = 120", command : "append('%')"}
   );
   _17.push( {
      text : ""}
   );
   _17.push( {
      text : "k", tooltip : "Use thousand: 1.5k or 1.5 thousand = 1,500", command : "append('k')"}
   );
   _17.push( {
      text : "m", tooltip : "Use million: 2.2m or 2.2 million = 2,200,000", command : "append('m')"}
   );
   _17.push( {
      text : "b", tooltip : "Use billion: 3.3b or 3.3 billion = 3,300,000,000", command : "append('b')"}
   );
   var _18 = [];
   _18.push( {
      text : "R1", tooltip : "Use a row: R1 + 5", command : "append('R1')"}
   );
   _18.push( {
      text : "x = ...", tooltip : "Set a variable: x = 3", command : "append('x = 3')"}
   );
   _18.push( {
      text : "sum(R1:R3)", tooltip : "Add up rows 1 to 3", command : "append('sum(r1:r3)')"}
   );
   _18.push( {
      text : "average(R1:R3)", tooltip : "Average rows 1 to 3", command : "append('average(r1:r3)')"}
   );
   var _19 = [];
   _19.push( {
      text : "piechart(R1:R3)", tooltip : "Create pie chart for certain rows: piechart(r1:r3)", command : "append('piechart(r1:r3)')"}
   );
   _19.push( {
      text : "barchart()", tooltip : "Create bar chart for certain rows: piechart(r1:r3)", command : "append('barchart(r1:r3)')"}
   );
   _19.push( {
      text : "linechart()", tooltip : "Create line chart for certain rows: piechart(r1:r3)", command : "append('linechart(r1:r3)')"}
   );
   var _1a = [];
   _1a.push( {
      text : "sin", tooltip : "Use sin, cos or tan: sin(30)", command : "append('sin(')"}
   );
   _1a.push( {
      text : "asin", tooltip : "Use arcsin, arccos or arctan: asin(.3)", command : "append('asin(')"}
   );
   _1a.push( {
      text : "sinh", tooltip : "Use hyperbolic sin: sinh(30)", command : "append('sinh(')"}
   );
   _1a.push( {
      text : ""}
   );
   _1a.push( {
      text : "PI", tooltip : "Use Pi (3.1415...): PI * 2", command : "append(' PI')"}
   );
   _1a.push( {
      text : "deg (default)", tooltip : "Use degrees (already the default): sin(30 deg)", command : "append(' deg')"}
   );
   _1a.push( {
      text : "rad", tooltip : "Use radians: sin(30 rad)", command : "append(' rad')"}
   );
   var _1b = [];
   _1b.push( {
      text : "E", tooltip : "Euler's Number (2.71828): E", command : "append(' E')"}
   );
   _1b.push( {
      text : "exp", tooltip : "E to the power x: exp(x)", command : "append('exp(')"}
   );
   _1b.push( {
      text : "ln", tooltip : "Natural Log: ln(2)", command : "append('ln(')"}
   );
   _1b.push( {
      text : "log", tooltip : "Log base 10: log(2)", command : "append('log(')"}
   );
   _1b.push( {
      text : "1e10", tooltip : "Exponent notation: 1e10 is 10,000,000,000", command : "append('1e10')"}
   );
   var _1c = [];
   _1c.push( {
      text : "round", tooltip : "Round to the nearest whole number: round(3.4) = 3", command : "append(' round(')"}
   );
   _1c.push( {
      text : "random", tooltip : "Random number from 0 - 1: random = .343", command : "append(' random')"}
   );
   _1c.push( {
      text : "random(6)", tooltip : "Random number from 1-6: random(6) = 3", command : "append(' random(6)')"}
   );
   _1c.push( {
      text : "!", tooltip : "Factorial: 3! = 3 * 2 * 1 = 6", command : "append('!')"}
   );
   _1c.push( {
      text : "abs", tooltip : "Absolute value: abs(-3) = 3", command : "append('abs(')"}
   );
   var _1d = [];
   _1d.push( {
      text : "bin", tooltip : "Convert to binary: bin(3) = 0b00000011", command : "append(' bin(')"}
   );
   _1d.push( {
      text : "oct", tooltip : "Convert to octal: oct(13) = 0o15", command : "append(' oct(')"}
   );
   _1d.push( {
      text : "hex", tooltip : "Convert to hex: hex(13) = 0x000d", command : "append(' hex(')"}
   );
   _1d.push( {
      text : ""}
   );
   _1d.push( {
      text : "0b", tooltip : "Write binary number: 0b101 = 5", command : "append(' 0b')"}
   );
   _1d.push( {
      text : "0o", tooltip : "Write octal number: 0o20 = 16", command : "append(' 0o')"}
   );
   _1d.push( {
      text : "0x", tooltip : "Write hex number: 0xff = 255", command : "append(' 0x')"}
   );
   var _1e = [];
   _1e.push( {
      text : "<", tooltip : "Less than: 3 < 4 is true (Also: less than or equals, <=)", command : "append('<')"}
   );
   _1e.push( {
      text : ">", tooltip : "Greater than: 10 > 5 is true (Also: greater than or equals, >=)", command : "append('>')"}
   );
   _1e.push( {
      text : "==", tooltip : "Equal to: 3 == 3 is true", command : "append('==')"}
   );
   _1e.push( {
      text : "!=", tooltip : "Not equal to: 3 != 4 is true", command : "append('!=')"}
   );
   _1e.push( {
      text : ""}
   );
   _1e.push( {
      text : "if...", tooltip : "If statement: if (3 > 2){'bigger'}", command : "append('if( 3 > 2 ){\\'bigger\\'}')"}
   );
   _1e.push( {
      text : "if...else", tooltip : "If-else statement: if (3 > 2) {'bigger'} else {'smaller or equal'}", command : "append('if(3 > 2){\\'bigger\\'} else {\\'smaller or equal\\'} ')"}
   );
   var _1f = [];
   _1f.push( {
      text : "and", tooltip : "Bitwise AND: 3 and 5 = 1", command : "append(' and')"}
   );
   _1f.push( {
      text : "or", tooltip : "Bitwise OR: 3 or 5 = 7", command : "append(' or')"}
   );
   _1f.push( {
      text : "xor", tooltip : "Bitwise XOR: 3 xor 5 = 6", command : "append(' xor')"}
   );
   _1f.push( {
      text : "not", tooltip : "Bitwise NOT: 3 = -4 (two's complement)", command : "append(' not')"}
   );
   _1f.push( {
      text : "<<", tooltip : "Left shift: 2 << 1 = 4", command : "append('<<')"}
   );
   _1f.push( {
      text : ">>", tooltip : "Right shift: 8 >> 1 = 4", command : "append('>>')"}
   );
   var _20 = [];
   _20.push( {
      text : "2 days in hours", tooltip : "Convert units of time: 2 days in hours = 48 hours", command : "append(' 2 days in hours')"}
   );
   _20.push( {
      text : "DROPDOWN", tooltip : " Units: ", command : _11}
   );
   var _21 = [];
   _21.push( {
      text : "2 kg in lbs", tooltip : "Convert units of weight: 2 kg in lbs = 4.409 lbs", command : "append(' 2 kg in lbs')"}
   );
   _21.push( {
      text : "DROPDOWN", tooltip : " Units: ", command : _15}
   );
   var _22 = [];
   _22.push( {
      text : "2 feet in cm", tooltip : "Convert units of length: 2 feet in cm = 60.96 cm", command : "append(' 2 feet in cm')"}
   );
   _22.push( {
      text : "DROPDOWN", tooltip : " Units: ", command : _12}
   );
   var _23 = [];
   _23.push( {
      text : "100 feet^2 in m^2", tooltip : "Convert area for any length unit: 100 feet^2 in m^2 = 9.29 m^2 (can use 'square feet' or 'sq feet')", command : "append(' 100 feet^2 in m^2')"}
   );
   _23.push( {
      text : "DROPDOWN", tooltip : " Units: ", command : _13}
   );
   var _24 = [];
   _24.push( {
      text : "1 gallon in liters", tooltip : "Convert volume for any length unit: 1 gallon in liters = 3.78 liters (can use 'cm^3' or 'cubic cm')", command : "append(' 1 gallon in liters')"}
   );
   _24.push( {
      text : "DROPDOWN", tooltip : " Units: ", command : _14}
   );
   var _25 = [];
   _25.push( {
      text : "200 mb in gb", tooltip : "Convert data size: 200 mb in gb = .195 gb", command : "append(' 200 mb in gb')"}
   );
   _25.push( {
      text : "DROPDOWN", tooltip : " Units: ", command : _16}
   );
   all_commands = {
      };
   all_commands["commands_basic"] = _17;
   all_commands["commands_advanced"] = _18;
   all_commands["commands_chart"] = _19;
   all_commands["commands_trig"] = _1a;
   all_commands["commands_logs"] = _1b;
   all_commands["commands_numbers"] = _1c;
   all_commands["commands_binary"] = _1d;
   all_commands["commands_logical"] = _1e;
   all_commands["commands_binops"] = _1f;
   all_commands["commands_convert_time"] = _20;
   all_commands["commands_convert_weight"] = _21;
   all_commands["commands_convert_length"] = _22;
   all_commands["commands_convert_area"] = _23;
   all_commands["commands_convert_volume"] = _24;
   all_commands["commands_convert_computer"] = _25;
   }
setCommandDropDown();
function displayCommands(_26) {
   var str = "";
   for(var i = 0; i < _26.length; i++) {
      var _29 = _26[i];
      if(_29.text == "") {
         str += "<span class=\"divider\">|</span>";
         }
      else {
         if(_29.text == "HELP") {
            str += "<a href=\"" + _29.command + "\" title=\"" + _29.tooltip + "\"><img src=\"images/information.png\" class=\"command-help\"></img></a>";
            }
         else {
            if(_29.text == "DROPDOWN") {
               str += _29.tooltip;
               str += createDropDown(_29.command);
               }
            else {
               str += "<a href=\"javascript:" + _29.command + "\" title=\"" + _29.tooltip + "\" class=\"command-item\">";
               str += _29.text;
               str += "</a>";
               }
            }
         }
      }
   return str;
   }
function go() {
   var d = $("command-dropdown");
   var _2b = d.options[d.selectedIndex].value;
   if(_2b != "") {
      selectCommand(_2b);
      }
   }
function selectCommand(_2c) {
   $("command-list").innerHTML = displayCommands(all_commands[_2c]);
   }
function createDropDown(_2d) {
   str = "";
   str += "<select>";
   for(var i = 0; i < _2d.length; i++) {
      str += "<option value=\"" + _2d[i] + "\">" + _2d[i] + "</option>";
      }
   str += "</select>";
   return str;
   }
var BrowserDetect = {
   init : function() {
      this.browser = this.searchString(this.dataBrowser) || "An unknown browser";
      this.version = this.searchVersion(navigator.userAgent) || this.searchVersion(navigator.appVersion) || "an unknown version";
      this.OS = this.searchString(this.dataOS) || "an unknown OS";
      }
   , searchString : function(_2f) {
      for(var i = 0; i < _2f.length; i++) {
         var _31 = _2f[i].string;
         var _32 = _2f[i].prop;
         this.versionSearchString = _2f[i].versionSearch || _2f[i].identity;
         if(_31) {
            if(_31.indexOf(_2f[i].subString) !=- 1) {
               return _2f[i].identity;
               }
            }
         else {
            if(_32) {
               return _2f[i].identity;
               }
            }
         }
      }
   , searchVersion : function(_33) {
      var _34 = _33.indexOf(this.versionSearchString);
      if(_34 ==- 1) {
         return;
         }
      return parseFloat(_33.substring(_34 + this.versionSearchString.length + 1));
      }
   , dataBrowser : [ {
      string : navigator.userAgent, subString : "OmniWeb", versionSearch : "OmniWeb/", identity : "OmniWeb"}
   , {
      string : navigator.vendor, subString : "Apple", identity : "Safari"}
   , {
      prop : window.opera, identity : "Opera"}
   , {
      string : navigator.vendor, subString : "iCab", identity : "iCab"}
   , {
      string : navigator.vendor, subString : "KDE", identity : "Konqueror"}
   , {
      string : navigator.userAgent, subString : "Firefox", identity : "Firefox"}
   , {
      string : navigator.vendor, subString : "Camino", identity : "Camino"}
   , {
      string : navigator.userAgent, subString : "Netscape", identity : "Netscape"}
   , {
      string : navigator.userAgent, subString : "MSIE", identity : "Explorer", versionSearch : "MSIE"}
   , {
      string : navigator.userAgent, subString : "Gecko", identity : "Mozilla", versionSearch : "rv"}
   , {
      string : navigator.userAgent, subString : "Mozilla", identity : "Netscape", versionSearch : "Mozilla"}
   ], dataOS : [ {
      string : navigator.platform, subString : "Win", identity : "Windows"}
   , {
      string : navigator.platform, subString : "Mac", identity : "Mac"}
   , {
      string : navigator.platform, subString : "Linux", identity : "Linux"}
   ]};
BrowserDetect.init();
function $import(src) {
   var _36 = document.createElement("script");
   _36.setAttribute("src", src);
   _36.setAttribute("type", "text/javascript");
   document.getElementsByTagName("head")[0].appendChild(_36);
   }
function $importNoCache(src) {
   var ms = new Date().getTime().toString();
   var _39 = "?" + ms;
   $import(src + _39);
   }
function $importGzip(src) {
   var _3b = src + ".gz";
   if(BrowserDetect.browser == "Explorer" && BrowserDetect.version < 7) {
      $import(src);
      }
   else {
      $import(_3b);
      }
   }