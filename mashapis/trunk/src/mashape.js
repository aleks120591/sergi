/**
* @fileOverview Implements mashape functionality
*
* Copyright (C) 2007 Sergi Adamchuk (http://sergi.volyn.net)
* Licensed under the Apache License, Version 2.0 (the "License"); 
* you may not use this file except in compliance with the License. 
* You may obtain a copy of the License at 
*
*	http://www.apache.org/licenses/LICENSE-2.0 
*	
* Unless required by applicable law or agreed to in writing, 
* software distributed under the License is distributed on an 
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, 
* either express or implied. See the License for the specific language 
* governing permissions and limitations under the License.
*/

/**
* @ignore
*/
function MashapeEngine(){
	this._protocols = {};
	this._descriptors = {};
}

/**
* @namespace basic namespace for all functionality
* mashape is a global object as well
* @property {Container} container
*/
var mashape = new MashapeEngine();

/*****************************************************************
* mashape.Engine
******************************************************************/

/**
* @class Class contains protocol and classes descriptions.
* @constructor
*/
mashape.Engine = MashapeEngine;

/**
* Registers new protocol
* @param {String} name The name of protocol. This name will be used by client code in method mashape.Main.newRequest.
* @param {String} [reqClassName] Class that represents object which will be sent to a service. Can be null - means any json object is accepted.
* @param {String} [respClassName] Class that represents responce object from a service. Can be null - means any json object is accepted.
* @param {Adapter} [adapter] Optional adapter object.
*/
mashape.Engine.prototype.registerProtocol = function(name, reqClassName, respClassName, adapterClassName){
	this._protocols[name] = {
		reqClass: reqClassName, 
		respClass: respClassName, 
		adapterClass: adapterClassName ? adapterClassName : "mashape.DefaultAdapter"};
}

mashape.Engine.prototype.registerClassDesriptor = function(className, descriptor){
	this._descriptors[className] = descriptor;
}

mashape.Engine.prototype.substituteAdapter = function(protocolName, adapterClassName){
	this._protocols[protocolName].adapterClass = adapterClassName;
}

/**
* Sends a request to service(s)
* @param {BatchRequest} requests a list of requests.
* @param {Function} [handler] A callback that handles server's response. The handler can be called many times.
* @memberOf mashape.Engine
*/		
mashape.Engine.prototype.sendRequests = function(requests, handler){
	var cntx = {};
	
	for(var key in requests.getRequests()){
		var r = requests[key];
		r.status = mashape.Status.REQUESTING;
		var proName = r.protocolName;
		var protocol = this._protocols[proName];
		if (!cntx[protocol.adapterClass]) cntx[protocol.adapterClass] = mashape.createInstance(protocol.adapterClass);
		cntx[protocol.adapterClass].requesting(r, this, key);
	}
	
	for(var key in cntx)
		cntx[key].sending(this, handler);
}

/**
* Converts object to JSON
* @param {Object} obj Object for serialization.
* @param {String} [className] Full name of class.
*/
mashape.Engine.prototype.serialize = function(obj, className){
	if (!className) return obj;
		
	className = mashape.trim(className);
	if (className.charAt(0) == "["){
		className = mashape.trim(className.substring(1,className.length-2));
		if (mashape._isPredefined(className)) return obj;
		var ar = [];
		for(var i in obj)
			ar.push(this.serialize(className, obj[i]));
		return ar;
	}
	else{
		if (mashape._isPredefined(className)) return obj;
		var d = this._descriptors[className];
		if (d){
			var res = {};
			for(var i in d){
				var propName = d[i], 
					pos = propName.indexOf(":");
				if (pos<0){
					res[propName] = obj[propName];
				}
				else{
					var propClassName = mashape.trim(propName.substr(pos+1));
					propName = mashape.trim(propName.substr(0, pos));
					res[propName] = this.serialize(propClassName, obj[propClassName]);
				}
			}
			return res;
		}
	}
}

mashape.Engine.prototype.deserialize = function(json, className){
	if (!className) return json;
	
	
}

/*****************************************************************
* mashape
******************************************************************/

/**
* Creates new namspace
* @param {String} fullName Namespace, items are separated by dot.
* @memberOf mashape
*/
mashape.registerNamespace = function(fullName){
	var s = fullName.split(".");
	var cur = window, nx;
	for(var i=0;i<s.length;i++){
		var cs=s[i];
		nx = cur[cs];
		if (!nx) cur[cs] = {};
		cur = cur[cs];
	}
}

mashape.createInstance = function(className){
	return eval("new "+className+"()");
}

/**
* Trims whitespaces at the begin and at the end of a string value end returns trimmed string.
* @param {String} str Namespace, items are separated by dot.
* @return {String} Trimmed string value.
* @memberOf mashape
*/
mashape.trim = function(str){
	return str.replace(/(^\s+)|(\s+$)/g, "");
}

/**
* Loads an api
* @param {String} apiName Loads an api by its name.
* @param {String} [version] Version to be loaded. If this parameter is omitted the last stable version will be loaded.
*/
mashape.loadApi = function(apiName, version){
	throw mashape.exceptions.NOT_IMPLEMENTED;
}

