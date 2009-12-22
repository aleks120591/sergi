/**
 * @constructor
 * @extends View_Template
 */
boompoll.View_Create = function(elem) {
	this.constructor = boompoll.View_Create;
	
	// TODO These properties should be class properties but not instance props
	this._minOptionsCount = 2;
	this._maxOptionsCount = 50;
	this._minUsersCount = 2;
	this._maxUsersCount = 50;
	
	boompoll.View_Template.call(this, elem);	
};

boompoll.View_Create.prototype = new boompoll.View_Template();
boompoll.View_Create.template = boompoll.templates.creating.create;

/**
* Display validation messages by tabs
* @param errors hash with number of tab like key and array of messages for display
*/
boompoll.View_Create.prototype.display_validation = function(errors) {
	for (var tab in errors) {
		$("li#hdr_tab" + tab, this.element).append("<span class='ui-icon ui-icon-alert' style='float:right'/>");
		var jValidDiv = $("#tab" + tab + "_validation", this.element).empty();
		jQuery.each(errors[tab], function() {
			jValidDiv.append(document.createTextNode(this));
			jValidDiv.append("<br />");
		});
	}
};

/**
* Remove validation messages and icons from tabs
*/
boompoll.View_Create.prototype.clear_validation = function() {
	var me = this;
	$.each([1, 2, 3, 4, 5], function() {
		$("li#hdr_tab" + this + " .ui-icon", me.element).remove();
		$("#tab" + this + "_validation", me.element).empty();
	});
};

/**
* 
* @return {string} subject text 
*/
boompoll.View_Create.prototype.get_subject = function() {
	return $("#subject", this.element).val();
};

/**
* 
* @return {int} number of gems
*/
boompoll.View_Create.prototype.get_gems_count = function() {
	if ($('#use_gems', this.element).attr('checked')) {
		return $("#gems_count", this.element).val();
	}
	return 1;
};

/**
* 
* @return {bool} flag is participants will be used like options
*/
boompoll.View_Create.prototype.get_votersOptions = function() {
	return $("#votersOptions", this.element).get(0).checked;
};

/**
* 
* @return {array} of {string} - options 
*/
boompoll.View_Create.prototype.get_options = function() {
	if (this.get_votersOptions()) {
		return new Array();
	}
	var jOptionsTable = $("#options", this.element);
	var options = new Array();
	$("tbody tr td input", jOptionsTable).each(function() {
		options.push(this.value);
	});
	return options;
};

/**
* 
* @return {array} of {array} of {string}.
* Example:
* 		[["user1", "20"], ["user 2", "30"]]
*/
boompoll.View_Create.prototype.get_participants = function() {
	var jUsersTable = $("#participants", this.element);
	var users = new Array();
	var weightFlag = $("#showWeight", this.element).get(0).checked;
	$("tbody tr", jUsersTable).each(function() {
		if ($('.poll-cb-participant', this).attr('checked')){
			var p = {
				name: $(".bp-input-participant", this).val(),
				weight: weightFlag ? $(".bp-input-participant-weight", this).val() : 1
			};
			users.push(p);
		}
	});
	return users;
};

/**
* Assign event handlers for internal view operations and for controller events
* 
* @return nothing
* @type void
*/
boompoll.View_Create.prototype._assignEvents = function() {
	var me = this;
	//external save event handler - for controller
	$("#button_save", me.element).click(function() {
		me.clear_validation.call(me);
		me._onSaveButtonClick.call(me);
	});
	
	// Needed for wave to adjust height
	$('#tabs', this.element).bind('tabsshow', function(){
		boompoll.container.adjustHeight();
		me._setWeightsUsing.call(me);
	});

	var jOptionsTable = $("#options", me.element);
	// check VotersOptions event handler
	$("#votersOptions", me.element).click(function() {
		me._setAreVotersOptions.call(me);
	});

	// add option event handler
	$("#add_option", me.element).click(function() {
		if (!me.get_votersOptions.call(me) &&
				jOptionsTable.get(0).tBodies[0].rows.length < me._maxOptionsCount) {
			var jNewRow = $("tbody tr:first", jOptionsTable).clone(true).appendTo(jOptionsTable);
			$("input", jNewRow).val("").effect("highlight", null, 1500).get(0).focus();
			boompoll.container.adjustHeight();
		}
	});
	
	// delete option event handler
	$(".poll-icon-option-del.poll-button", jOptionsTable).click(function() {
		if (!me.get_votersOptions.call(me)) {
			if (jOptionsTable.get(0).tBodies[0].rows.length > me._minOptionsCount) {
				$(this).closest("tr").remove();
			}
		}
	});	

	var jUsersTable = $("#participants", me.element);
	
	$("#showWeight", me.element).click(function(){
		me._setWeightsUsing.call(me);
	});

	// add users event handler
	$("#add_user", me.element).click(function() {
		if (jUsersTable.get(0).tBodies[0].rows.length < me._maxUsersCount) {
			me._appendParticipant.call(me, {
				checked: true,
				name: "",
				weight: 1
			}, jUsersTable).
				find(".bp-input-participant").
				effect("highlight", null, 1500).
				get(0).
				focus();
			
			me._setWeightsUsing.call(me);
			boompoll.container.adjustHeight();
		}
	});
	
	$('#select_all', this.element).click(function(){
		$(".poll-cb-participant", jUsersTable).attr("checked", "checked");
	});
	
	$('#select_none', this.element).click(function(){
		$(".poll-cb-participant", jUsersTable).removeAttr("checked");
	});	

	//advanced - gems count radio
	$("#use_gems", me.element).click(function() {
		me._setGemsUsing.call(me);
		boompoll.container.adjustHeight();
	});
	
	$("#button_clear", me.element).click(function() {
		$("#subject", me.element).val("");
		$(".poll-cb-participant", me.element).attr("checked", "checked");
		if (!$("#app_target").hasClass('wave-gadget')){
			$(".bp-input-participant", me.element).val("");
		}
		$(".bp-input-participant-weight", me.element).val("1.0");
		$("#showWeight", me.element).removeAttr("checked");
		$("#options input", me.element).val("");
		$("#votersOptions", me.element).removeAttr("checked");
		$("#use_gems", me.element).removeAttr("checked");
		$("#gems_count", me.element).val("100");
		me._setWeightsUsing.call(me);
		me._setGemsUsing.call(me);
		me._setAreVotersOptions.call(me);
	});
};

