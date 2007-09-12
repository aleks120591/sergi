var SmsSender = {};
SmsSender.currentChannel = null;

SmsSender.onLoad = function() {
	var wm=Components.classes["@mozilla.org/appshell/window-mediator;1"]
	           .getService(Components.interfaces.nsIWindowMediator);

	var mainWindow = wm.getMostRecentWindow("navigator:browser");
	
	SmsSender.gBrowser = mainWindow.getBrowser();
	var sideBarBox=mainWindow.document.getElementById("sidebar-box");
	if (sideBarBox.width<275) sideBarBox.width=275;

	SmsSender.addressBook = document.getElementById("addressBook");
	SmsSender.prefs = Components.classes["@mozilla.org/preferences-service;1"].
	                getService(Components.interfaces.nsIPrefBranch);
	SmsSender.initAddressBook();
	var sel = SmsSender.getChannelSelector();
	for(var i=0;i<SmsSender.channels.length;i++){
		var menuItem = document.createElement("menuitem");
		menuItem.setAttribute("label",SmsSender.channels[i].text);
		menuItem.setAttribute("oncommand", "SmsSender.channelChanged()");
		sel.menupopup.appendChild(menuItem);
	}
	sel.selectedIndex = 0;
	SmsSender.setChannel(SmsSender.channels[sel.selectedIndex]);
	var senderName="";
	try
	{
		senderName=SmsSender.prefs.getCharPref("smssender.sendername");
	}catch(e){}
	SmsSender.getSenderName().value=senderName;
	SmsSender.messageCannged();
};
 
SmsSender.carriers = new Array();
SmsSender.carriers[0] = {
	name: "umc",
	captchaProcessor : {
		getUrl : "http://mts.com.ua/ukr/sendsms.php",
		internalCodeExtractor: function(html){
			var re = new RegExp("INPUT TYPE=\"hidden\" name=\"PHPSESSID\" value=\"([^\"]+)\"");
			SmsSender.captchaInternalCode = html.match(re)[1];
			SmsSender.getcaptchaCodeInput().value = "";
		},
		imageSourceBuilder: function(){
			return "http://mts.com.ua/back/modules/sms/sms_picture2.php?PHPSESSID="+SmsSender.captchaInternalCode;
		}
	},
	sendProcessor: 
	{
		type: "PostForm",
		postFormUrl: "http://mts.com.ua/back/modules/sms/db_sms.php",
		formItems: new Array(
			{name: "PHPSESSID",
			getter: function() {return SmsSender.captchaInternalCode;}
			},
			{name: "script",
			getter: "/ukr/sendsms.php"
			},
			{name: "sms_tag_id",
			getter: "3"
			},
			{name: "network1",
			getter: function() {return SmsSender.currentChannel.value;}
      },
      {name: "phone1",
      getter: function() {return SmsSender.phoneNumber;}
      },
      {name: "message",
      getter: function() {return SmsSender.message;}
      },
      {name: "anti",
      getter: function() {return SmsSender.captchaCode;}
      },
      {name: "translit",
      getter: "1"
      },
      {name: "sender_name",
      getter: function() {return SmsSender.senderName;}
      })}
			};
			
SmsSender.carriers[1] = {
	name: "kyivstar",
	captchaProcessor : {
		getUrl : "http://www.kyivstar.net/_sms_new.html",
		internalCodeExtractor: function(html){
        try{var ios = Components.classes["@mozilla.org/network/io-service;1"]
                .getService(Components.interfaces.nsIIOService);
        var uri = ios.newURI("http://www.kyivstar.net/", null, null);
        var cookieSvc =
          Components.classes["@mozilla.org/cookieService;1"]
                 .getService(Components.interfaces.nsICookieService);
        var cookie = cookieSvc.getCookieString(uri, null);
        var re = new RegExp("code=(\\d\\d\\d\\d)");
        SmsSender.getcaptchaCodeInput().value = cookie.match(re)[1];} catch(e){SmsSender.getcaptchaCodeInput().value = "";}
        var re = new RegExp("img\\s+src=\\\"/code_image\\.gif\\?id=([^\"]*)\\\"");
		SmsSender.captchaInternalCode = html.match(re)[1];
		},
		imageSourceBuilder: function(){
			return "http://www.kyivstar.net/code_image.gif?id="+SmsSender.captchaInternalCode+"&fjgkdfljg="+Math.random();
		}
	},
	sendProcessor: 
	{
		type: "PostForm",
		postFormUrl: "http://www.kyivstar.net/_sms_new.html",
		formItems: new Array({name:"submitted",getter: "true"},
			{name: "lang",getter: "ua"},
			{name: "lat",getter: "1"},
			{name: "mobcode",getter: function() {return SmsSender.currentChannel.value;}},
      		{name: "number",getter: function() {return SmsSender.phoneNumber;}},
      		{name: "message",getter: function() {return SmsSender.message+SmsSender.senderName;}},
      		{name: "antispam",getter: function() {return SmsSender.captchaCode;}},
			{name: "kot",getter: function() {return SmsSender.captchaInternalCode;}})
	}
};

