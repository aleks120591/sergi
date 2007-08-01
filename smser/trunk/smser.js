var SAdamchuk_Smser_Controller={
    initialize:function(view,persist,authorMode){
        this.view=view;
        this.persist=persist;
        this.model=new SAdamchuk_Smser_Model();
        this.authorMode=authorMode;
        var handler=function(){SAdamchuk_Smser_Controller.onNewCookies();};
        if (this.view.frame.attachEvent)
    		this.view.frame.attachEvent('onload',handler);
	    else
		    this.view.frame.onload=handler;
		this.view.buttonSend.onclick=function(){SAdamchuk_Smser_Controller.sendSms();};
		this.view.channelSelector.onchange=function(){SAdamchuk_Smser_Controller.setCarrier();};
		this.view.captchaImg.onclick=function(){SAdamchuk_Smser_Controller.invalidateCaptcha();SAdamchuk_Smser_Controller.refreshCaptcha();};
        
        if(this.persist&&this.authorMode){
            this.model.contacts=this.persist.getContacts();
            this.view.gateSelector.selectedIndex=this.persist.getGateType();
            this.refreshContacts();
            this.view.senderName.value=this.persist.getSenderName();
        }
        
        this.setCarrier();
        this.refreshCaptcha();
        this.view.adjustSymbCounter();
        this.view.refreshInputHints();
    },

    dispose:function(){
        this.model.dispose();
        this.model=null;
        this.persist=null;
        this.authorMode=null;
    },

    refreshCaptcha:function(){
        if((this.model.carrier.cookRefreshPath==null)||(this.currentCookPath==this.model.carrier.cookRefreshPath))return;
        this.view.frame.src="about:blank"; // Necessary for Opera
        this.view.setWaitingCaptcha();
        var car=this.model.carrier;
        this.view.frame.src=car.baseUrl+car.cookRefreshPath;
    },
    	
    invalidateCaptcha:function(){
    	this.currentCookPath=null;
    },
    
    sendSms:function(){
        this.model.phoneNum=this.view.phoneNumber.value;
        this.model.message=SAdamchuk_Smser_Translit.translitString(this.view.message.value);
        this.model.captcha=this.view.captcha.value;
        this.model.sender=SAdamchuk_Smser_Translit.translitString(this.view.senderName.value);

	    var car=this.model.carrier;
	    this.model.value=new SAdamchuk_Hashtable(car.values).data[this.model.channel.code];
        
        var errorM="";
        if(this.model.phoneNum=="")errorM+="номер одержувача, ";
        if(this.model.message=="")errorM+="повідомлення, ";
        if((car.cookRefreshPath!=null)&&(this.model.captcha==""))errorM+="код, ";
        
        if (errorM!=""){
        	errorM=errorM.substr(0,errorM.length-2);
            alert("Не можливо відправити повідомлення, не введено значення: "+errorM);
            return;
        }
        
        var newWin=window.open("about:blank", "_blank");
        var frm=newWin.document.createElement("form");
        frm.method="post";
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
        if(this.authorMode)this.model.reuseContact(this.model.channel,this.model.phoneNum,this.getGate());
        this.refreshContacts();
        this.persistData();
        this.invalidateCaptcha();
        window.setTimeout('SAdamchuk_Smser_Controller.refreshCaptcha()', 2000);
    },
    
    onNewCookies:function(){
        var car=this.model.carrier;
        var url=car.baseUrl+car.captchaPath;
        url+=(url.indexOf("?")<0)?"?":"&";
        url+=("scomua="+Math.random());
        this.view.captchaImg.src=url;
    },

    setFieldsFromContact:function(contactId){
        var c=this.model.contacts[contactId];
        this.view.phoneNumber.value=c.number;
        this.view.gateSelector.selectedIndex=c.gate;
        if(c.channel)this.view.setChannel(c.channel.code);
        this.setCarrier();
        this.view.refreshInputHints();
        this.view.setTab(0);
        this.view.message.focus();
    },
    
    deleteContact:function(contactId){
        var r=new Array();
        for(var i=0;i<this.model.contacts.length;i++)
            if(i!=contactId){
              r[(i<contactId)?i:i-1]=this.model.contacts[i];
            }
        this.model.contacts=r;
        this.persistData();
        this.refreshContacts();
    },
    
    editContact:function(contactId){
        this.view.setEditContact(this.model.contacts[contactId],contactId);
    },
    
    refreshContacts:function(){
        if(this.persist)this.view.redrawContacts(this.model.contacts);
    },
    
    modifyContactName:function(contactId){
        this.model.contacts[contactId].name=this.view.cntEditor.value;
        this.model.sender=SAdamchuk_Smser_Translit.translitString(this.view.senderName.value);
        this.persistData();
        this.refreshContacts();
    },
    
    persistData:function(){
        if(this.persist&&this.authorMode){
            this.persist.save(this.model.contacts,this.model.sender);
        }
    },

    onGateChanged:function(){
    	if(this.persist&&this.authorMode)this.persist.saveGateType(this.view.gateSelector.selectedIndex);
    	this.setCarrier();
    },
    
    setCarrier:function(){
    	var gate=this.getGate();
    	this.model.channel=SAdamchuk_Smser_carriers.getChannelByCode(this.view.channelSelector.value);
    	
    	var carId=(gate) ? SAdamchuk_Smser_carriers.gates[gate].carrier : this.model.channel.carrier;
    	if(SAdamchuk_Smser_carriers.carriers[carId].values){
		    var val=new SAdamchuk_Hashtable(SAdamchuk_Smser_carriers.carriers[carId].values).data[this.model.channel.code];
		   	if(!val)carId=this.model.channel.carrier;
		}
		this.model.carrier=SAdamchuk_Smser_carriers.carriers[carId];
		
		this.view.showCaptchaControls(this.model.carrier.cookRefreshPath!=null);
		this.view.setCarrierLogo(this.model.channel);
		this.refreshCaptcha();
		this.currentCookPath=this.model.carrier.cookRefreshPath;
    },
    	
    getGate:function(){
    	return this.view.gateSelector.selectedIndex;
    }
}

