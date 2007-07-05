var smsSender_About={
	getAddon : function(){
		var em = Components.classes["@mozilla.org/extensions/manager;1"].getService(Components.interfaces.nsIExtensionManager);
		return em.getItemForID("{44F072D8-86A9-454B-80DC-86C34FA3B243}");
	},
	
	onLoad : function(e){
		//e.sizeToContent();
		this.addon=this.getAddon();
		var curText=document.getElementById("smsab-version").getAttribute("value");
		document.getElementById("smsab-version").setAttribute("value", curText+this.addon.version);
	}
}

window.addEventListener("load", function(e) { smsSender_About.onLoad(e); }, false);