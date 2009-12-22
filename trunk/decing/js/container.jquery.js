boompoll.container = {
	serviceUrl: document.location.protocol + "//" + document.location.host+"/api",
	
	setup: function(definition) {
		this.makeRequest(
				"post",
				this.pollCreated,				
				boompoll.entities.enhancePollSetupDto,
				definition);
	},
	
	retrieve: function() {		
		this.makeRequest(
				"get",
				this.pollRetrieved,				
				boompoll.entities.enhanceAccessInfo);
	},
	
	vote: function(selection) {
		this.makeRequest(
				"put",
				this.pollRetrieved,				
				boompoll.entities.enhanceAccessInfo,
				selection);
	},
	
	isPollDefined: function(){
		return this._getAccessKey();
	},	
	
	makeRequest: function(
			operation, 
			successHandler, 
			preparer,
			input){
		
		if (!successHandler){
			return;
		}
		
		var params = {
				key: this._getAccessKey(),
				method: operation
			};
		if (input) params.data = $.toJSON(input);
		var me = this;
		var request = {
			url: this.serviceUrl,
			data:params,
			type: "post",
			dataType: "json",
			complete: function(req){
				if (req.status == boompoll.httpCodes.SC_OK){
					var obj = $.evalJSON(req.responseText);
					if (successHandler){
						if (preparer) {obj=preparer(obj);}
						successHandler.fire.call(successHandler, me, obj);
						me._processTimer.call(me, obj);
					}
					if (operation == "post"){
						this.defaultDefinition = undefined;
						this.isKeyInactual = false;
					}
				}
				else if (me.errorOccured) {
					var validationData = null;
					if (req.status == boompoll.httpCodes.SC_BAD_REQUEST) {
						validationData = $.evalJSON(req.responseText);
					}
					me.errorOccured.fire.call(me.errorOccured, me, req.status, validationData);
				}
			}
		};
		$.ajax(request);
	},
	
	adjustHeight: function(){
		// Doing nothing
	},
	
	/**
	 * Specify collection to only allowed participant names
	 * If this returns null then any participants are allowed
	 */
	getOnlyParticipants: function(){
		return null;
	},
	
	getDefaultDefinition: function(){
		if (!this.defaultDefinition){
			this.defaultDefinition = {
				subject: "",
				decision: "MAXIMAL",
				areVotersOptions: false,
				options: [],
				gemsCount: 1,
				participants: [{ name: "", weight: 1 }, { name: "", weight: 1}]
			};
		}
		
		return this.defaultDefinition;
	},
	
	returnToCreation: function(definition){
		this.isKeyInactual = true;
		this.defaultDefinition = definition;
		this._clearTimer();
		return true;
	},
	
	_getAccessKey: function(){
		if (this.isKeyInactual){
			return null;
		}
		
		var search = document.location.search;
		var qpos = search.indexOf('?');
		
		if (qpos >=0) {
			return search.substr(qpos+1);
		}
		else {
			return null;
		}
	},
	
	_processTimer: function(accessInfo){
		if (!this._getAccessKey()){
			return;
		}
		
		if (accessInfo.result){
			this._clearTimer();
			return;
		}
		var cont = this;
		if (!this.timer){
			this.timer = setInterval(function(){
				cont.retrieve();
			}, 5000);
		}
	},
	
	_clearTimer: function(){
		if (this.timer){
			clearTimeout(this.timer);
		}
	}
};