// ####### SAdamchuk_Smser_Model
function SAdamchuk_Smser_Model(){
    this.channel=SAdamchuk_Smser_carriers.channels[0];
    this.gateType=0;
}

SAdamchuk_Smser_Model.prototype.reuseContact=function(channel,number,gateType){
    var cnt=null;
    var step=255*(1-SAdamchuk_Smser_Forget);
    for(var i=0;i<this.contacts.length;i++){
        var c=this.contacts[i];
        if ((c.channel.code==channel.code)&&(c.number==number)){
            cnt=c;
            this.contacts[i]=null;
            cnt.rate=Math.floor(SAdamchuk_Smser_Forget*c.rate+step);
        }
        else c.rate=Math.floor(SAdamchuk_Smser_Forget*c.rate);
    }
    
    var res=new Array();
    var newSize=this.contacts.length;
    
    if(!cnt){
        cnt=new SAdamchuk_Smser_Contact(channel.code,number,Math.floor(step));
        if(newSize<SAdamchuk_Smser_MAX_Cont)newSize++;
    }
    cnt.gate=gateType;
    
    var p=0;
    for(var i=0;i<newSize;i++){
        if(!this.contacts[p])p++;
        if(cnt&&((p>=this.contacts.length)||(this.contacts[p].rate<=cnt.rate))){
            res[i]=cnt;
            cnt=null;
        }else{
            res[i]=this.contacts[p];
            p++;
        }
    }
        
    this.contacts=res;
}

SAdamchuk_Smser_Model.prototype.dispose=function(){
    this.channel=null;
    this.contacts=null;
}

var SAdamchuk_Smser_Forget=0.96;
var SAdamchuk_Smser_MAX_Cont=10;

