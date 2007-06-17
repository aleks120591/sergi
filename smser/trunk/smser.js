// ####### SAdamchuk_Smser_Controller
var SAdamchuk_Smser_Controller={
    initialize:function(view,urlResolver,persist){        
        this.view=view;
        this.persist=persist;
        this.model=new SAdamchuk_Smser_Model();
        this.urlResolver=urlResolver;
        
        var handler=function(){SAdamchuk_Smser_Controller.onNewCookies();};
        if (this.view.frame.attachEvent)
    		this.view.frame.attachEvent('onload',handler);
	    else
		    this.view.frame.onload=handler;
		this.view.buttonSend.onclick=function(){SAdamchuk_Smser_Controller.sendSms();};
		this.view.channelSelector.onchange=function(){SAdamchuk_Smser_Controller.adjustChannel();};
        
        this.refreshCaptcha();
    },

    dispose:function(){
        this.model.dispose();
        this.model=null;
        this.persist=null;
        this.urlResolver=null;
    },

    refreshCaptcha:function(){
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
function SAdamchuk_Smser_View(div,urlResolver){
	var res={};
	res.urlResolver=urlResolver;
	res.channelSelector=document.createElement("select");
	for(var i=0;i<SAdamchuk_Smser_carriers.channels.length;i++){
        var opt=new Option(SAdamchuk_Smser_carriers.channels[i].text);
        opt.value=SAdamchuk_Smser_carriers.channels[i].code.toString();
        res.channelSelector.options[i]=opt;
	}
	div.appendChild(res.channelSelector);
	
	res.phoneNumber=document.createElement("input");
	res.phoneNumber.type="text";
	div.appendChild(res.phoneNumber);
	div.appendChild(document.createElement("br"));
	
	res.message=document.createElement("textarea");
	div.appendChild(res.message);
	div.appendChild(document.createElement("br"));
	
	res.captchaImg=document.createElement("img");
	res.captchaImg.width="120";
	res.captchaImg.height="50";
	div.appendChild(res.captchaImg);
	
	res.captcha=document.createElement("input");
	res.captcha.type="text";
	div.appendChild(res.captcha);
	
	div.appendChild(document.createElement("br"));
	
	res.senderName=document.createElement("input");
	res.senderName.type="text";
	div.appendChild(res.senderName);
	
	res.buttonSend=document.createElement("input");
	res.buttonSend.type="button";
	res.buttonSend.value="Send";
    div.appendChild(res.buttonSend);
    
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
        res.urlResolver=null;
    };
    
    res.setWaitingCaptcha=function()
    {
        this.captchaImg.src=urlResolver.resolveUrl("wait30.gif");
        this.captcha.value="";
    };
    
    res.setWaitingCaptcha();
    
    return res;
}

SAdamchuk_Smser_View.prototype.build=function(){
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
			{text:"UMC (050)",carrier:0,value:"UMC",code:"0"},
			{text:"UMC (095)",carrier:0,value: "UMC095",code:"1"},
			{text:"Jeans (099)",carrier:0,value: "UMC099",code:"2"},
			{text:"Jeans (066)",carrier:0,value: "JEANS",code:"3"},
			{text:"Kyivstar (067)",carrier:1,value: "067",code:"4"},
			{text:"Kyivstar (096)",carrier:1,value: "096",code:"5"},
			{text:"Kyivstar (097)",carrier:1,value: "097",code:"6"},
			{text:"Kyivstar (098)",carrier:1,value: "098",code:"7"},
			{text:"GoldenTel1 (039)",carrier:1,value: "039",code:"8"},
			{text:"Kyivstar (063)",carrier:1,value: "063",code:"9"},
			{text:"Life (093)",carrier:1,value: "093",code:"a"},
			{text:"GoldenTel2 (039)",carrier:0,value: "GT",code:"b"},
			{text:"Welcome (068)",carrier:0,value: "WC",code:"c"},
			{text:"Beeline (068)",carrier:2,value: "38068",code:"d"}),
        
        getValueToString:function(v, arg){
            if (typeof(v)=="function") v = v(arg);
            return v.toString();},
            
        getChannelByCode:function(code){
            for(var i=0;i<this.channels.length;i++)
                if (code==this.channels[i].code)return this.channels[i];
            return null;
        }
}