/**
* @private
*/
mashape._predefinedTypes = ["STRING", "NUMBER", "BOOL", "OBJECT"];

/**
* @private
*/
mashape._isPredefined = function(cn){
	for(var i in mashape._predefinedTypes)
		if  (mashape._predefinedTypes[i] == cn.toUpperCase()) return true;
	return false;
}
/*****************************************************************
* mashape.BatchRequest
******************************************************************/
	
/**
* @class Helps to build a batch of requests.
* @constructor
*/
mashape.BatchRequest = function(){
	this._requests = {};
}

/**
* Adds new request to the batch
* @param {Request} request Request object.
* @param {String} key Key for identifying the request in the batch.
* @memberOf mashape.BatchRequest
*/
mashape.BatchRequest.prototype.add = function(request, key){
	this._requests[key] = request;
};

mashape.BatchRequest.prototype.getRequests = function(){
	return this._requests;
}

/*****************************************************************
* mashape.exceptions
******************************************************************/

/**
* @namespace Holds predefined exception
*/
mashape.exceptions = {};

mashape.exceptions.NOT_IMPLEMENTED = "The feature is not implemented.";
mashape.exceptions.NOT_SUPPORTED = "The feature is not supported.";

/*****************************************************************
* mashape.RequestContext
******************************************************************/
mashape.RequestContext = function(){}

mashape.RequestContext.prototype.hasItem = function(key){
	return this[key] != undefined;
}

mashape.RequestContext.prototype.getItem = function(key){
	return this[key].batch;
}

mashape.RequestContext.prototype.setItem = function(key, batch, callback){
	this[key] = {batch : batch, sender : callback};
}

/*****************************************************************
* mashape._Adapter
******************************************************************/

mashape._Adapter = function(){}

mashape._Adapter.prototype.clone = function(){
	var r = new mashape._Adapter();
	for(var k in this)
		r[k] = this[k];
	return r;
}

mashape._Adapter.prototype.override = function(obj){
	var r = this.clone();
	for(var k in obj)
		r[k] = obj[k];
	return r;
}

/**
* @name RequestHandler
* @description 
*/

/**
* @name requesting
* @function
* @param {mashape.Request} request
* @param {mashape.Engine} engine
* @memberOf mashape.Adapter
*/

/**
* @name sending
* @function
* @param {mashape.Engine} engine
* @memberOf mashape.Adapter
*/

/*****************************************************************
* mashape.adapter
******************************************************************/

mashape.adapter = new mashape._Adapter();

mashape.adapter.scope = "mashape.container";

mashape.adapter.requesting = function(context, request, engine, key){
	var batch, key = this.getBatchKey(request);
	if (context.hasItem(key)){
		batch = context.getItem(key);
	}
	else{
		batch = this.createNewBatch();
		context.setItem(key, batch, this.sending);
	}
	var protocol = engine._protocols[request.protocolName];
	var data = engine.serialize(request.data, protocol.reqClass);
	this.add(mashape.container.newRequestJson(data), key);
}

mashape.adapter.getBatchKey = function(req){
	return this.scope+(req.serviceUrl ? req.serviceUrl : "");
}

mashape.adapter.createNewBatch = function(){
	return new mashape.BatchRequest();
}

/**
* @class Default adapter for requests
* @inherits mashape.Adapter
* @inherits mashape.BatchReuest
*/
mashape.DefaultAdapter = function(){}

mashape.DefaultAdapter.prototype = new mashape.BatchRequest();

mashape.DefaultAdapter.prototype.requesting = function(request, engine, key){
	var protocol = engine._protocols[request.protocolName];
	var data = engine.serialize(request.data, protocol.reqClass);
	this.add(mashape.container.newRequestJson(data), key);
}

mashape.DefaultAdapter.prototype.sending = function(engine, callback){
	mashape.container.sendBatch(this, callback);
}

/*****************************************************************
* mashape.Status
******************************************************************/

/**
* Enumeration of statuses for requests
* @static
*/
mashape.Status = {
	UNSTARTED : 0,
	SUCCESSED : 1,
	FAILED : 2,
	REQUESTING : 3
}

/*****************************************************************
* mashape.Request
******************************************************************/

/**
* @class Request object
* @constructor
* @property {Object} data Request data.
* @property {Object} reqsponse Response data.
* @property {mashape.Status} status Current status of the request.
* 
*/
mashape.Request = function(protocolName, arg){
	this.data = arg;
	this.status = mashape.Status.UNSTARTED;
	this.response = null;
	this.protocolName = protocolName;
	this.serviceUrl = mashape.container.serviceUrl;
}

mashape.Request.prototype.to = function(serviceUrl){
	this.serviceUrl = serviceUrl;
	return this;
}

mashape.Request.prototype.adapt = function(adapter){
	this.adapter = adapter;
	return this;
}

/**
* @namespace Holds basic implemented apis
*/
mashape.apis = {}