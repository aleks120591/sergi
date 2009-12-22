boompoll.container = {
	serviceUrl: "http://www.decing.com/api",
	
	setup: function(definition) {
		this.makeRequest(
				"post",
				this.pollCreated,
				definition);
	},
	
	retrieve: function() {
		this.makeRequest(
				"get",
				this.pollRetrieved);
	},
	
	vote: function(selection) {
		this.makeRequest(
				"put",
				this.pollRetrieved,
				selection);
	},
	
	isPollDefined: function(){
		if (this.isCreateNewMode){
			return false;
		}
		
		var state = this._loadState();
		if (!state){
			return false;
		}
		
		//alert("Checking poll defined: "+wave.util.printJson(state));
	
		return this._loadState().accessInfo;
	},
	
	getDefaultDefinition: function(){
		var state = this._loadState();
		if (state.definition){
			return state.definition;
		}
		else {
			var p = [];
			var only = this.getOnlyParticipants();
			for(var i in only){
				p.push({
					name:only[i],
					weight: 1});
			}
			
			return {
				subject: "",
				decision: "MAXIMAL",
				areVotersOptions: false,
				options: [],
				gemsCount: 1,
				participants: p
			};
		}
	},
	
	returnToCreation: function(definition){
		if (!confirm("Do you really want to recreate current vote?")){
			return false;
		}
		this.isCreateNewMode = true;
		wave.getState().submitDelta({
			"participants":null,
			"voted":null,
			"result":null
		});
		return true;
	},
	
	makeRequest: function(
			operation, 
			successHandler, 
			input){
		this.isCreateNewMode = false;
		if (!successHandler) return;
		
		var state = this._loadState();
		
		if (operation == "get" || operation == "put"){
			this.syncAccessInfo();
			
			if (!state.accessKey){
				return;
			}
		}
		
		var postdata = {method: operation};
		if (state.accessKey) postdata.key = state.accessKey;
		if (input) postdata.data = gadgets.json.stringify(input);		
		
		var params = {};
		params[gadgets.io.RequestParameters.CONTENT_TYPE] = gadgets.io.ContentType.TEXT;
		params[gadgets.io.RequestParameters.METHOD] = gadgets.io.MethodType.POST;
		params[gadgets.io.RequestParameters.POST_DATA]= gadgets.io.encodeValues(postdata);
		
		var cont = this;
		gadgets.io.makeRequest(this.serviceUrl, function(obj) {
			//alert("Server response: "+wave.util.printJson(obj));
			var text = obj.text;
			var statusCode = obj.rc;
			var json = null;
			try{
				json = gadgets.json.parse(text);
			}catch(e){
				wave.log("Failed to parse request result: "+text);
			}
			if (statusCode == boompoll.httpCodes.SC_OK){
				if (operation == "get" || operation == "put"){
					cont._serviceResponseAccessInfo.call(cont, json);
				}
				
				if (operation == "post"){
					cont._serviceResponseCreated.call(cont, json);
				}
			}
			else {
				cont._onError.call(cont, statusCode, json);
			}		
		}, params); 
	},
	
	syncAccessInfo: function(){
		var state = this._loadState();		
		
		//alert("Loaded state: "+wave.util.printJson(state));
		
		if (state.accessInfo){
			this._onAccessInfoRetrieved(state.accessInfo);
		}
	},
	
	adjustHeight: function(){
		gadgets.window.adjustHeight();
	},
	
	getOnlyParticipants: function(){
		var res = [];
		var guys = wave.getParticipants();
		for(var i in guys){
			res.push(guys[i].getDisplayName()+" ("+guys[i].getId()+")");
		}
		return res;
	},
	
	_serviceResponseAccessInfo: function(accessInfo){
		// this._onAccessInfoRetrieved(accessInfo); - event will be raised after we change state
		
		var delta = {};
		var changed = false;
		var cur = this._loadState();
		
		if (accessInfo.voted.length > cur.accessInfo.voted.length){
			delta.voted = gadgets.json.stringify(accessInfo.voted);
			changed = true;
		}
		
		if (accessInfo.result && !cur.accessInfo.result){
			delta.result = gadgets.json.stringify(accessInfo.result);
			changed = true;			
		}
		
		if (changed){
			wave.getState().submitDelta(delta);
		}
	},
	
	_serviceResponseCreated: function(pollSetupDto){
		var keys = pollSetupDto.keys;
		var participants = {};
		for(var key in keys){
			participants[boompoll.container._getWaveIdFromVoterName(key)] = keys[key];
		}
		var delta = {
			participants: gadgets.json.stringify(participants),
			definition: gadgets.json.stringify(pollSetupDto.definition),
			voted: "[]"
		};
		//alert("Saving state: "+wave.util.printJson(delta));
		wave.getState().submitDelta(delta);
	},
	
	_loadState: function() {
		var state = wave.getState();
		if (!state){
			return null;
		}
		
		var viewer = wave.getViewer();
		var id = viewer.getId();
		var info = {};
		
		var def = state.get("definition");
		if (def){
			info.definition = gadgets.json.parse(def);
		}
		
		var p = state.get("participants");
		if (p){
			info.accessKey = gadgets.json.parse(p)[id];
			
			var voted = gadgets.json.parse(state.get("voted"));
			
			var ai = {
				key: info.accessKey,
				definition: info.definition,
				voted: voted
			};
			
			var res = state.get("result");
			
			if (res){
				ai.result = gadgets.json.parse(res);
			}
			
			ai.key = info.accessKey;
			for(var i in info.definition.participants){
				var voter = info.definition.participants[i].name;
				if (id == this._getWaveIdFromVoterName(voter)){
					ai.voter = voter;
					break;
				}
			}
			
			info.accessInfo = ai;
		}
		
		return info;
	},
	
	_getWaveIdFromVoterName: function(voterName){
		var p = voterName.lastIndexOf('(');
		return voterName.substr(p+1, voterName.length-p-2);
	},
	
	_onAccessInfoRetrieved: function(accessInfo){
		if (this.pollRetrieved){
			obj = boompoll.entities.enhanceAccessInfo(accessInfo);
			//alert("Access info event: "+wave.util.printJson(accessInfo));
			this.pollRetrieved.fire.call(this.pollRetrieved, this, accessInfo);
		}
	},
	
	_onError: function(statusCode, data){
		if (this.errorOccured){
			this.errorOccured.fire.call(this.errorOccured, this, statusCode, data);
		}
	}
};