SmsSender.carriers[2] = {
	name: "beeline",
	captchaProcessor : {
		getUrl : "http://beesms.beeline.ua/",
		internalCodeExtractor: function(html){
			var re = new RegExp("IMG\\s+SRC=\\\"\\.\\.\\/count\\.php(\\?[^\"]+)\\\"");
			SmsSender.captchaInternalCode = html.match(re)[1];
			SmsSender.getcaptchaCodeInput().value = "";
		},
		imageSourceBuilder: function(){
			return "http://beesms.beeline.ua/count.php"+SmsSender.captchaInternalCode+"&jkghf="+Math.random();
		}
	},
	sendProcessor: 
	{
		type: "PostForm",
		postFormUrl: "http://beesms.beeline.ua/",
		formItems: new Array(
			{name: "op",
			getter: "send_sms"},
			{name: "dlina",
			getter: "142"},
			{name: "lg",
			getter: "latukr"},
			{name: "phone_num",
			getter: function() {return SmsSender.currentChannel.value+SmsSender.phoneNumber;}},
			{name: "text_message",
			getter: function() {return SmsSender.message+SmsSender.senderName;}},
			{name: "code_form",
			getter: function() {return SmsSender.captchaCode;}})}
		};		
			
		SmsSender.channels = new Array(
			{text: "UMC (050)",
			carrier: SmsSender.carriers[0],
			value: "UMC"},
			
			{text: "UMC (095)",
			carrier: SmsSender.carriers[0],
			value: "UMC095"},
			
			{text: "Jeans (099)",
			carrier: SmsSender.carriers[0],
			value: "UMC099"},
			
			{text: "Jeans (066)",
			carrier: SmsSender.carriers[0],
			value: "JEANS"},
			
			{text: "Kyivstar (067)",
			carrier: SmsSender.carriers[2],
			value: "067"},
			
			{text: "Kyivstar (096)",
			carrier: SmsSender.carriers[2],
			value: "096"},
			
			{text: "Kyivstar (097)",
			carrier: SmsSender.carriers[2],
			value: "097"},
			
			{text: "Kyivstar (098)",
			carrier: SmsSender.carriers[2],
			value: "098"},
			
			{text: "GoldenTel1 (039)",
			carrier: SmsSender.carriers[2],
			value: "039"},
			
			{text: "Life (063)",
			carrier: SmsSender.carriers[2],
			value: "063"},
			
			{text: "Life (093)",
			carrier: SmsSender.carriers[2],
			value: "093"},
			
			{text: "GoldenTel2 (039)",
			carrier: SmsSender.carriers[0],
			value: "GT"},
			
			{text: "Welcome (068)",
			carrier: SmsSender.carriers[0],
			value: "WC"},
			
			{text: "Beeline (068)",
			carrier: SmsSender.carriers[2],
			value: "068"}
		);
		
SmsSender.setChannel = function(newChannel){
    var oldCarName = SmsSender.currentChannel ? SmsSender.currentChannel.carrier.name : null;
    SmsSender.currentChannel = newChannel;
	if (oldCarName!=newChannel.carrier.name) SmsSender.refreshCaptcha();
};
		
SmsSender.refreshCaptcha = function(){
    var cb = SmsSender.getCaptchaBlock();
    if (SmsSender.currentChannel.carrier.captchaProcessor){
      cb.style.display=null;
      SmsSender.getCaptchaImg().src = "wait.gif";
      
      SmsSender.reqCaptcha = new XMLHttpRequest();
      SmsSender.reqCaptcha.open("get", SmsSender.currentChannel.carrier.captchaProcessor.getUrl, true);
      SmsSender.reqCaptcha.onreadystatechange = SmsSender.onCaptchaResponse;
      SmsSender.reqCaptcha.send(null);
	 }else{
      cb.style.display="none";
    }
};

SmsSender.onCaptchaResponse = function(){
	if ((SmsSender.reqCaptcha.readyState == 4)&&((SmsSender.reqCaptcha.status == 200)||(SmsSender.reqCaptcha.status == 0))){
		SmsSender.currentChannel.carrier.captchaProcessor.internalCodeExtractor(SmsSender.reqCaptcha.responseText);
		var imageUrl = SmsSender.currentChannel.carrier.captchaProcessor.imageSourceBuilder();
		SmsSender.getCaptchaImg().src = imageUrl;
	}
};
			