// ####### SAdamchuk_Smser_View
function SAdamchuk_Smser_View(div,environment,cntText,helpText){
	var res={};
	res.environment=environment;
	
	res.createSpace=function(width){
        var r=document.createElement("img");
        r.width=width;
        r.height="1px";
        r.alt=" ";
        r.border=0;
        return r;
    };
    
    res.clear=function(){
    	this.message.value="";
    	this.phoneNumber.value="";
    	this.adjustSymbCounter();
    	this.refreshInputHints();
    };
    
    res.refreshInputHints=function(){
    	this.textBlured(this.phoneNumber);
    	this.textBlured(this.message);
    	this.textBlured(this.senderName);
    	this.textBlured(this.captcha);
    };
    
    res.textFocused=function(ctrl){
        ctrl.style.background="rgb(255, 255, 255)";
    };
    
    res.textBlured=function(ctrl){
        if (ctrl.value=="")ctrl.style.background="rgb(255, 255, 255) url("+this.environment.resolveUrl("images/wm"+ctrl.name+".gif")+") no-repeat scroll center center";
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
        this.tabs[0].title="Головна";
        this.tabs[0].src=environment.resolveUrl("tabmain.gif");
        this.tabs[0].onclick=function(){SAdamchuk_Smser_Controller.view.setTab(0);};
        curDiv.appendChild(this.tabs[0]);
        
        this.tabs[1]=document.createElement("img");
        this.tabs[1].className="pageHeader";
        this.tabs[1].alt="Опції";
        this.tabs[1].title="Опції";
        this.tabs[1].src=environment.resolveUrl("tabopt.gif");
        this.tabs[1].onclick=function(){SAdamchuk_Smser_Controller.view.setTab(1);};
        curDiv.appendChild(this.tabs[1]);
        
        this.tabs[2]=document.createElement("img");
        this.tabs[2].className="pageHeader";
        this.tabs[2].alt="Довідка";
        this.tabs[2].title="Довідка";
        this.tabs[2].src=environment.resolveUrl("tabhlp.gif");
        this.tabs[2].onclick=function(){SAdamchuk_Smser_Controller.view.setTab(2);};
        curDiv.appendChild(this.tabs[2]);
        
        this.tabs[3]=document.createElement("img");
        this.tabs[3].className="pageHeader";
        this.tabs[3].alt="Контакти";
        this.tabs[3].title="Контакти";
        this.tabs[3].src=environment.resolveUrl("tabcont.gif");
        this.tabs[3].onclick=function(){SAdamchuk_Smser_Controller.view.setTab(3);};
        curDiv.appendChild(this.tabs[3]);
        return curDiv;
	};	
	
	res.createMainDiv=function(){
	    var curDiv=document.createElement("div");
	    curDiv.className="page";
	    curDiv.id="mainPage";
	    curDiv.onkeyup=function(e){
            if(!e)e=event;
            if((e.keyCode==13)&&e.ctrlKey){SAdamchuk_Smser_Controller.sendSms();return true;}
            return false;
        };
	    
	    var table=document.createElement("table");
	    table.width="100%";
	    table.cellPadding=0;
	    table.cellSpacing=1;
	    this.mainTable=table;
	    
	    var tr=table.insertRow(0);
        var td=tr.insertCell(0);
        
        this.carSite=document.createElement("a");
        this.carSite.target="_blank";
        
        this.carLogo=document.createElement("img");
        this.carLogo.alt="Лого оператора";
        this.carLogo.border=0;
        this.carSite.appendChild(this.carLogo);
        
        td.appendChild(this.carSite);
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
	    td.style.textAlign="right";
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
	    this.message.rows=3;
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
	    td.style.textAlign="right";
	    this.senderName=document.createElement("input");
	    this.senderName.type="text";
	    this.senderName.name="sender";
	    this.senderName.className="textField";
	    this.senderName.maxLength=12;
	   	this.senderName.onchange=this.senderName.onkeyup=function(){SAdamchuk_Smser_Controller.view.adjustSymbCounter();};
	    this.senderName.onfocus=function(){
            SAdamchuk_Smser_Controller.view.textFocused(SAdamchuk_Smser_Controller.view.senderName);
	    };
	    this.senderName.onblur=function(){
            SAdamchuk_Smser_Controller.view.textBlured(SAdamchuk_Smser_Controller.view.senderName);
	    };
	    td.appendChild(this.senderName);
    	
	    this.gateRow=table.insertRow(3);
	    this.gateRow.className="rowCaptcha";
        td=this.gateRow.insertCell(0);
	    this.captchaImg=document.createElement("img");
	    this.captchaImg.className="captchaItem";
	    this.captchaImg.style.height="40px";
	    this.captchaImg.style.cursor="pointer";
	    this.captchaImg.alt="Код";
	    this.captchaImg.title="Якщо ви не можете розбрати код, клікніть на ньмоу щоб завантажити інший.";
	    td.appendChild(this.captchaImg);
    	
	    td=this.gateRow.insertCell(1);
	    td.style.textAlign="right";
	    el=document.createElement("div");
	    el.className="captchaItem";
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
	    el.appendChild(this.captcha);
	    td.appendChild(el);

		tr=table.insertRow(4);
        td=tr.insertCell(0);
        td.colSpan=2;
        td.style.textAlign="center";
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
	    
	    curDiv.innerHTML="Ви можете вибрати альтернативний шлюз для відправки повідомлень.<br/>";
	    curDiv.align="center";
	    
	    this.gateSelector=document.createElement("select");
	    for(var i=0;i<SAdamchuk_Smser_carriers.gates.length;i++){
            var opt=new Option(SAdamchuk_Smser_carriers.gates[i].title);
            opt.value=i.toString();
            res.gateSelector.options[i]=opt;
	    }
	    this.gateSelector.selectedIndex=4;
	    curDiv.appendChild(this.gateSelector);
		this.gateSelector.onchange=function(){SAdamchuk_Smser_Controller.onGateChanged();};

        this.tabs[1].page=curDiv;
        
        return curDiv;
	};
	
	res.createHelpDiv=function(txt){
	    var curDiv=document.createElement("div");
	    curDiv.className="hiddenPage";
	    curDiv.id="helpPage";
	    
	    if(txt)curDiv.innerHTML=txt;
	            
        this.tabs[2].page=curDiv;
        
        return curDiv;
	};
	
	res.createContactsDiv=function(txt){
	    var curDiv=document.createElement("div");
	    curDiv.className="hiddenPage";
	    curDiv.id="contPage";
	    
	    if(txt)curDiv.innerHTML=txt;
	    
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
    td.appendChild(res.createContactsDiv(cntText));
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
        this.environment=null;
		this.rowEmail=null;
		this.emailInput=null;
		this.gateRow=null;
		this.carSite=null;
		this.gateSelector=null;
    };
    
    res.setWaitingCaptcha=function(){
        this.captchaImg.src=environment.resolveUrl("wait30.gif");
        this.captcha.value="";
        this.refreshInputHints();
    };
    
    res.setTab=function(tabId){
        this.tabs[this.currentTabId].className="pageHeader";
        this.tabs[this.currentTabId].page.className="hiddenPage";
        this.currentTabId=tabId;
        this.tabs[this.currentTabId].className="activeTab";
        this.tabs[this.currentTabId].page.className="page";
        this.environment.Resize();
    };
    
    res.setCarrierLogo=function(channel){
        this.carLogo.src=environment.resolveUrl("logos/"+channel.logo);
        this.carSite.href=channel.site;
    };
    
    res.adjustSymbCounter=function(){
    	this.symbCounter.innerHTML=(this.message.value.length+this.senderName.value.length);
    };
    
    res.insertContact=function(contact,index){
        var fn=function(){SAdamchuk_Smser_Controller.setFieldsFromContact(index);};
    
        var tr=this.contactsTable.insertRow(index);
        var td=tr.insertCell(0);
        var el=document.createElement("img");
        el.src=this.environment.resolveUrl("images/contact.gif");
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
        el.src=this.environment.resolveUrl("images/edit.gif");
        el.className="cmdImage";
        el.alt="Редагувати";
        el.onclick=function(){SAdamchuk_Smser_Controller.editContact(index);};
        td.appendChild(el);
        
        td=tr.insertCell(3);
        el=document.createElement("img");
        el.src=this.environment.resolveUrl("images/delete.gif");
        el.className="cmdImage";
        el.alt="Вилучити";
        el.onclick=function(){if(confirm("Ви справді бажаєте вилучити цей контакт?"))SAdamchuk_Smser_Controller.deleteContact(index);};
        td.appendChild(el);
    };
    
    res.redrawContacts=function(contacts){
        if (contacts&&(contacts.length>0)){
            this.tabs[3].page.innerHTML="";
    	    this.contactsTable=document.createElement("table");
	        this.tabs[3].page.appendChild(this.contactsTable);
            for(var i=0;i<contacts.length;i++)this.insertContact(contacts[i],i);
        }else
        this.tabs[3].page.innerHTML="Поки що у вас немає контаків, вони автоматично з'являтимуться тут, коли ви будете відправляти повідомлення.";        
        this.environment.Resize();
    };
    
    res.setChannel=function(channelCode){
        for(var i=0;i<this.channelSelector.options.length;i++)
            if (this.channelSelector.options[i].value==channelCode){
                this.channelSelector.selectedIndex=i;
                return;
            }
    };
    
    res.setEditContact=function(contact,id){
        var pg=this.tabs[3].page;
        pg.innerHTML="<span style='font-size:x-small;'>Змінити ім'я для контакту: <b>\""+contact.getDisplayable()+"\"</b></span><br/>";
        this.cntEditor=document.createElement("input");
        this.cntEditor.type="text";
        this.cntEditor.maxLength=7;
        this.cntEditor.className="contactEditor";
        this.cntEditor.value=contact.name;
        this.cntEditor.onkeyup=function(e){
            if(!e)e=event;
            if(e.keyCode==13)SAdamchuk_Smser_Controller.modifyContactName(id);
            if(e.keyCode==27)SAdamchuk_Smser_Controller.refreshContacts();
        };
        pg.appendChild(this.cntEditor);
        
        var el=document.createElement("input");
        el.type="button";
        el.className="button";
        el.value="Зберегти";
        el.onclick=function(){SAdamchuk_Smser_Controller.modifyContactName(id);};
        pg.appendChild(el);
        
        el=document.createElement("input");
        el.type="button";
        el.className="button";
        el.value="Відмінити";
        el.onclick=function(){SAdamchuk_Smser_Controller.refreshContacts();};
        pg.appendChild(el);
        
        this.cntEditor.focus();
        this.cntEditor.select();
        this.environment.Resize();
    };
    
	res.showCaptchaControls=function(show){
		this.gateRow.className=(show)?"rowCaptcha":"rowEmail";
	};
    
    res.currentTabId=0;
    
    return res;
}

