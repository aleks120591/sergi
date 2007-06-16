var SAdamchuk_Smser={
    requester:null,
    captchaReq:null,
    captchaImg:null,
    captchaInternalCode:null,
    
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
        this.requester.sendRequest("http://www.umc.ua/ukr/sendsms.php",function(txt){
            var re = new RegExp("INPUT TYPE=\"hidden\" name=\"PHPSESSID\" value=\"([^\"]+)\"");
            SAdamchuk_Smser.captchaInternalCode = txt.match(re)[1];
            SAdamchuk_Smser.captchaImg.src="http://www.umc.ua/back/modules/sms/sms_picture2.php?PHPSESSID="+SAdamchuk_Smser.captchaInternalCode;            
        });
    },
    
    sendSms:function(captcha){
        newWin=window.open("about:blank", "_blank");
        var frm=newWin.document.createElement("form");
        frm.method="post";
	    frm.action="http://www.umc.ua/back/modules/sms/db_sms.php";
	    var sender=SAdamchuk_Smser_carriers.carriers[0].sendProcessor;
	    for(var i=0;i<sender.formItems.length;i++){
	        var field=newWin.document.createElement("input");
	        field.type="hidden";
	        field.name=sender.formItems[i].name;
	        field.value=SAdamchuk_Smser_carriers.getValueToString(sender.formItems[i].getter, 
	            {captcha:captcha,
	            captInternal:SAdamchuk_Smser.captchaInternalCode});
	        frm.appendChild(field);
	    }
	    
        newWin.document.body.appendChild(frm);
        frm.submit();
    }
}

var SAdamchuk_Smser_carriers={
    carriers:new Array({
	    name: "umc",
	    captchaProcessor : {
		    getUrl : "http://www.umc.ua/ukr/sendsms.php",
		    internalCodeExtractor: function(html){
			    var re = new RegExp("INPUT TYPE=\"hidden\" name=\"PHPSESSID\" value=\"([^\"]+)\"");
			    SmsSender.captchaInternalCode = html.match(re)[1];
			    SmsSender.getcaptchaCodeInput().value = "";
		    },
		    imageSourceBuilder: function(){
			    return "http://www.umc.ua/back/modules/sms/sms_picture2.php?PHPSESSID="+SmsSender.captchaInternalCode;
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
			  getter: "UMC"
              },
              {name: "phone1",
              getter: "6077288"
              },
              {name: "message",
              getter: "Test smsser: "+Math.random().toString()
              },
              {name: "anti",
              getter: function(arg) {return arg.captcha;}
              },
              {name: "translit",
              getter: "1"
              },
              {name: "sender_name",
              getter: "// smsser"
              })}}
        ),
        
        getValueToString:function(v, arg){
            if (typeof(v)=="function") v = v(arg);
            return v.toString();}
}