registerNamespace("SAdamchuk.MSGadgets.SmserGadget");

SAdamchuk.MSGadgets.SmserGadget = function(p_elSource, p_args, p_namespace)
{
	SAdamchuk.MSGadgets.SmserGadget.initializeBase(this, arguments);
	
	var m_this = this;
	var m_el = p_elSource;
	var m_captchaInput;
	var m_captchaImg;
	
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
		
		var req = Web.Network.createRequest(
            Web.Network.Type.XMLGet,
            "http://www.umc.ua/ukr/sendsms.php",
            m_captchaImg,
            CaptchaLoaded);

        req.execute();
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
	    
	    SAdamchuk.MSGadgets.SmserGadget.getBaseMethod(this, "dispose", "Web.Bindings.Base").call(this, p_blnUnload);
	}
	SAdamchuk.MSGadgets.SmserGadget.registerBaseMethod(this, "dispose");
	
	function CaptchaLoaded(response)
    {
        if ( response.status == 200 )
        {
            var re = new RegExp("INPUT TYPE=\"hidden\" name=\"PHPSESSID\" value=\"([^\"]+)\"");
			var code=response.responseText.match(re)[1];
			m_captchaImg.src="http://www.umc.ua/back/modules/sms/sms_picture2.php?PHPSESSID="+code;
        }
    }
    
    function SendSms()
    {
        var aObjHeaders = new Array();
        aObjHeaders["Content-Type"] = "application/x-www-form-urlencoded";
        
    }
}
SAdamchuk.MSGadgets.SmserGadget.registerClass("SAdamchuk.MSGadgets.SmserGadget", "Web.Bindings.Base");