var SAdamchuk_Smser_carriers={
    carriers:new Array({
	        baseUrl:"http://mts.com.ua/",
	        cookRefreshPath:"ukr/sendsms.php",
	        captchaPath:"back/modules/sms/sms_picture2.php",
	        postPath:"back/modules/sms/db_sms.php",
	        values:"0=UMC,1=UMC095,2=UMC099,3=JEANS,b=GT",
	        formItems: new Array(
		      {name: "PHPSESSID",getter: function(arg) {return ""/*arg.captInternal;*/}},
		      {name: "script",getter: "/ukr/sendsms.php"},
		      {name: "sms_tag_id",getter: "3"},
		      {name: "network1",getter: function(arg) {return arg.value;}},
              {name: "phone1",getter: function(arg) {return arg.phoneNum;}},
              {name: "message",getter: function(arg) {return arg.message;}},
              {name: "anti",getter: function(arg) {return arg.captcha;}},
              {name: "translit",getter: "1"},
              {name: "sender_name",getter: function(arg) {return arg.sender;}})
        },{
	        baseUrl:"http://beesms.beeline.ua/",
		    cookRefreshPath:"",
		    captchaPath:"count.php?text=ri4ugo0jcevrh30sprik9s9s93&bgfg=F1C42E:001300",
		    postPath:"",
	        formItems: new Array(
		        {name:"op",getter: "send_sms"},
		        {name:"dlina",getter: "142"},
		        {name:"lg",getter: "latukr"},
		        {name:"num_pref",getter: function(arg) {return arg.channel.net;}},
		        {name:"phone_num",getter: function(arg) {return arg.phoneNum;}},
		        {name:"text_message",getter: function(arg) {return arg.message+arg.sender;}},
		        {name:"code_form",getter: function(arg) {return arg.captcha;}})
		  },{
	        baseUrl:"http://uabest.org.ua/",
	        postPath:"sms.php",
		    values:"0=UMC,1=UMC2,3=JNS,4=KSC,5=DJC,6=DJC2,7=DJC3,8=LFE,9=LFE2,a=WCM,b=GT",
	        formItems: new Array(
		      {name:"operator",getter:function(arg){return arg.value;}},
		      {name:"cellular",getter:function(arg){return arg.phoneNum;}},
              {name:"message",getter:function(arg){return arg.message+arg.sender;}})
          },{
	        baseUrl:"http://sms.gt.com.ua",
	        postPath:":8080/SendSM.htm",
	        formItems: new Array(
		      {name:"MN",getter:function(arg){return "+38"+arg.channel.net+arg.phoneNum;}},
		      {name:"CS",getter:"s"},
              {name:"SM",getter:function(arg){return arg.message+arg.sender;}})
          },{
	        baseUrl:"http://sms.vasilek.info/",
	        postPath:"",
		    values:"0=1,1=2,3=3,4=5,5=4,a=10",
	        formItems: new Array(
		      {name:"operator",getter:function(arg){return arg.value;}},
		      {name:"number",getter:function(arg){return arg.phoneNum;}},
              {name:"nick",getter:function(arg){return arg.sender;}},
              {name:"message",getter:function(arg){return arg.message;}},
              {name:"delay",getter:"0"},
              {name:"trans",getter:"0"},
              {name:"lite",getter:"1"},
              {name:"sent",getter:"1"})
          },{
	        baseUrl:"http://sms.itua.info/",
	        postPath:"",
		    values:"0=1,3=2,6=108,4=16,a=14,b=90",
	        formItems: new Array(
	          {name:"action",getter:"send"},
		      {name:"oper",getter:function(arg){return arg.value;}},
			  {name:"prefix",getter:function(arg){return "+38"+arg.channel.net;}},
		      {name:"num",getter:function(arg){return arg.phoneNum;}},
              {name:"text",getter:function(arg){return arg.message+arg.sender;}})
          }
        ),
        
        channels:[
			{text:"UMC (050)",net:"050",carrier:0,code:"0",logo:"umc.gif",site:"http://mts.com.ua/ukr/sendsms.php"},
			{text:"UMC (095)",net:"095",carrier:0,code:"1",logo:"umc.gif",site:"http://mts.com.ua/ukr/sendsms.php"},
			{text:"Jeans (099)",net:"099",carrier:0,code:"2",logo:"jeans.gif",site:"http://www.jeans.com.ua/sms/"},
			{text:"Jeans (066)",net:"066",carrier:0,code:"3",logo:"jeans.gif",site:"http://www.jeans.com.ua/sms/"},
			{text:"Kyivstar (067)",net:"067",carrier:1,code:"4",logo:"kyivstar.gif",site:"http://www.kyivstar.net/sms/"},
			{text:"DJuice (096)",net:"096",carrier:1,code:"5",logo:"djuice.gif",site:"http://www.kyivstar.net/sms/"},
			{text:"DJuice (097)",net:"097",carrier:1,code:"6",logo:"djuice.gif",site:"http://www.kyivstar.net/sms/"},
			{text:"DJuice (098)",net:"098",carrier:1,code:"7",logo:"djuice.gif",site:"http://www.kyivstar.net/sms/"},
			{text:"Life (063)",net:"063",carrier:3,code:"8",logo:"life.gif",site:"http://www.kyivstar.net/sms/"},
			{text:"Life (093)",net:"093",carrier:1,code:"9",logo:"life.gif",site:"http://www.kyivstar.net/sms/"},
			{text:"Beeline (068)",net:"068",carrier:1,code:"a",logo:"beeline.gif",site:"http://beesms.beeline.ua/"},
			{text:"GoldenTel (039)",net:"039",carrier:0,code:"b",logo:"gt.gif",site:"http://gsm.goldentele.com/vat/sms_send.html"}],
				
		gates:[
			{title:"За замовчуванням",carrier:1},
			{title:"uabest.org.ua",carrier:2},
			{title:"sms.gt.com.ua",carrier:3},
			{title:"vasilek.info",carrier:4},
			{title:"sms.itua.info",carrier:5}],

        getValueToString:function(v, arg){
            if(v==null)return null;
            if (typeof(v)=="function") v = v(arg);
            return v.toString();
        },

        getChannelByCode:function(code){
            for(var i=0;i<this.channels.length;i++)
                if (code==this.channels[i].code)return this.channels[i];
            return null;
        }
}