SmsSender.sendSms = function(){
    SmsSender.phoneNumber=SmsSender.getPhoneNumInput().value;
    SmsSender.message=SmsSender.translitString(SmsSender.getMessageInput().value);
    SmsSender.captchaCode=SmsSender.getcaptchaCodeInput().value;
    SmsSender.senderName=SmsSender.getSenderName().value;
    var channel=SmsSender.currentChannel;
    var processor=channel.carrier.sendProcessor;
        
	var newTab = SmsSender.openUrlInNewTab("about:blank");
	SmsSender.gBrowser.selectedTab = newTab;
	var form = SmsSender.gBrowser.contentDocument.createElement("form");
	form.setAttribute("method","post");
	form.setAttribute("action",processor.postFormUrl);
	SmsSender.gBrowser.contentDocument.body.appendChild(form);
	for(var i=0;i<processor.formItems.length;i++){
		var p = processor.formItems[i];
		var inp = SmsSender.gBrowser.contentDocument.createElement("input");
		inp.setAttribute("type","hidden");
		inp.setAttribute("name",p.name);
		inp.setAttribute("value",SmsSender.getValueToString(p.getter));
		form.appendChild(inp);}
	SmsSender.getcaptchaCodeInput().value = "";
	form.submit();

	SmsSender.processAddressBook(channel, SmsSender.phoneNumber);
	SmsSender.prefs.setCharPref("smssender.sendername", SmsSender.getSenderName().value);
	window.setTimeout('SmsSender.refreshCaptcha()', 2000);
};

SmsSender.clearFields = function(){
    SmsSender.getPhoneNumInput().value = "";
    SmsSender.getMessageInput().value = "";
    SmsSender.messageCannged();
};
		
SmsSender.getValueToString = function(v){
    if (typeof(v)=="function") v = v();
    return v.toString();
}

SmsSender.channelChanged = function(){
	SmsSender.setChannel(SmsSender.channels[SmsSender.getChannelSelector().selectedIndex]);
}

SmsSender.selectedAddress=function(){
  var addr=new AddressBookItem(SmsSender.addressBook.selectedItem.value);
  var sel=SmsSender.getChannelSelector();
  for(var i=0;i<SmsSender.channels.length;i++)
    if ((SmsSender.channels[i].text==addr.channel)||(SmsSender.channels[i].value==addr.channel)){sel.selectedIndex=i;break;}
  SmsSender.getPhoneNumInput().value=addr.number;
  SmsSender.setChannel(SmsSender.channels[sel.selectedIndex]);
  
	document.getElementById("smsse-changeName").hidden=(SmsSender.addressBook.selectedIndex==-1);
	document.getElementById("smsse-changeNameTxt").value=addr.name;
}

SmsSender.messageCannged=function(){
	document.getElementById("smsse-symbolsCount").value=(SmsSender.getMessageInput().value.length+SmsSender.getSenderName().value.length).toString();
}

SmsSender.openUrlInNewTab=function(url){
	return SmsSender.gBrowser.addTab(url);
}

SmsSender.getChannelSelector = function(){return document.getElementById("smsse-channelSelector")};
SmsSender.getCaptchaBlock = function(){return document.getElementById("smsse-captchaBlock")};
SmsSender.getCaptchaImg = function(){return document.getElementById("smsse-captchaCodeImg")};
SmsSender.getPhoneNumInput = function(){return document.getElementById("smsse-phoneNumber")};
SmsSender.getMessageInput = function(){return document.getElementById("smsse-message")};
SmsSender.getcaptchaCodeInput = function(){return document.getElementById("smsse-captchaInput")};
SmsSender.getSenderName = function(){return document.getElementById("smsse-yourName")};

// AddressBook methods
SmsSender.maximalAddressCount=20;
SmsSender.addressBookToString = function(){
  var res = "";
  for(var i=0;i<SmsSender.addressBook.getRowCount();i++){
    if (i>0) res+="?";
    res+=SmsSender.addressBook.getItemAtIndex(i).value;
  }
  return res;};
  
SmsSender.initAddressBook=function(){
  var val=null;
  try
  {
    val=SmsSender.prefs.getCharPref("smssender.addressbook");
  }
  catch(e){}
  if (!val||(val==""))return;
  var arr = val.split("?");
  for(var i=0;i<arr.length;i++){
    var addr = new AddressBookItem(arr[i]);
    for(var j=0;j<this.channels.length;j++) // This loop should be removed in next versions (converts addressbook to current version)
    	if (addr.channel==this.channels[j].text) addr.channel=this.channels[j].value;

    var item = document.createElement("listitem");
    item.setAttribute("label",addr.toLabel());
    item.setAttribute("value",addr.toValue());
    item.setAttribute("onclick", "SmsSender.selectedAddress()");
    SmsSender.addressBook.appendChild(item);
  }
}
  
