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
		* @param {Class} reqClass Class that represents object which will be sent to a service.
		* @param {Class} respClass Class that represents responce object from a service.
		* @param {Adapter} [adapter] Optional adapter object.
		*/
		registerProtocol : function(name, reqClass, respClass, adapter){
			this._protocols[name] = {
				reqC: reqClass, 
				respC: respClass, 
				adapter: adapter ? adapter : mashape.adapters.defaultAdapter};
		},
		registerSerializer : function(className, descriptor){
			_serializers[className] = new mashape.Serializer(descriptor);
		},
		createInstance : function(className){
			return eval("new "+className+"()");
		},
		_protocols: {},
		_serializers: {} 
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
		* @param {Array} requests a list of requests.
		* @param {Function} [handler] A callback that handles server's response. The handler can be called many times.
		*/		
		sendRequests : function(requests, handler){
			var cntx = new mashape.batchHandlers.RequestContext();
			
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

mashape.batchHandlers.ContainerBatchHandler.prototype = new BatchRequestBuilder();
mashape.batchHandlers.ContainerBatchHandler.prototype.constructor = ContainerBatchHandler;

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

/**
* @constructor
*/
mashape.Serializer = function(descriptor){
	this.descriptor = descriptor;
}

mashape.Serializer.getSerializer = function(className){
	var s = mashape.Registrar._serializers[className];
	if (!s){
		s = this._cache[className] = 
			 
	}
}

mashape.Serializer.serialize = function(className, obj){
	className = className.trim();
	if (className.charAt(0) == "["){
		var ar = [];
	}
}