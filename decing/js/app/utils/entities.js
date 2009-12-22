boompoll.entities = {
	enhanceAccessInfo : function(ai){
		boompoll.entities.enhanceDefinition(ai.definition);
	
		ai.didVoted = function(voter){
			for(var i in this.voted){
				if (this.voted[i] == voter){
					return true;
				}
			}
			return false;
		};
		
		return ai;
	},
	enhanceDefinition : function(def){
		if (def.areVotersOptions) {
			def.actualOptions = [];
			for(var i in def.participants){
				def.actualOptions.push(def.participants[i].name);
			}
		}
		else {
			def.actualOptions = def.options;
		}
		
		def.isOneGem = (def.gemsCount == 1);
		def.areNonStandardWeighs = false;
		for(var i in def.participants){
			if (def.participants[i].weight != 1){
				def.areNonStandardWeighs = true;
				break;
			}
		}
		
		return def;
	},
	enhancePollSetupDto : function(s){
		boompoll.entities.enhanceDefinition(s.definition);
		return s;
	}
};