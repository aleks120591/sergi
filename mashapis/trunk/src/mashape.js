/**
* @namespace basic namespace for all functionality
*/
var mashape = {
	Registrar: {
		/**
		* Creates new namspace
		* @param {String} fullName Namespace, items are separated by dot.
		*/
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
		/**
		* Registers new protocol
		* @param {String} name The name of protocol. This name will be used by client code in method mashape.Main.newRequest.
		* @param {String} reqClassName Class that represents object which will be sent to a service. Can be null - means any json object is accepted.
		* @param {String} respClassName Class that represents responce object from a service. Can be null - means any json object is accepted.
		* @param {Adapter} [adapter] Optional adapter object.
		*/
		registerProtocol : function(name, reqClassName, respClassName, adapter){
			this._protocols[name] = {
				reqC: reqClassName, 
				respC: respClassName, 
				adapter: adapter ? adapter : mashape.adapters.defaultAdapter};
		},
		registerClassDesriptor : function(className, descriptor){
			this._descriptors[className] = descriptor;
		},
		createInstance : function(className){
			return eval("new "+className+"()");
		},
		/**
		* Converts object to JSON
		* @param {Object} obj Object for serialization.
		* @param {String} [className] Full name of class.
		*/
		serialize : function(obj, className){
			if (!className) return obj;
			
			if (className.charAt(0) == "["){
				var ar = [];
				for(var i in obj)
					ar.push(this.serialize(className.substring(1,className.length-2), obj[i]));
				return ar;
			}
			else{
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
							var propClassName = propName.substr(pos+1);
							propName = propName.substr(0, pos);
							res[propName] = this.serialize(propClassName, obj[propClassName]);
						}
					}
					return res;
				}
			}
		},
		deserialize : function(json, className){
			if (!className) return json;
			
			
		},
		_protocols: {},
		_descriptors: {} 
	},
	
	Main : {
		/**
		* Loads an api
		* @param {String} apiName Loads an api by its name.
		* @param {String} [version] Version to be loaded. If this parameter is omitted the last stable version will be loaded.
		*/
		load : function(apiName, version){
			throw mashape.exceptions.NOT_IMPLEMENTED;
		},

		/**
		* Sends a request to service(s)
		* @param {Hash} requests a list of requests.
		* @param {Function} [handler] A callback that handles server's response. The handler can be called many times.
		*/		
		sendRequests : function(requests, handler){
			var cntx = new mashape.batchHandlers.RequestContext();
			
			for(var key in requests){
				var r = requests[key];
				var proName = r.protocolName;
				var protocol = mashape.Registrar._protocols[proName]
				mashape.Registrar._protocols[protocol]
			}
			throw mashape.exceptions.NOT_IMPLEMENTED;
		}
	},
		
	/**
	 * Helps to build a batch of requests.
	 * @constructor
	 */
	BatchRequestBuilder : function(){
		this._requests = {};
		/**
		* Adds new request to the batch
		* @param {Request} request Request object.
		* @param {String} key Key for identifying the request in the batch.
		*/
		this.add = function(request, key){
			this._requests[key] = request;
		};
		
		this.build = function(){
			return this._requests;
		}
	},
		
	core : {
		Report : function(message, status){
			this.message = message;
			this.status = status;
		}
	},
	
	exceptions : {
		NOT_IMPLEMENTED : "The feature is not implemented.",
		NOT_SUPPORTED : "The feature is not supported."
	}
}

/**
* The file index.
* @name IBatchHandler
* @constructor
*/

/**
* Adds new request to the batch.
* @name add
* @function
* @memberOf IBatchHandler
*/

/**
* Adds new request to the batch.
* @name send
* @function
* @memberOf IBatchHandler
*/

/**
* @namespace Holds BatchHandlers
*/
mashape.batchHandlers = {};

/**
* BatchHandler for container
* @constructor
*/
mashape.batchHandlers.ContainerBatchHandler = function(){}

mashape.batchHandlers.ContainerBatchHandler.prototype = new mashape.BatchRequestBuilder();
mashape.batchHandlers.ContainerBatchHandler.prototype.constructor = mashape.batchHandlers.ContainerBatchHandler;

mashape.batchHandlers.ContainerBatchHandler.prototype.send = function(){
	this.requests = new mashape.BatchRequestBuilder();
}

/**
* Context of batch requests
* @constructor
*/
mashape.batchHandlers.RequestContext = function(){}

mashape.batchHandlers.RequestContext.prototype.getBatch = function(className){
	if (!this[className]){
		this[className] = mashape.Registrar.createInstance(className);
	}
	return this[className];
}

/**
* @namespace Holds Adapaters
*/
mashape.adapters = {};

mashape.adapters.defaultAdapter = {
	handleRequest : function(request, context){
		context.
		getBatch("mashape.batchHandlers.ContainerBatchHandler").
		add(mashape.container.Transports.newRequestJson(request));
	},
	
	handleSending : function(batch, callback){
		mashape.container.sendBatch(batch, callback);
	}
}

/**
* Enumeration of statuses for requests
* @static
*/
mashape.Status = {
	UNSTARTED : 0,
	SUCCES : 1,
	FAIL : 2,
	PROCESSING : 3,
	HANDLED : 4
}

/**
* Request object
* @constructor
*/
mashape.Request = function(protocolName, arg){
	this.status = mashape.Status.UNSTARTED;
	this.arg = arg;
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