SmsSender.processAddressBook = function(channel,number){
  var weis=new Array();
  var theItem=null;
  for(var i=0;i<SmsSender.addressBook.getRowCount();i++){
    var curItem = SmsSender.addressBook.getItemAtIndex(i);
    var cur=new AddressBookItem(curItem.value);
    cur.lam*=0.94;
    if((cur.channel==channel.value)&&(cur.number==number)&&(theItem==null)){theItem=curItem;cur.lam++;}
    curItem.value = cur.toValue();
    weis[i]=cur.lam;
  }
  
  var addr = theItem ? new AddressBookItem(theItem.value) : new AddressBookItem(channel.value, number);
  var p=0;
  for(;p<weis.length;p++){
    if (weis[p]<=addr.lam)break;
  }
  
  if (p>=SmsSender.maximalAddressCount) return;
  var curIdx = theItem?SmsSender.addressBook.getIndexOfItem(theItem):-1;
  
  if (theItem&&(curIdx!=p))SmsSender.addressBook.removeItemAt(curIdx);
  
  if (!theItem||(curIdx!=p)){
    var newit=null;
    if (p>=SmsSender.addressBook.getRowCount())
      newit=SmsSender.addressBook.appendItem(addr.toLabel(),addr.toValue());
    else
      newit=SmsSender.addressBook.insertItemAt(p,addr.toLabel(),addr.toValue());
    newit.setAttribute("onclick", "SmsSender.selectedAddress()");
  }
  
  if (SmsSender.addressBook.getRowCount()>SmsSender.maximalAddressCount)SmsSender.addressBook.removeItemAt(SmsSender.maximalAddressCount);
  SmsSender.saveAddressBook();
};

SmsSender.saveAddressBook=function(){SmsSender.prefs.setCharPref("smssender.addressbook", SmsSender.addressBookToString());};

SmsSender.changeContactName=function(){
	var cur = SmsSender.addressBook.selectedItem;
	var d = new AddressBookItem(cur.value);
	d.name = document.getElementById("smsse-changeNameTxt").value;
	cur.value=d.toValue();
	cur.label=d.toLabel();
	SmsSender.saveAddressBook();
};

SmsSender.deleteContact=function(){
	if (confirm(document.getElementById("smsse-confirmDeleteContact").value)){
		SmsSender.addressBook.removeItemAt(SmsSender.addressBook.selectedIndex)
		SmsSender.saveAddressBook();
	}
};

SmsSender.channelCodeToName=function(code){
	for(var i=0;i<this.channels.length;i++){
		if (this.channels[i].value==code)return this.channels[i].text;
	}
	return "?";
}

function AddressBookItem(channel,number,lam,name){
  if (arguments.length==1)
  {
      var r = channel.split("&");
      this.channel=unescape(r[0]);
      this.number=unescape(r[1]);
      this.lam=parseFloat(unescape(r[2]));
      this.name=r.length>3 ? unescape(r[3]) : "";
  }
  else
  {
    this.channel=channel;
    this.number=number;
    this.lam=(arguments.length>2)?lam:1.0;
    this.name=(arguments.length>3)?name:"";
  }
}
AddressBookItem.prototype.toLabel = function(){
	var res = this.name;
	if (res!="")res+=": ";
	res+=SmsSender.channelCodeToName(this.channel)+" "+this.number/*+"-"+this.lam.toString()*/;
	return res;}
AddressBookItem.prototype.toValue = function(){return escape(this.channel)+"&"+escape(this.number)+"&"+escape(this.lam.toString())+"&"+escape(this.name);}

// Transliteration
SmsSender.letters="абвгґдеєжзиіїйклмнопрстуфхцчшщьюяАБВГҐДЕЄЖЗИІЇЙКЛМНОПРСТУФХЦЧШЩЬЮЯыъэёЫЪЭЁ";
SmsSender.translit=new Array("a","b","v","g","g","d","e","je","zh","z","y","i","ji","j","k","l","m","n","o","p","r","s","t","u","f","x","c","ch","w","wch","'","ju","ja","A","B","V","G","G","D","E","Je","Zh","Z","Y","I","Ji","J","K","L","M","N","O","P","R","S","T","U","F","X","C","Ch","W","Wch","'","Ju","Ja","y","","e","jo","Y","","E","Jo");
SmsSender.translitString=function(s){
	var res="";
	for(var i=0;i<s.length;i++){
		var f=false;
		for(var z=0;z<SmsSender.letters.length;z++)if (SmsSender.letters[z]==s[i]){f=true;res+=SmsSender.translit[z];}
		if(!f)res+=s[i];
	}
	return res;
};
	
window.addEventListener("load", function(e) { SmsSender.onLoad(e); }, false);