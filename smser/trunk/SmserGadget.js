registerNamespace("SAdamchuk.MSGadgets.SmserGadget");

SAdamchuk.MSGadgets.SmserGadget = function(p_elSource, p_args, p_namespace)
{
	SAdamchuk.MSGadgets.SmserGadget.initializeBase(this, arguments);
	
	var m_view;
	var m_pers;
	
	this.Output = function()
	{	
	    p_elSource.align="center";
		m_view=SAdamchuk_Smser_View(
			p_elSource,
			p_args.module,
			null,
			"Для нормальної роботи в Internet Explorer вам потрібно <a href='http://sendsms.com.ua/content/view/18/28/#cookiesie' target='_blank'>дозволити кукі</a> для деяких сайтів.<br/>Для відправки повідомлень на Київстар через email шлюзи, абонентам потрібно <a href='http://www.kyivstar.net/faq/sms/' target='_blank'>активізувати послугу</a>.<br/>Якщо у вас виникли запитання чи труднощі, будь ласка перейдіть на сторінку <a href=\"http://sendsms.com.ua/faq\" target=\"_blank\">частих питань</a>.");
		
		/*var txt=document.createElement("textarea");
		txt.value=p_elSource.innerHTML;
		p_elSource.appendChild(txt);*/
		m_pers=new SAdamchuk_Smser_Persister(p_args.module);
		SAdamchuk_Smser_Controller.initialize(m_view,m_pers,p_args.module.getMode()==Web.Gadget.Mode.author);
		p_args.module.Resize()
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
	    SAdamchuk_Smser_Controller.dispose();
	    SAdamchuk_Smser_Controller=null;
   	    m_view.dispose();
	    m_view=null;
	    m_pers.dispose();
	    m_pers=null;
	    
	    SAdamchuk.MSGadgets.SmserGadget.getBaseMethod(this, "dispose", "Web.Bindings.Base").call(this, p_blnUnload);
	}
	SAdamchuk.MSGadgets.SmserGadget.registerBaseMethod(this, "dispose");
}
SAdamchuk.MSGadgets.SmserGadget.registerClass("SAdamchuk.MSGadgets.SmserGadget", "Web.Bindings.Base");


function SAdamchuk_Smser_Persister(module){
    this.module=module;
}

SAdamchuk_Smser_Persister.prototype.dispose=function(){
    this.module=null;
}

SAdamchuk_Smser_Persister.prototype.getContacts=function(){
    return SAdamchuk_Smser_DeserializeContacts(this.module.getPreference("cnt"));
}

SAdamchuk_Smser_Persister.prototype.getSenderName=function(){
    var res=this.module.getPreference("snd");
    if(!res)return "";
    return res;
}

SAdamchuk_Smser_Persister.prototype.getGateType=function(){
    var res=this.module.getPreference("gat");
    if(!res)return 0;
    return res;
}

SAdamchuk_Smser_Persister.prototype.save=function(contacts,senderName){
    this.module.setPreference("snd",senderName);
    this.module.setPreference("cnt",SAdamchuk_Smser_SerializeContacts(contacts));
}

SAdamchuk_Smser_Persister.prototype.saveGateType=function(gateType){
	this.module.setPreference("gat",gateType);
}