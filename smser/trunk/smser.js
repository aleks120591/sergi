﻿// ####### SAdamchuk_Smser_Controller
var SAdamchuk_Smser_Controller={
    initialize:function(view,persist){
        this.view=view;
        this.persist=persist;
        this.model=new SAdamchuk_Smser_Model();
        
        var handler=function(){SAdamchuk_Smser_Controller.onNewCookies();};
        if (this.view.frame.attachEvent)
    		this.view.frame.attachEvent('onload',handler);
	    else
		    this.view.frame.onload=handler;
		this.view.buttonSend.onclick=function(){SAdamchuk_Smser_Controller.sendSms();};
		this.view.channelSelector.onchange=function(){SAdamchuk_Smser_Controller.adjustChannel();};
		this.view.captchaImg.onclick=function(){SAdamchuk_Smser_Controller.refreshCaptcha();};
        
        this.refreshCaptcha();
        this.adjustChannel();
        this.view.adjustSymbCounter();
        
        this.model.contacts=new Array(
            new SAdamchuk_Smser_Contact("6","6077288"),
            new SAdamchuk_Smser_Contact("2","6545645"),
            new SAdamchuk_Smser_Contact("4","4534534"));
            
        this.view.redrawContacts(this.model.contacts);
    },

    dispose:function(){
        this.model.dispose();
        this.model=null;
        this.persist=null;
    },

    refreshCaptcha:function(){
        this.view.frame.src="about:blank"; // Necessary for opera
        this.view.setWaitingCaptcha();
        var car=this.model.getCurrentCarrier();
        this.view.frame.src=car.baseUrl+car.cookRefreshPath;
    },
    
    sendSms:function(){
        this.model.phoneNum=this.view.phoneNumber.value;
        this.model.message=this.view.message.value;
        this.model.captcha=this.view.captcha.value;
        this.model.sender=this.view.senderName.value;
        
        newWin=window.open("about:blank", "_blank");
        var frm=newWin.document.createElement("form");
        frm.method="post";
	    var car=this.model.getCurrentCarrier();
	    frm.action=car.baseUrl+car.postPath;
	    for(var i=0;i<car.formItems.length;i++){
	        var field=newWin.document.createElement("input");
	        field.type="hidden";
	        field.name=car.formItems[i].name;
	        field.value=SAdamchuk_Smser_carriers.getValueToString(car.formItems[i].getter,this.model);
	        frm.appendChild(field);
	    }
	    
        newWin.document.body.appendChild(frm);
        frm.submit();        
    },
    
    onNewCookies:function(){
        var car=this.model.getCurrentCarrier();
        var url=car.baseUrl+car.captchaPath;
        url+=(url.indexOf("?")<0)?"?":"&";
        url+=("scomua="+Math.random());
        this.view.captchaImg.src=url;        
    },
    
    adjustChannel:function(){
        var oldCarrierId=this.model.channel.carrier;
        this.model.channel=SAdamchuk_Smser_carriers.getChannelByCode(this.view.channelSelector.value);
        if(oldCarrierId!=this.model.channel.carrier)this.refreshCaptcha();
        this.view.setCarrierLogo(this.model.channel.logo);
    },
    
    setFieldsFromContact:function(contactId){
        var c=this.model.contacts[contactId];
        this.view.phoneNumber.value=c.number;
        if(c.channel)this.view.setChannel(c.channel.code);
        this.adjustChannel();
        //this.refreshCaptcha();
        this.view.refreshInnputHints();
        this.view.setTab(0);
    }
}

// ####### SAdamchuk_Smser_Model
function SAdamchuk_Smser_Model(){
    this.channel=SAdamchuk_Smser_carriers.channels[0];
}

SAdamchuk_Smser_Model.prototype.getCurrentCarrier=function(){
    return SAdamchuk_Smser_carriers.carriers[this.channel.carrier];
}

SAdamchuk_Smser_Model.prototype.dispose=function(){
}

