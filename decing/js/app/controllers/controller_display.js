boompoll.Controller_Display = function(app, target) {
	this.app = app;
	this.target = target;
	this.mainView = new boompoll.View_Display(this.target);
	
	boompoll.container.pollRetrieved = new boompoll.Event_Handler(this, this._updateContent);
	boompoll.container.errorOccured = new boompoll.Event_Handler(this, this._serviceError);
};

boompoll.Controller_Display.prototype = {
	start: function() {
		this.mainView.load();
		this.mainView.init();
		this.mainView.createNew = this.app.generateCreateNewEventHadler();
		boompoll.container.retrieve();
	},

	voteSubmit: function(view) {
		this.app.blockUi();
		boompoll.container.vote(view.getSelection());
	},

	_updateContent: function(service, accessInfo) {		
		this.app.unblockUi.call(this.app);
		this.mainView.populate(accessInfo);
		
		var cont = this.mainView.getContentHolder();
				
		if (!accessInfo.result){
			if (this.isVoting && !accessInfo.didVoted(accessInfo.voter)){
				return;
			}
			
			if (accessInfo.didVoted(accessInfo.voter) || !accessInfo.key){
				this.mainView.hideCurrent();
				return;
			}
		}
		
		this.mainView.showCurrent();
			
		this.isVoting = !accessInfo.result;
		
		var viewClass = accessInfo.result ?
				boompoll.View_Result :
				boompoll.View_Voting;
		var view = new viewClass(cont);
		
		if (accessInfo.result){
			this.mainView.removeVoteButton();
		}
		
		//alert("Populating accessinfo: "+wave.util.printJson(accessInfo));
		
		view.load();
		view.populate(accessInfo);
		view.vote_submit = new boompoll.Event_Handler(this, this.voteSubmit);
		
		boompoll.container.adjustHeight();
	},

	_serviceError: function(service, statusCode, problems) {
		this.app.unblockUi.call(this.app);
		if (statusCode == boompoll.httpCodes.SC_BAD_REQUEST) {
			this.app.logValidationErrors(problems, boompoll.regional.get('voteValidation'));
			return;
		}

		if (statusCode != boompoll.httpCodes.SC_OK) {
			this.app.logHttpError(statusCode);
		}
		
		if (statusCode == boompoll.httpCodes.SC_FORBIDDEN){
			$(this.target).
				html("<p class='validator'>Such access key not found.</p>");
		}
	}
};