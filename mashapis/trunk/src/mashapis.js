var mashapis = {
	Manager : {
		registerNamespace : function(fullName){
			var s = fullName.split(".");
			var cur = window, nx;
			for(var i=0;i<s.length;i++){
				var cs=s[i];
				nx = cur[cs];
				if (!nx) cur[cs] = {};
				cur = cur[cs];
			}
		},
		registerProtocol : function(apiName, version, inputClass, outputClass){
		}
	}
//		registerProtocol : function(apiName, version, inputClass, outputClass){
//		},
//		registerSerializer : function(aClass, descriptor){
//		},
}