var SAdamchuk_Smser={
    requester:null,
    captchaReq:null,
    captchaImg:null,
    captchaInternalCode:null,
    curentChannel:0,
    
    initialize:function(requester,captchaImg){
        this.requester=requester;
        this.captchaImg=captchaImg;
    },

    dispose:function(){
        this.captchaReq=null;
        this.captchaInternalCode=null;
        this.requester=null;
        
        SAdamchuk_Smser=null;
        SAdamchuk_Smser_carriers=null;
    },

    refreshCaptcha:function(){
        this.requester.sendRequest(this.getCurrentCarrier().captchaProcessor.getUrl,function(txt){
            SAdamchuk_Smser.captchaInternalCode=SAdamchuk_Smser.getCurrentCarrier().captchaProcessor.internalCodeExtractor(txt);
            SAdamchuk_Smser.captchaImg.src=SAdamchuk_Smser.getCurrentCarrier().captchaProcessor.imageSourceBuilder(SAdamchuk_Smser.captchaInternalCode);
        });
    },
       
    sendSms:function(number,message,sender,captcha){
        newWin=window.open("about:blank", "_blank");
        var frm=newWin.document.createElement("form");
        frm.method="post";
	    var senderProc=this.getCurrentCarrier().sendProcessor;
	    frm.action=senderProc.postFormUrl
	    for(var i=0;i<senderProc.formItems.length;i++){
	        var field=newWin.document.createElement("input");
	        field.type="hidden";
	        field.name=senderProc.formItems[i].name;
	        field.value=SAdamchuk_Smser_carriers.getValueToString(senderProc.formItems[i].getter,
	            {captcha:captcha,
	            captInternal:SAdamchuk_Smser.captchaInternalCode,
	            channel:SAdamchuk_Smser_carriers.channels[this.curentChannel],
	            phoneNum:number,
	            message:message,
	            sender:sender});
	        frm.appendChild(field);
	    }
	    
        newWin.document.body.appendChild(frm);
        frm.submit();
    },
    
    getCurrentCarrier:function(){
        return SAdamchuk_Smser_carriers.carriers[SAdamchuk_Smser_carriers.channels[this.curentChannel].carrier];
    },
        
    setCurrentChannel:function(channelId){
        var oldCarrierId=SAdamchuk_Smser_carriers.channels[this.curentChannel].carrier;
        this.curentChannel=channelId;
        if(oldCarrierId!=SAdamchuk_Smser_carriers.channels[channelId].carrier)this.refreshCaptcha();
    }
}

var SAdamchuk_Smser_carriers={
    carriers:new Array({
	    name: "umc",
	    captchaProcessor : {
		    getUrl : "http://www.umc.ua/ukr/sendsms.php",
		    internalCodeExtractor: function(html){
			    var re = new RegExp("INPUT TYPE=\"hidden\" name=\"PHPSESSID\" value=\"([^\"]+)\"");
			    return html.match(re)[1];
		    },
		    imageSourceBuilder: function(interCode){
			    return "http://www.umc.ua/back/modules/sms/sms_picture2.php?PHPSESSID="+interCode;
		    }
	    },
	    sendProcessor: 
	    {
		    type: "PostForm",
		    postFormUrl: "http://www.umc.ua/back/modules/sms/db_sms.php",
		    formItems: new Array(
			  {name: "PHPSESSID",
			  getter: function(arg) {return arg.captInternal;}
			  },
			  {name: "script",
			  getter: "/ukr/sendsms.php"
			  },
			  {name: "sms_tag_id",
			  getter: "3"
			  },
			  {name: "network1",
			  getter: function(arg) {return arg.channel.value;}
              },
              {name: "phone1",
              getter: function(arg) {return arg.phoneNum;}
              },
              {name: "message",
              getter: function(arg) {return arg.message;}
              },
              {name: "anti",
              getter: function(arg) {return arg.captcha;}
              },
              {name: "translit",
              getter: "1"
              },
              {name: "sender_name",
              getter: function(arg) {return arg.sender;}
              })}},
      {name: "kyivstar",
        captchaProcessor : {
            getUrl : "http://www.kyivstar.net/_sms.html",
            internalCodeExtractor: function(html){},
            imageSourceBuilder: function(code){
	            return "http://www.kyivstar.net/sms_code_image.gif?fjgkdfljg="+Math.random();
            }
        },
        sendProcessor: 
        {
            type: "PostForm",
            postFormUrl: "http://www.kyivstar.net/_sms.html",
            formItems: new Array(
                {name: "submitted",
                getter: "true"
                },
                {name: "lang",
                getter: "ua"
                },
                {name: "lat",
                getter: "1"
                },
                {name: "mobcode",
                getter: function(arg) {return arg.channel.value;}
                },
                {name: "number",
                getter: function(arg) {return arg.phoneNum;}
                },
                {name: "message",
                getter: function(arg) {return arg.message+arg.sender;}
                },
                {name: "antispam",
                getter: function(arg) {return arg.captcha;}
          })}}
        ),
        
        channels:new Array(
			{text:"UMC (050)",
			carrier:0,
			value:"UMC",
			hidden:false},
			
			{text: "UMC (095)",
			carrier:0,
			value: "UMC095",
			hidden:false},
			
			{text: "Jeans (099)",
			carrier:0,
			value: "UMC099",
			hidden:false},
			
			{text: "Jeans (066)",
			carrier:0,
			value: "JEANS",
			hidden:false},
			
			{text: "Kyivstar (067)",
			carrier:1,
			value: "067",
			hidden:false},
			
			{text: "Kyivstar (096)",
			carrier:1,
			value: "096",
			hidden:false},
			
			{text: "Kyivstar (097)",
			carrier:1,
			value: "097",
			hidden:false},
			
			{text: "Kyivstar (098)",
			carrier:1,
			value: "098",
			hidden:false},
			
			{text: "GoldenTel1 (039)",
			carrier:1,
			value: "039",
			hidden:false},
			
			{text: "Kyivstar (063)",
			carrier:1,
			value: "063",
			hidden:false},
			
			{text: "Life (093)",
			carrier:1,
			value: "093",
			hidden:false},
			
			{text: "GoldenTel2 (039)",
			carrier:0,
			value: "GT",
			hidden:false},
			
			{text: "Welcome (068)",
			carrier:0,
			value: "WC",
			hidden:false},
			
			{text: "Beeline (068)",
			carrier:2,
			value: "38068",
			hidden:false}
		),
        
        getValueToString:function(v, arg){
            if (typeof(v)=="function") v = v(arg);
            return v.toString();}
}