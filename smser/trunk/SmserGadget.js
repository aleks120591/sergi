registerNamespace("SAdamchuk.MSGadgets.SmserGadget");

SAdamchuk.MSGadgets.SmserGadget = function(p_elSource, p_args, p_namespace)
{
	SAdamchuk.MSGadgets.SmserGadget.initializeBase(this, arguments);
	
	var m_view;
	
	this.Output = function()
	{	
		//m_view=SAdamchuk_Smser_View(p_elSource,p_args.module);
		//SAdamchuk_Smser_Controller.initialize(m_view,null);
		p_elSource.innerHTML="<table width=\"290px\"><tr><td>        <div><img src=\"tabmain.gif\" class=\"activeTab\" alt=\"Головна\" id=\"mainTabHeader\" onclick=\"javascript:SetPage('main');\"/><img src=\"tabopt.gif\" id=\"optTabHeader\" class=\"tab\" alt=\"Опції\" onclick=\"javascript:SetPage('opt');\"/><img src=\"tabhlp.gif\" class=\"tab\" alt=\"Довідка\" id=\"helpTabHeader\" onclick=\"javascript:SetPage('help');\"/><img src=\"tabcont.gif\" class=\"tab\" id=\"contTabHeader\" alt=\"Контакти\" onclick=\"javascript:SetPage('cont');\"/></div>        <div id=\"mainPage\" class=\"page\">            <table><tr>        <td valign=\"middle\"><img src=\"logos/umc.gif\" alt=\"Лого оператора\"/>&nbsp;<select class=\"control\" style=\"width:120px\"><option value=\"0\">UMC (050)</option><option value=\"1\">UMC (095)</option><option value=\"2\">Jeans (099)</option><option value=\"3\">Jeans (066)</option><option value=\"4\">Kyivstar (067)</option><option value=\"5\">Kyivstar (096)</option><option value=\"6\">Kyivstar (097)</option><option value=\"7\">Kyivstar (098)</option><option value=\"8\">GoldenTel1 (039)</option><option value=\"9\">Kyivstar (063)</option><option value=\"a\">Life (093)</option><option value=\"b\">GoldenTel2 (039)</option><option value=\"c\">Welcome (068)</option><option value=\"d\">Beeline (068)</option></select></td>        <td align=\"right\"><input class=\"textField\" type=\"text\" maxlength=\"7\" value=\"Номер\"/></td>     </tr>     <tr>        <td colspan=\"2\">            <textarea class=\"control\" cols=\"29\" rows=\"6\" style=\"width:257px\">Введіть ваше повідомлення</textarea>        </td>     </tr>     <tr>        <td>Кількість символів: <span>0</span></td>        <td align=\"right\"><input type=\"text\" class=\"textField\" value=\"Підпис\"/></td>     </tr>     <tr>        <td style=\"overflow:hidden;height:50px;\">&nbsp;&nbsp;&nbsp;<img src=\"wait30.gif\" style=\"cursor:pointer;\" alt=\"Код\"/></td>        <td align=\"right\"><input id=\"captchaInput\" type=\"text\" class=\"textField\" maxlength=\"5\" value=\"<<Код\"/></td>     </tr></table>    <div id=\"buttonsBlock\">        <input value=\"Очистити\" type=\"button\" class=\"button\"/>        <input value=\"Відправити\" type=\"button\" class=\"button\"/>    </div>    <iframe src=\"http://www.umc.ua/ukr/sendsms.php\" style=\"display: none;\"></iframe>    </div>    <div id=\"helpPage\" class=\"hiddenPage\">        Дякуємо, що скористались нашим ґаджетом. Якщо у вас виникли запитання чи труднощі, будь ласка перейдіть на сторінку <a href=\"#\">частих питань</a>.    </div>    <div id=\"optPage\" class=\"hiddenPage\">        Тут колись будуть опції :)    </div>    <div id=\"contPage\" class=\"hiddenPage\">        Сторіночка для наших контактів    </div></td></tr></table>";
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