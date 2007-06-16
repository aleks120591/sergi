registerNamespace("SAdamchuk.MSGadgets.SmserGadget");

SAdamchuk.MSGadgets.SmserGadget = function(p_elSource, p_args, p_namespace)
{
	SAdamchuk.MSGadgets.SmserGadget.initializeBase(this, arguments);
	
	var m_this = this;
	var m_el = p_elSource;
	var m_captchaInput;
	var m_captchaImg;
	
	var m_channel;
	var m_number;
	var m_message;
	var m_sender;
	
	var m_smser;
	
	this.Output = function()
	{	
		m_channel=document.createElement("select");
		for(var i=0;i<SAdamchuk_Smser_carriers.channels.length;i++){
		    var c=SAdamchuk_Smser_carriers.channels[i];
		    if (!c.hidden){
		        var opt=new Option(c.text);
		        opt.value=i.toString();
		        m_channel.options[i]=opt;
		    }
		}
		m_el.appendChild(m_channel);
		
		m_number=document.createElement("input");
		m_number.type="text";
		m_el.appendChild(m_number);
		m_el.appendChild(document.createElement("br"));
		
		m_message=document.createElement("textarea");
		m_el.appendChild(m_message);
		m_el.appendChild(document.createElement("br"));
		
		m_captchaImg = document.createElement("img");
		m_el.appendChild(m_captchaImg);
		
		m_captchaInput = document.createElement("input");
		m_captchaInput.id="captchaInput";
		m_captchaInput.type="text";
		m_el.appendChild(m_captchaInput);

		
		m_el.appendChild(document.createElement("br"));
		
		m_sender=document.createElement("input");
		m_sender.type="text";
		m_el.appendChild(m_sender);
		
		var buttonSend=document.createElement("input");
		buttonSend.type="button";
		buttonSend.value="Send";
		buttonSend.onclick=SendSms;
		/*Web.Bindings.attachElementBindingSync(
            buttonSend,
            Start.FancyButton,
            m_this);*/
				
	    m_el.appendChild(buttonSend);
	    
	    m_smser=SAdamchuk_Smser;
	    m_smser.initialize(SAdamchuk_Smser_MSReq,m_captchaImg);
		
		try{
		    m_smser.refreshCaptcha();
		}
		catch(ex){
		    m_el.innerHTML=ex;
		}
		
		AdjustCurChannel();
		
		m_channel.onchange=function(){AdjustCurChannel();};
	}
	SAdamchuk.MSGadgets.SmserGadget.registerBaseMethod(this, "Output");
		
    
	this.initialize = function(p_objScope)
	{
		SAdamchuk.MSGadgets.SmserGadget.getBaseMethod(this, "initialize", "Web.Bindings.Base").call(this, p_objScope);
		this.Output();
	}
	SAdamchuk.MSGadgets.SmserGadget.registerBaseMethod(this, "initialize");
	
	this.dispose = function(p_blnUnload)
	{
	    m_this=null;
	    m_el=null;
	    m_captchaInput=null;
	    m_captchaImg=null;
	    
	    m_channel=null;
	    m_number=null;
	    m_message=null;
	    m_sender=null;
	    
	    m_smser.dispose();
	    m_smser=null;
	    
	    SAdamchuk_Smser_Req.dispose();
	    SAdamchuk_Smser_Req=null;
	    
	    SAdamchuk.MSGadgets.SmserGadget.getBaseMethod(this, "dispose", "Web.Bindings.Base").call(this, p_blnUnload);
	}
	SAdamchuk.MSGadgets.SmserGadget.registerBaseMethod(this, "dispose");
	    
    function SendSms(){
        m_smser.sendSms(
            m_number.value,
            m_message.value,
            m_sender.value,
            m_captchaInput.value);
    }
    
    function AdjustCurChannel(){
        m_smser.setCurrentChannel(parseInt(m_channel.value));
    }
}
SAdamchuk.MSGadgets.SmserGadget.registerClass("SAdamchuk.MSGadgets.SmserGadget", "Web.Bindings.Base");

var SAdamchuk_Smser_Req={
    req:null,
    callback:null,
    
    sendRequest:function(url,callback){
        this.req=null;
        if (window.XMLHttpRequest){
          this.req = new XMLHttpRequest();
        } else if (window.ActiveXObject){
          this.req = new ActiveXObject("Microsoft.XMLHTTP");
        }
        
        if (!this.req) throw "Не вдалось створити запит.";
        
        try{
            this.req.open("get",url,true);
        }
        catch(ex){
            throw "Виникла помилка при спробі відкрити з'єднання: "+ex.message
        }
        
        this.req.onreadystatechange=function(){
            if (SAdamchuk_Smser_Req.req.readyState==4)
            {
                if ((SAdamchuk_Smser_Req.req.status==200)||(SAdamchuk_Smser_Req.req.status==0)){
                    SAdamchuk_Smser_Req.callback(SAdamchuk_Smser_Req.req.responseText);
                }
                else{
                    throw "Помилка при одержанні коду з сервера: "+SAdamchuk_Smser_Req.req.statusText;
                }
            }
        }
        this.callback=callback;
        this.req.send();
    },
    
    dispose:function(){
        req=null;
        callback=null;
    }
}

var SAdamchuk_Smser_MSReq={
    req:null,
    callback:null,
    
    sendRequest:function(url,callback){
        this.req = Web.Network.createRequest(
            Web.Network.Type.XMLGet,
            url,
            null,
            function(response){
               if (response.status == 200)
                SAdamchuk_Smser_MSReq.callback(response.responseText);
            });

        this.callback=callback;
        this.req.execute();
    },
    
    dispose:function(){
        req=null;
        callback=null;
    }
}