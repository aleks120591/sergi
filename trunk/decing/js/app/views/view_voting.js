/**
 * @constructor
 * @extends View_Template
 */
boompoll.View_Voting = function(elem) {
	boompoll.View_Template.call(this, elem);
	this.constructor = boompoll.View_Voting;
};

boompoll.View_Voting.prototype = new boompoll.View_Template();
boompoll.View_Voting.template = boompoll.templates.display.voting;

boompoll.View_Voting.parseInt = function(value) {
	if (value == null || typeof (value) == "undefined") {
		return NaN;
	}
	var strValue = value.toString();
	if (strValue == "" || $.trim(strValue) == "") {
		return NaN;
	}
	var testRegEx = /^[\+|-]?\d+$/;
	return testRegEx.test(strValue) ? parseInt(strValue, 10) : NaN;
};

boompoll.View_Voting.prototype.populate = function(accessInfo) {
	var me = this;
	var parent = $(this.element).closest("#display");
	parent.addClass("poll-voting");
	$("#button_vote", parent).click(function(){
		me._onVote_Submit.call(me);
	});
	this._populateVotingControls(accessInfo);
	parent.toggleClass("poll-one-gem", accessInfo.definition.isOneGem);
};

boompoll.View_Voting.prototype.getSelection = function(){
	var res = [];
	$('.poll-selection', this.element).each(function(){
		res.push(boompoll.View_Voting.parseInt(this.value));
	});
	return res;
};

boompoll.View_Voting.prototype._populateVotingControls = function(accessInfo){
	var me = this;
	var options = $('#options', this.element); 
	for (var i in accessInfo.definition.actualOptions) {
		var opt = accessInfo.definition.actualOptions[i];
		var tr = $('<tr/>').appendTo(options);
		tr.append(boompoll.templates.display.row_voting);
		var disabled = accessInfo.definition.areVotersOptions && accessInfo.voter == opt;
		var anchor = $("a", tr).text(opt);
		if (disabled){
			$(".poll-selection", tr).attr("disabled", "disabled");
		}
	}
	var selections = $('.poll-selection', options);
	selections.change(function() {
		me._valueChanged.call(me, accessInfo);
	});
	if (!accessInfo.definition.isOneGem){
		selections.spinner({min: 0, max: accessInfo.definition.gemsCount});
	}
	var checks = $('.poll-check', options);
	checks.add("a", options).click(function(){
		var tr = $(this).closest("tr");
		if ($(".poll-selection", tr).attr("disabled")) return;
		me._setAllTo.call(me, tr, accessInfo);		
	});
	if (!accessInfo.definition.isOneGem){
		$('.poll-check', options).hide();
	}
	this._valueChanged(accessInfo);
};

boompoll.View_Voting.prototype._setAllTo = function(tr, accessInfo){
	$('#options .poll-selection', this.element).val(0);	
	$('.poll-selection', tr).val(accessInfo.definition.gemsCount);
	
	if (accessInfo.definition.isOneGem) {
		$('#options .poll-check', this.element).
			removeClass("ui-icon-check").
			addClass("ui-icon-radio-off");
		$('.poll-check', tr).
			removeClass("ui-icon-radio-off").
			addClass("ui-icon-check");
	}
	
	this._valueChanged(accessInfo);
};

boompoll.View_Voting.prototype._valueChanged = function(accessInfo){
	var votedGems = 0;
	$('#options input.poll-selection', this.element).each(function() {
		var val = boompoll.View_Voting.parseInt(this.value);
		if (isNaN(val) || val < 0) {
			val = 0;
			this.value = 0;
		}
		votedGems += val;
	});
	var rem = accessInfo.definition.gemsCount - votedGems;
	$("#gems_counter", this.element).text(rem);
	if (rem < 0) {
		$("#gems_counter", this.element).addClass("validator");
	} else if (rem == 0) {
		$("#gems_counter", this.element).removeClass("validator");
	}
	else {
		$("#gems_counter", this.element).removeClass("validator");
	}
};

boompoll.View_Voting.prototype._onVote_Submit = function(){
	if (this.vote_submit){
		this.vote_submit.fire(this);
	}
};