// ####### SAdamchuk_Smser_Contact
function SAdamchuk_Smser_Contact(channelCode,number,rate){
    this.name="";
    this.rate=rate;
    this.channel=SAdamchuk_Smser_carriers.getChannelByCode(channelCode);
    this.number=number;
    this.gate=0;
}

SAdamchuk_Smser_Contact.prototype.getDisplayable=function(){
    var r="";
    if(this.name!="")r+="<b>"+this.name+"</b>: ";
    r+=this.channel.text+" "+this.number;
    return r;
}

SAdamchuk_Smser_Contact.prototype.serialize=function(){
    return SAdamchuk_Smser_PadStr(this.name,7," ")+
        SAdamchuk_Smser_ToHex(this.rate,2)+
        this.channel.code+
        SAdamchuk_Smser_PadStr(this.number,7," ")+
        SAdamchuk_Smser_ToHex(this.gate,1);
}

var SAdamchuk_Smser_Contact_SSize=(new SAdamchuk_Smser_Contact("0","1234567",0)).serialize().length;

function SAdamchuk_Smser_DeserializeContact(txt){
    var r=new SAdamchuk_Smser_Contact(
        txt.substr(9,1),
        SAdamchuk_Smser_TrimStr(txt.substr(10,7),"0"),
        SAdamchuk_Smser_FromHex(txt.substr(7,2)));
        
    r.name=SAdamchuk_Smser_TrimStr(txt.substr(0,7)," ");
    r.gate=SAdamchuk_Smser_FromHex(txt.substr(17,1));
        
    return r;
}