// ####### SAdamchuk_Smser_View
function SAdamchuk_Smser_View(div,urlResolver,contactPageView,helpText){
	var res={};
	res.urlResolver=urlResolver;
	res.contactPageView=contactPageView;
	
	res.createSpace=function(width){
        var r=document.createElement("img");
        r.width=width;
        r.height="1px";
        r.alt=" ";
        return r;
    };
    
    res.clear=function(){
    	this.message.value="";
    	this.phoneNumber.value="";
    	this.adjustSymbCounter();
    	this.refreshInnputHints();
    };
    
    res.refreshInnputHints=function(){
    	this.textBlured(this.phoneNumber);
    	this.textBlured(this.message);
    	this.textBlured(this.senderName);
    	this.textBlured(this.captcha);
    };
    
    res.textFocused=function(ctrl){
        ctrl.style.background="rgb(255, 255, 255)";
    };
    
    res.textBlured=function(ctrl){
        if (ctrl.value=="")ctrl.style.background="rgb(255, 255, 255) url("+this.urlResolver.resolveUrl("images/wm"+ctrl.name+".gif")+") no-repeat scroll center center";
        else this.textFocused(ctrl);
    };
	
	res.createHeadersDiv=function(){
	    var curDiv=document.createElement("div");
	    curDiv.id="headerDiv";
	    curDiv.align="left";
        this.tabs=new Array();
        this.tabs[0]=document.createElement("img");
        this.tabs[0].className="activeTab";
        this.tabs[0].alt="Головна";
        this.tabs[0].src=urlResolver.resolveUrl("tabmain.gif");
        this.tabs[0].onclick=function(){SAdamchuk_Smser_Controller.view.setTab(0);};
        curDiv.appendChild(this.tabs[0]);
        
        this.tabs[1]=document.createElement("img");
        this.tabs[1].className="pageHeader";
        this.tabs[1].alt="Опції";
        this.tabs[1].src=urlResolver.resolveUrl("tabopt.gif");
        this.tabs[1].onclick=function(){SAdamchuk_Smser_Controller.view.setTab(1);};
        curDiv.appendChild(this.tabs[1]);
        
        this.tabs[2]=document.createElement("img");
        this.tabs[2].className="pageHeader";
        this.tabs[2].alt="Довідка";
        this.tabs[2].src=urlResolver.resolveUrl("tabhlp.gif");
        this.tabs[2].onclick=function(){SAdamchuk_Smser_Controller.view.setTab(2);};
        curDiv.appendChild(this.tabs[2]);
        
        if (contactPageView){
            this.tabs[3]=document.createElement("img");
            this.tabs[3].className="pageHeader";
            this.tabs[3].alt="Контакти";
            this.tabs[3].src=urlResolver.resolveUrl("tabcont.gif");
            this.tabs[3].onclick=function(){SAdamchuk_Smser_Controller.view.setTab(3);};
            curDiv.appendChild(this.tabs[3]);
        }
        return curDiv;
	};	
	
	res.createMainDiv=function(){
	    var curDiv=document.createElement("div");
	    curDiv.className="page";
	    curDiv.id="mainPage";
	    
	    var table=document.createElement("table");
	    
	    var tr=table.insertRow(0);
        var td=tr.insertCell(0);
        
        this.carLogo=document.createElement("img");
        this.carLogo.alt="Лого оператора";
        td.appendChild(this.carLogo);
        
        td.appendChild(this.createSpace(3));
    
        this.channelSelector=document.createElement("select");
        this.channelSelector.className="control";
        this.channelSelector.style.width="120px";
	    for(var i=0;i<SAdamchuk_Smser_carriers.channels.length;i++){
            var opt=new Option(SAdamchuk_Smser_carriers.channels[i].text);
            opt.value=SAdamchuk_Smser_carriers.channels[i].code.toString();
            res.channelSelector.options[i]=opt;
	    }
	    td.appendChild(this.channelSelector);
    	
	    td=tr.insertCell(1);
	    td.align="right";
	    this.phoneNumber=document.createElement("input");
	    this.phoneNumber.type="text";
	    this.phoneNumber.name="phnum";
	    this.phoneNumber.maxLength=7;
	    this.phoneNumber.className="textField";
	    this.phoneNumber.onfocus=function(){
            SAdamchuk_Smser_Controller.view.textFocused(SAdamchuk_Smser_Controller.view.phoneNumber);
	    };
	    this.phoneNumber.onblur=function(){
            SAdamchuk_Smser_Controller.view.textBlured(SAdamchuk_Smser_Controller.view.phoneNumber);
	    };	    
	    td.appendChild(this.phoneNumber);
	    
	    tr=table.insertRow(1);
        td=tr.insertCell(0);
        td.colSpan=2;
    	
	    this.message=document.createElement("textarea");
	    this.message.className="control";
	    this.message.name="msginp";
	    this.message.cols=29;
	    this.message.rows=4;
	    this.message.style.width="100%";
	    this.message.onchange=this.message.onkeyup=function(){SAdamchuk_Smser_Controller.view.adjustSymbCounter();};
	    this.message.onfocus=function(){
            SAdamchuk_Smser_Controller.view.textFocused(SAdamchuk_Smser_Controller.view.message);
	    };
	    this.message.onblur=function(){
            SAdamchuk_Smser_Controller.view.textBlured(SAdamchuk_Smser_Controller.view.message);
	    };
	    td.appendChild(this.message);
	    
	    tr=table.insertRow(2);
        td=tr.insertCell(0);
	    var el=document.createElement("span");
	    el.style.fontSize="small";
	    el.innerHTML="Кількість символів:";
	    td.appendChild(el);
	    
	    td.appendChild(this.createSpace(3));
	    
	    this.symbCounter=document.createElement("span");
	    this.symbCounter.style.color="blue";
	    this.symbCounter.style.fontSize="small";
	    td.appendChild(this.symbCounter);
    	
	    td=tr.insertCell(1);
	    td.align="right";
	    this.senderName=document.createElement("input");
	    this.senderName.type="text";
	    this.senderName.name="sender";
	    this.senderName.className="textField";
	    this.senderName.maxlength=10;
	   	this.senderName.onchange=this.senderName.onkeyup=function(){SAdamchuk_Smser_Controller.view.adjustSymbCounter();};
	    this.senderName.onfocus=function(){
            SAdamchuk_Smser_Controller.view.textFocused(SAdamchuk_Smser_Controller.view.senderName);
	    };
	    this.senderName.onblur=function(){
            SAdamchuk_Smser_Controller.view.textBlured(SAdamchuk_Smser_Controller.view.senderName);
	    };	    	    
	    td.appendChild(this.senderName);
    	
	    tr=table.insertRow(3);
        td=tr.insertCell(0);
        td.style.overflow="hidden";
        td.style.height="50px";
	    this.captchaImg=document.createElement("img");
	    this.captchaImg.style.cursor="pointer";
	    this.captchaImg.alt="Код";
	    td.appendChild(this.captchaImg);
    	
	    td=tr.insertCell(1);
	    td.align="right";
	    this.captcha=document.createElement("input");
	    this.captcha.type="text";
	    this.captcha.name="ccode";	    
	    this.captcha.className="textField";
	    this.captcha.maxlength=5;
	    this.captcha.onfocus=function(){
            SAdamchuk_Smser_Controller.view.textFocused(SAdamchuk_Smser_Controller.view.captcha);
	    };
	    this.captcha.onblur=function(){
            SAdamchuk_Smser_Controller.view.textBlured(SAdamchuk_Smser_Controller.view.captcha);
	    };	    
	    td.appendChild(this.captcha);
	    
	    res.refreshInnputHints();
                
        tr=table.insertRow(4);
        
        td=tr.insertCell(0);
        td.colSpan=2;
        td.align="center";
        var but=document.createElement("input");
        but.className="button";
	    but.type="button";
	    but.value="Очистити";
	    but.onclick=function(){SAdamchuk_Smser_Controller.view.clear();};
	    td.appendChild(but);
	    
	    td.appendChild(this.createSpace(5));

        this.buttonSend=document.createElement("input");
        this.buttonSend.className="button";
	    this.buttonSend.type="button";
	    this.buttonSend.value="Відправити";
        td.appendChild(this.buttonSend);
        
        this.tabs[0].page=curDiv;
        curDiv.appendChild(table);
        
        return curDiv;
	};
	
	res.createOptionsDiv=function(){
	    var curDiv=document.createElement("div");
	    curDiv.className="hiddenPage";
	    curDiv.id="optPage";
	    curDiv.innerHTML="Тут колись будуть опції :)";
	            
        this.tabs[1].page=curDiv;
        
        return curDiv;
	};
	
	res.createHelpDiv=function(txt){
	    var curDiv=document.createElement("div");
	    curDiv.className="hiddenPage";
	    curDiv.id="helpPage";
	    curDiv.innerHTML=txt;
	            
        this.tabs[2].page=curDiv;
        
        return curDiv;
	};
	
	res.createContactsDiv=function(){
	    var curDiv=document.createElement("div");
	    curDiv.className="hiddenPage";
	    curDiv.id="contPage";
	    	    
	    this.contactsTable=document.createElement("table");
	    curDiv.appendChild(this.contactsTable);
	            
        this.tabs[3].page=curDiv;
        
        return curDiv;
	};
	
    var td=document.createElement("div");
    td.style.width="290px";
    td.align="left";
    
    td.appendChild(res.createHeadersDiv());
    td.appendChild(res.createMainDiv());
    td.appendChild(res.createOptionsDiv());
    td.appendChild(res.createHelpDiv(helpText));
    if(contactPageView)td.appendChild(res.createContactsDiv());
    div.appendChild(td);
    
    res.frame=document.createElement("iframe");
    res.frame.style.display="none";
    div.appendChild(res.frame);
    
    res.dispose=function(){
        this.channelSelector=null;
        this.phoneNumber=null;
        this.message=null;
        this.captchaImg=null;
        this.captcha=null;
        this.senderName=null;
        this.buttonSend=null;
        this.frame=null;
        this.carLogo=null;
        this.symbCounter=null;
        this.contactsTable=null;
        this.urlResolver=null;
    };
    
    res.setWaitingCaptcha=function(){
        this.captchaImg.src=urlResolver.resolveUrl("wait30.gif");
        this.captcha.value="";
    };
    
    res.setTab=function(tabId){
        this.tabs[this.currentTabId].className="pageHeader";
        this.tabs[this.currentTabId].page.className="hiddenPage";
        this.currentTabId=tabId;
        this.tabs[this.currentTabId].className="activeTab";
        this.tabs[this.currentTabId].page.className="page";
    };
    
    res.setCarrierLogo=function(logoFile){
        this.carLogo.src=urlResolver.resolveUrl("logos/"+logoFile);
    };
    
    res.adjustSymbCounter=function(){
    	this.symbCounter.innerHTML=(this.message.value.length+this.senderName.value.length);
    };
    
    res.insertContact=function(contact,index){
        var fn=function(){SAdamchuk_Smser_Controller.setFieldsFromContact(index);};
    
        var tr=this.contactsTable.insertRow(index);
        var td=tr.insertCell(0);
        var el=document.createElement("img");
        el.src=this.urlResolver.resolveUrl("images/contact.gif");
        el.className="cmdImage";
        el.onclick=fn;
        el.alt="Контакт";
        td.appendChild(el);
        
        td=tr.insertCell(1);
        el=document.createElement("span");
        el.style.fontSize="small";
        el.style.cursor="pointer";
        el.onclick=fn;
        el.innerHTML=contact.getDisplayable();
        td.appendChild(el);
        
        td=tr.insertCell(2);
        el=document.createElement("img");
        el.src=this.urlResolver.resolveUrl("images/edit.gif");
        el.className="cmdImage";
        el.alt="Редагувати";
        td.appendChild(el);
        
        td=tr.insertCell(3);
        el=document.createElement("img");
        el.src=this.urlResolver.resolveUrl("images/delete.gif");
        el.className="cmdImage";
        el.alt="Вилучити";
        td.appendChild(el);
    };
    
    res.redrawContacts=function(contacts){
        while(this.contactsTable.rows.count>0)this.contactsTable.deleteRow(0);
        for(var i=0;i<contacts.length;i++)this.insertContact(contacts[i],i);
    };
    
    res.setChannel=function(channelCode){
        for(var i=0;i<this.channelSelector.options.length;i++)
            if (this.channelSelector.options[i].value==channelCode){
                this.channelSelector.selectedIndex=i;
                return;
            }
    };
    
    res.currentTabId=0;
    
    return res;
}

