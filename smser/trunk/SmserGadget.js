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
	    m_smser.initialize(Web.Browser.isIE(),m_captchaImg);
		
		m_smser.refreshCaptcha();
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
	    
	    SAdamchuk.MSGadgets.SmserGadget.getBaseMethod(this, "dispose", "Web.Bindings.Base").call(this, p_blnUnload);
	}
	SAdamchuk.MSGadgets.SmserGadget.registerBaseMethod(this, "dispose");
	    
    function SendSms()
    {
        m_smser.sendSms(m_captchaInput.value);
    }
}
SAdamchuk.MSGadgets.SmserGadget.registerClass("SAdamchuk.MSGadgets.SmserGadget", "Web.Bindings.Base");