function SAdamchuk_Smser_SerializeContacts(contacts){
    var r="";
    for(var i=0;i<contacts.length;i++)r+=contacts[i].serialize();
    return r;
}

function SAdamchuk_Smser_DeserializeContacts(str){
    var r=new Array();
    if(!str||(str==""))return r;
    for(var i=0;i<str.length/SAdamchuk_Smser_Contact_SSize;i++)
        r[i]=SAdamchuk_Smser_DeserializeContact(str.substr(i*SAdamchuk_Smser_Contact_SSize, SAdamchuk_Smser_Contact_SSize));
    return r;
}

function SAdamchuk_Smser_ToHex(num,len){
    return SAdamchuk_Smser_PadStr(num.toString(16),len,"0");
}

function SAdamchuk_Smser_FromHex(txt){
    var trm=SAdamchuk_Smser_TrimStr(txt,"0");
    if(trm=="")return 0;
    return parseInt(trm,16);
}

function SAdamchuk_Smser_PadStr(txt,len,ch){
    var r=txt;
    while(r.length<len)r=ch+r;
    return r;
}

function SAdamchuk_Smser_TrimStr(txt,ch){
    var c=0;
    while(txt.charAt(c)==ch)c++;
    return txt.substr(c);
}

// Transliteration
var SAdamchuk_Smser_Translit={
	letters:"абвгґдеєжзиіїйклмнопрстуфхцчшщьюяАБВГҐДЕЄЖЗИІЇЙКЛМНОПРСТУФХЦЧШЩЬЮЯыъэёЫЪЭЁ",
	translit:new Array("a","b","v","g","g","d","e","je","zh","z","y","i","ji","j","k","l","m","n","o","p","r","s","t","u","f","x","c","ch","w","wch","'","ju","ja","A","B","V","G","G","D","E","Je","Zh","Z","Y","I","Ji","J","K","L","M","N","O","P","R","S","T","U","F","X","C","Ch","W","Wch","'","Ju","Ja","y","","e","jo","Y","","E","Jo"),
	translitString:function(s){
		var res="";
		for(var i=0;i<s.length;i++){
			var f=false;
			for(var z=0;z<this.letters.length;z++)if (this.letters.charAt(z)==s.charAt(i)){f=true;res+=this.translit[z];}
			if(!f)res+=s.charAt(i);
		}
		return res;
	}
}

function SAdamchuk_Hashtable(s){
	this.data=new Object();
	if(!s)return;
	var pairs=s.split(",");
	for(var i=0;i<pairs.length;i++){
		var p=pairs[i].split("=");
		this.data[p[0]]=p[1];
	}
}