var SAdamchuk_Smser_carriers={
    carriers:new Array({
	        baseUrl:"http://www.umc.ua/",
	        cookRefreshPath:"ukr/sendsms.php",
	        captchaPath:"back/modules/sms/sms_picture2.php",
	        postPath:"back/modules/sms/db_sms.php",
	        formItems: new Array(
		      {name: "PHPSESSID",getter: function(arg) {return ""/*arg.captInternal;*/}},
		      {name: "script",getter: "/ukr/sendsms.php"},
		      {name: "sms_tag_id",getter: "3"},
		      {name: "network1",getter: function(arg) {return arg.channel.value;}},
              {name: "phone1",getter: function(arg) {return arg.phoneNum;}},
              {name: "message",getter: function(arg) {return arg.message;}},
              {name: "anti",getter: function(arg) {return arg.captcha;}},
              {name: "translit",getter: "1"},
              {name: "sender_name",getter: function(arg) {return arg.sender;}})
        },{
            baseUrl:"http://www.kyivstar.net/",
            cookRefreshPath:"_sms.html",
            captchaPath:"sms_code_image.gif",
            postPath:"_sms.html",
            sendProcessor:"_sms.html",
            formItems: new Array(
                {name: "submitted",getter: "true"},
                {name: "lang",getter: "ua"},
                {name: "lat",getter: "1"},
                {name: "mobcode",getter: function(arg) {return arg.channel.value;}},
                {name: "number",getter: function(arg) {return arg.phoneNum;}},
                {name: "message",getter: function(arg) {return arg.message+arg.sender;}},
                {name: "antispam",getter: function(arg) {return arg.captcha;}})
         },{
	        baseUrl:"http://beesms.beeline.ua/",
		    cookRefreshPath:"",
		    captchaPath:"count.php?text=ri4ugo0jcevrh30sprik9s9s93&bgfg=F1C42E:001300",
		    postPath:"",
	        formItems: new Array(
		        {name:"op",getter: "send_sms"},
		        {name:"dlina",getter: "142"},
		        {name:"lg",getter: "latukr"},
		        {name:"phone_num",getter: function(arg) {return arg.channel.value+arg.phoneNum;}},
		        {name:"text_message",getter: function(arg) {return arg.message+arg.sender;}},
		        {name:"code_form",getter: function(arg) {return arg.captcha;}})
		  }
        ),
        
        channels:new Array(
			{text:"UMC (050)",carrier:0,value:"UMC",code:"0",logo:"umc.gif"},
			{text:"UMC (095)",carrier:0,value: "UMC095",code:"1",logo:"umc.gif"},
			{text:"Jeans (099)",carrier:0,value: "UMC099",code:"2",logo:"jeans.gif"},
			{text:"Jeans (066)",carrier:0,value: "JEANS",code:"3",logo:"jeans.gif"},
			{text:"Kyivstar (067)",carrier:1,value: "067",code:"4",logo:"kyivstar.gif"},
			{text:"Kyivstar (096)",carrier:1,value: "096",code:"5",logo:"kyivstar.gif"},
			{text:"Kyivstar (097)",carrier:1,value: "097",code:"6",logo:"kyivstar.gif"},
			{text:"Kyivstar (098)",carrier:1,value: "098",code:"7",logo:"kyivstar.gif"},
			{text:"GoldenTel1 (039)",carrier:1,value: "039",code:"8",logo:"gt.gif"},
			{text:"Life (063)",carrier:1,value: "063",code:"9",logo:"life.gif"},
			{text:"Life (093)",carrier:1,value: "093",code:"a",logo:"life.gif"},
			{text:"GoldenTel2 (039)",carrier:0,value: "GT",code:"b",logo:"gt.gif"},
			{text:"Welcome (068)",carrier:0,value: "WC",code:"c",logo:"beeline.gif"},
			{text:"Beeline (068)",carrier:2,value: "38068",code:"d",logo:"beeline.gif"}),
        
        getValueToString:function(v, arg){
            if (typeof(v)=="function") v = v(arg);
            return v.toString();},
            
        getChannelByCode:function(code){
            for(var i=0;i<this.channels.length;i++)
                if (code==this.channels[i].code)return this.channels[i];
            return null;
        }
}

// ####### SAdamchuk_Smser_Contact
function SAdamchuk_Smser_Contact(channelCode,number){
    this.name="";
    this.rate=0;
    this.channel=SAdamchuk_Smser_carriers.getChannelByCode(channelCode);
    this.number=number;
}

SAdamchuk_Smser_Contact.prototype.getDisplayable=function(){
    var r=this.name;
    if(r!="")r+=": ";
    r+=this.channel.text+" "+this.number;
    return r;
}

SAdamchuk_Smser_Contact.prototype.serialize=function(){
}

function SAdamchuk_Smser_DeserializeContact(txt){
}

function SAdamchuk_Smser_ToHex(num,len){
    var r=num.toString(16);
    while(r.length<len)r="0"+r;
}

function SAdamchuk_Smser_FromHex(txt){
    var c=0;
    while(txt[c]=="0")c++;
    return parseInt(txt.substr(c),16);
}