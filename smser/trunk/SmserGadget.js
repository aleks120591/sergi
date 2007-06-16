registerNamespace("SAdamchuk.MSGadgets.SmserGadget");

SAdamchuk.MSGadgets.SmserGadget = function(p_elSource, p_args, p_namespace)
{
	SAdamchuk.MSGadgets.SmserGadget.initializeBase(this, arguments);
	
	var m_this = this;
	var m_el = p_elSource;
	var m_captchaInput;
	var m_captchaImg;
	var m_smser;
	
	this.Output = function()
	{
		m_captchaImg = document.createElement("img");
		m_el.appendChild(m_captchaImg);
		
		m_captchaInput = document.createElement("input");
		m_captchaInput.id="captchaInput";
		m_captchaInput.type="text";
		m_el.appendChild(m_captchaInput);
		
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
	    m_smser.initialize(SAdamchuk_Smser_Req,m_captchaImg);
		
		try{
		    m_smser.refreshCaptcha();
		}
		catch(ex){
		    m_el.innerHTML=ex;
		}
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
	    
	    m_smser.dispose();
	    m_smser=null;
	    
	    SAdamchuk_Smser_Req.dispose();
	    SAdamchuk_Smser_Req=null;
	    
	    SAdamchuk.MSGadgets.SmserGadget.getBaseMethod(this, "dispose", "Web.Bindings.Base").call(this, p_blnUnload);
	}
	SAdamchuk.MSGadgets.SmserGadget.registerBaseMethod(this, "dispose");
	    
    function SendSms()
    {
        m_smser.sendSms(m_captchaInput.value);
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