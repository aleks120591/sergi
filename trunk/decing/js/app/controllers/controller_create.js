/**
 * @constructor
 */
boompoll.Controller_Create = function(application, target) {
	this._app = application;
	this._target = target;
	this._viewEditor = new boompoll.View_Create(this._target);
	
	boompoll.container.pollCreated = new boompoll.Event_Handler(this, this._pollCreated);
	boompoll.container.pollRetrieved = new boompoll.Event_Handler(this, this._pollRetrieved);
	boompoll.container.errorOccured = new boompoll.Event_Handler(this, this._savingError);
};

boompoll.Controller_Create.prototype.start = function() {
	this._app.loggerEmpty();
	this._viewEditor.load();
	this._viewEditor.init();
	this._viewEditor.populate(boompoll.container.getDefaultDefinition());
	this._viewEditor.saveButtonClick = new boompoll.Event_Handler(this, this.save_click);
};

boompoll.Controller_Create.prototype.save_click = function(view) {
	this._app.blockUi();
	var pollDef = {
		subject: view.get_subject(),
		decision: "MAXIMAL",
		areVotersOptions: view.get_votersOptions(),
		options: view.get_options(),
		gemsCount: view.get_gems_count(),
		participants: view.get_participants()
	};
	view.clear_validation();
	boompoll.container.setup(pollDef);
};

boompoll.Controller_Create.prototype._pollCreated = function(service, setupDto){
	this._app.unblockUi.call(this._app);
	this._app.loggerEmpty();
	var res_view = new boompoll.View_Save_Result(this._target);
	res_view.load();
	res_view.createNew = this._app.generateCreateNewEventHadler();
	res_view.populateData(setupDto);
	boompoll.container.pollRetrieved = null;
};

boompoll.Controller_Create.prototype._pollRetrieved = function(){
	// Restart application - mode changed
	this._app.start();
};

boompoll.Controller_Create.prototype._savingError = function(service, statusCode, validationData){
	this._app.unblockUi.call(this._app);
	if (statusCode == boompoll.httpCodes.SC_BAD_REQUEST) {
		//ValidationErrorsDto
		var errorsView = {};
		/*
		Group error messages by tabs
		prepare data for display like hash
		tab : [errors]
		Example =>
	
		{
		1 : [msg1, msg2],
		4 : [msg1]
		}
		*/
		var validationMessages = boompoll.regional.get('createValidation');
		for (var key in validationData) {
			var tabInd = validationMessages[key][0];
			if (typeof (errorsView[tabInd]) == "undefined") {
				errorsView[tabInd] = [];
			}
			errorsView[tabInd].push(validationMessages[key][1]);
		}
		this._viewEditor.display_validation(errorsView);
		this._app.logError.call(this._app, "Provided data is not valid. Please fix.");
	}
	else {
		this._app.logHttpError(statusCode);
	}
	
	boompoll.container.adjustHeight();
};