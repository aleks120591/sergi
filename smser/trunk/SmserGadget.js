registerNamespace("SAdamchuk.MSGadgets.SmserGadget");

SAdamchuk.MSGadgets.SmserGadget = function(p_elSource, p_args, p_namespace)
{
	SAdamchuk.MSGadgets.SmserGadget.initializeBase(this, arguments);
	
	var m_view;
	
	this.Output = function()
	{	
	    p_elSource.align="center";
		m_view=SAdamchuk_Smser_View(p_elSource,p_args.module,1,"Дякуємо, що скористались нашим ґаджетом. Якщо у вас виникли запитання чи труднощі, будь ласка перейдіть на сторінку <a href=\"http://sendsms.com.ua/faq.htm\" target=\"_blank\">частих питань</a>.");
		
		/*var txt=document.createElement("textarea");
		txt.value=p_elSource.innerHTML;
		p_elSource.appendChild(txt);*/
		
		SAdamchuk_Smser_Controller.initialize(m_view,null);
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
	    
	    SAdamchuk.MSGadgets.SmserGadget.getBaseMethod(this, "dispose", "Web.Bindings.Base").call(this, p_blnUnload);
	}
	SAdamchuk.MSGadgets.SmserGadget.registerBaseMethod(this, "dispose");
}
SAdamchuk.MSGadgets.SmserGadget.registerClass("SAdamchuk.MSGadgets.SmserGadget", "Web.Bindings.Base");