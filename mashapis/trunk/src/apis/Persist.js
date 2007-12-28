/**
* @namespace
*/
mashape.apis.persist = {}

/*****************************************************************
* mashape.apis.persist.UserParameter
******************************************************************/
mashape.apis.persist.UserParameter = function(userId,key,appId){
	this.userId = userId;
	this.key = key;
	this.appId = appId;
}

mashape.apis.persist.SetParameter = function(param, value){
	this.param = param;
	this.value = value;
}

mashape.apis.persist.PersistHandler = function(){
	own = {};
	external = {};
}

mashape.apis.persist.PersistHandler.prototype.requesting = function(request, engine, key){
	var protocol = engine._protocols[request.protocolName];
	var data = engine.serialize(request.data, protocol.reqClass);
	switch(request.protocolName){
		case "mashape.apis.persist.setParameter": 
			this[key] = {param : data.param, val : data.value};
			break;
		case "mashape.apis.persist.getParameter":
			this[key] = {param : data, val : null};
			break;
		default: throw "Cannot handle protocol "+request.protocolName;
	}
}

mashape.apis.persist.PersistHandler.prototype.sending = function(engine, callback){
	mashape.container.sendBatch(this, callback);
}

mashape.registerClassDescipotor("mashape.apis.persist.UserParameter", ["userId : String", "key : String"]);
mashape.registerClassDescipotor("mashape.apis.persist.SetParameter", ["param : mashape.apis.persist.UserParameter", "value : Object"]);
mashape.registerProtocol("mashape.apis.persist.getParameter", "mashape.apis.persist.UserParameter", null, "mashape.apis.persist.PersistHandler");
mashape.registerProtocol("mashape.apis.persist.setParameter", "mashape.apis.persist.SetParameter", null, "mashape.apis.persist.PersistHandler");