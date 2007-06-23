﻿registerNamespace("SAdamchuk.MSGadgets.SmserGadget");

SAdamchuk.MSGadgets.SmserGadget = function(p_elSource, p_args, p_namespace)
{
	SAdamchuk.MSGadgets.SmserGadget.initializeBase(this, arguments);
	
	var m_view;
	var m_pers;
	
	this.Output = function()
	{	
	    p_elSource.align="center";
		m_view=SAdamchuk_Smser_View(p_elSource,p_args.module,null,"Якщо у вас виникли запитання чи труднощі, будь ласка перейдіть на сторінку <a href=\"http://sendsms.com.ua/faq.htm\" target=\"_blank\">частих питань</a>.");
		
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

SAdamchuk_Smser_Persister.prototype.getSenderEmail=function(){
    var res=this.module.getPreference("eml");
    if(!res)return "";
    return res;
}

SAdamchuk_Smser_Persister.prototype.getGateType=function(){
    var res=this.module.getPreference("gat");
    if(!res)return 0;
    return res;
}

SAdamchuk_Smser_Persister.prototype.save=function(contacts,senderName,senderEmail){
    this.module.setPreference("snd",senderName);
    this.module.setPreference("cnt",SAdamchuk_Smser_SerializeContacts(contacts));
    this.module.setPreference("eml",senderEmail);
}

SAdamchuk_Smser_Persister.prototype.saveGateType=function(gateType){
	this.module.setPreference("gat",gateType);
}