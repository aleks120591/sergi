registerNamespace("SAdamchuk.MSGadgets.SmserGadget");

SAdamchuk.MSGadgets.SmserGadget = function(p_elSource, p_args, p_namespace)
{
	SAdamchuk.MSGadgets.SmserGadget.initializeBase(this, arguments);
	
	var m_view;
	
	this.Output = function()
	{	
		m_view=SAdamchuk_Smser_View(p_elSource,p_args.module);
		SAdamchuk_Smser_Controller.initialize(m_view,null);
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