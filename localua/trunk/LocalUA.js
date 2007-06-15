registerNamespace("SAdamchuk.MSGadgets.LocalUA");

SAdamchuk.MSGadgets.LocalUA = function(p_elSource, p_args, p_namespace) {
    // always call initializeBase before anything else!
	SAdamchuk.MSGadgets.LocalUA.initializeBase(this, arguments);

    // setup private member variables
	var m_this = this;
	var m_el = p_elSource;
	var m_module = p_args.module;
	var m_preferenceKey = "prefRegion";
	var m_regions=new Array(
	    {reg:"Київ", w:"204", f:"9or"},
	    {reg:"Вінниця", w:"110", f:"9cr"},
	    {reg:"Дніпропетровськ", w:"199", f:"9cr"},
	    {reg:"Донецьк", w:"173", f:"9cr"},
	    {reg:"Житомир", w:"160", f:"9cr"},
	    {reg:"Івано-Франкіськ", w:"148", f:"9cr"},
	    {reg:"Кіровоград", w:"143", f:"9cr"},
	    {reg:"Луганськ", w:"193", f:"9cr"},
	    {reg:"Луцьк", w:"109", f:"9cr"},
	    {reg:"Львів", w:"128", f:"9cr"},
	    {reg:"Миколаїв", w:"192", f:"9cr"},
	    {reg:"Одеса", w:"123", f:"9cr"},
	    {reg:"Полтава", w:"121", f:"9cr"},
	    {reg:"Рівне", w:"118", f:"9cr"},
	    {reg:"Севастополь", w:"139", f:"9cr"},
	    {reg:"Сімферополь", w:"138", f:"9cr"},
	    {reg:"Суми", w:"116", f:"9cr"},
	    {reg:"Тернопіль", w:"111", f:"9cr"},
	    {reg:"Ужгород", w:"189", f:"9cr"},
	    {reg:"Харків", w:"196", f:"9cr"},
	    {reg:"Херсон", w:"153", f:"9cr"},
	    {reg:"Хмельницький", w:"152", f:"9cr"},
	    {reg:"Черкаси", w:"186", f:"9cr"},
	    {reg:"Чернігів", w:"183", f:"9cr"},
	    {reg:"Чернівці", w:"180", f:"9cr"});
	var m_regSelector;


	/****************************************
	**          initialize Method
	****************************************/
    // initialize is always called immediately after your object is instantiated
	this.initialize = function(p_objScope)
	{
	    // always call the base object's initialize first!	
		SAdamchuk.MSGadgets.LocalUA.getBaseMethod(this, "initialize", "Web.Bindings.Base").call(this, p_objScope);
        
        var regId=0;
        var prefValue = m_module.getPreference(m_preferenceKey);
            
        if (prefValue != null)
        {
            regId=prefValue;
        }
        LoadData(regId);
	};
	SAdamchuk.MSGadgets.LocalUA.registerBaseMethod(this, "initialize");
	
	
	/****************************************	
	**           dispose Method
	****************************************/
	this.dispose = function(p_blnUnload) {
	    m_regSelector.detachEvent("onchange", RegionChanged);
	    
	    m_this = null;
	    m_el = null;
	    m_module = null;  
	    m_preferenceKey=null;
	    m_regions=null;
	    m_regSelector=null;
	    
        // always call the base object's dispose last!	
		SAdamchuk.MSGadgets.LocalUA.getBaseMethod(this, "dispose", "Web.Bindings.Base").call(this, p_blnUnload);
	};
	SAdamchuk.MSGadgets.LocalUA.registerBaseMethod(this, "dispose");

	/****************************************
	** Other Methods
	****************************************/
	function LoadData(regId)
	{
	    m_el.align="center";
	    m_el.innerHTML="";
	    var div=document.createElement("div");
	    var strBldr = new Web.StringBuilder();
	    strBldr.append("<a href='http://www.meteoprog.com.ua/ua/table.php?cityid=");
	    strBldr.append(m_regions[regId].w);
	    strBldr.append("&days=4' target='_blank'><img src='http://www.meteoprog.com.ua/inform/informers/pic/1-");
	    strBldr.append(m_regions[regId].w);
	    strBldr.append("-ukraine-ua-.png'/></a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;");
	    strBldr.append("<a href='http://finance.ua/' target='_blank'><img src='http://content.finance.ua/cgi-bin/fip.cgi?currency=usd/uah&source=");
	    strBldr.append(m_regions[regId].f);
	    strBldr.append("&lang=ua'/></a><br/>");
	    
	    div.innerHTML=strBldr.toString();
	    m_el.appendChild(div);
	    
	    m_regSelector=document.createElement("select");
	    m_regSelector.id="region_select";
	    for(var i=0;i<m_regions.length;i++){
	        var opt=new Option(m_regions[i].reg)
	        opt.value=i.toString();
	        m_regSelector.options[i]=opt;
	    }
	    m_regSelector.selectedIndex=regId;
	    m_regSelector.onchange=function(){
	      var newReg=m_regSelector.selectedIndex;
	      m_module.setPreference(m_preferenceKey, newReg);
	      LoadData(newReg);
	    };
	    
	    m_el.appendChild(m_regSelector);
	}
};
SAdamchuk.MSGadgets.LocalUA.registerClass("SAdamchuk.MSGadgets.LocalUA", "Web.Bindings.Base");