boompoll.View_Create.prototype.init = function() {
	$("#gems_count", this.element).spinner({min: 2, max: 9999});
	this.initWidgets();
	$("#tabs", this.element).tabs();
};

/**
* Populate data to controls
* @return void
*/
boompoll.View_Create.prototype.populate = function(definition) {
	$("#subject", this.element).val(definition.subject);

	if (definition.gemsCount == 1) {
		$("#use_gems", this.element).removeAttr("checked");
	}
	else {
		$("#use_gems", this.element).attr("checked", "checked");
		$("#gems_count", this.element).val(definition.gemsCount);
	}	
	this._setGemsUsing();

	$("#votersOptions", this.element).get(0).checked = definition.areVotersOptions;

	var jOptionsTable = $("#options", this.element);
	$("*", jOptionsTable).attr("disabled", definition.areVotersOptions);

	if (definition.options.length >= this._minOptionsCount) {
		//populate first static rows
		for (i = 0; i < this._minOptionsCount; i++) {
			$("tbody tr:eq(" + i + ") td input", jOptionsTable).val(definition.options[i]);
		}
		// for other options we need create rows
		for (i = 2; i < definition.options.length; i++) {
			var jNewRow = $("tbody tr:first", jOptionsTable).clone(true).appendTo(jOptionsTable);
			$("input", jNewRow).val(definition.options[i]);
		}
	}
	else {
		if (definition.options.length == 1) {
			$("tbody tr:first td input", jOptionsTable).val(definition.options[0]);
		}
	}

	var jUsersTable = $("#participants", this.element);
	
	var pc = $("#participants_container", this.element);
	
	var allOne = true;
	for(var i in definition.participants){
		if (definition.participants[i].weight != 1){
			allOne = false;
			break;
		}
	}
	
	if (allOne){
		pc.addClass("no-weight");
		$("#showWeight", this.element).removeAttr("checked");
	}
	
	var allowed = boompoll.container.getOnlyParticipants();
	
	if (allowed){
		pc.addClass("wave-gadget");
		$(".bp-input-participant", pc).attr("readonly", "readonly");
	}
	
	var participants = boompoll.View_Create.mergeParticipants(allowed, definition.participants);
	
	for(var i in participants){
		var part = participants[i];
		this._appendParticipant(participants[i], jUsersTable);
	}
	
	this._setWeightsUsing();
	this._setAreVotersOptions();
			
	this._assignEvents();
	boompoll.container.adjustHeight();
};

boompoll.View_Create.prototype._setWeightsUsing = function(){
	var checked = $("#showWeight", this.element).attr("checked");
	$(".poll-column-weight", this.element).toggle(checked);
	if (checked && $("#tabs", this.element).tabs('option', 'selected') == 2){ // Do it if only tab with participants is selected
		$(".bp-input-participant-weight", this.element).spinner({min: 0.01, step: 0.01});
	}
};

boompoll.View_Create.prototype._setGemsUsing = function(){
	$("#gems_count_container", this.element).toggle(
			$("#use_gems", this.element).attr("checked"));
	boompoll.container.adjustHeight();
};

boompoll.View_Create.prototype._setAreVotersOptions = function(){
	var checked = this.get_votersOptions();
	$("#options *", this.element).attr("disabled", checked);
};

boompoll.View_Create.prototype._appendParticipant = function(participant, context){
	var tr = $("<tr>").appendTo($('tbody', context));
	tr.append(boompoll.templates.creating.row_part);
	if (participant.checked){
		$(".poll-cb-participant", tr).attr("checked", "checked");
	}
	$(".bp-input-participant", tr).val(participant.name);
	$(".poll-span-participant", tr).text(participant.name);
	$(".bp-input-participant-weight", tr).
		val(participant.weight);

	var v = this;
	$(".poll-icon-user-del.poll-button", tr).click(function() {
		if ($(this).closest("tbody").get(0).rows.length > v._minUsersCount) {
			$(this).closest("tr").remove();
		}
	});
	
	return tr;
};

boompoll.View_Create.prototype._onSaveButtonClick = function(){
	if (this.saveButtonClick){
		this.saveButtonClick.fire(this);
	}
};

boompoll.View_Create.mergeParticipants = function(allowed, actual){
	for(var i in actual){
		actual[i].checked = true;
	}	
	if (!allowed) {
		return actual;
	}
	var hash = [];
	for(var i in actual){
		hash[actual[i].name] = actual[i]; 
	}
	var res = [];
	for(var i in allowed){
		var n = allowed[i];
		res.push(hash[n] ?
				hash[n]: 
				{
					name: n,
					weight: 1,
					checked: false
				});
	}
	return res;
};