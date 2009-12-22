/**
 * @constructor
 * @extends View_Template
 */
boompoll.View_Display = function(elem) {
	boompoll.View_Template.call(this, elem);
	this.constructor = boompoll.View_Display;
	this.status = $('#status', elem).get(0);
};

boompoll.View_Display.prototype = new boompoll.View_Template();
boompoll.View_Display.template = boompoll.templates.display.main;

boompoll.View_Display.prototype.init = function(){
	var me = this;
	$("#button_create", this.element).click(function(){
		if (me.createNew){
			me.createNew.fire.call(me.createNew, this, accessInfo.definition);
		}
	});
	
	this.initWidgets();	
};

boompoll.View_Display.prototype.populate = function(accessInfo){
	$("#subject", this.status).text(accessInfo.definition.subject);
	
	var part = $('#participants', this.element);
	part.empty();
	for (var i in accessInfo.definition.participants) {
		var p = accessInfo.definition.participants[i];
		var tr = $("<tr/>").appendTo(part);
		tr.append($("<td/>").text(p.name));
		tr.append($("<td/>").html((accessInfo.didVoted(p.name) ? "Voted" : "NOT voted")));
		
		if (accessInfo.definition.areNonStandardWeighs){
			tr.append($("<td/>").html(p.weight));
		}
	}
	if (accessInfo.voter){
		$('#voter', this.element).text(accessInfo.voter);
	}
	else{
		$("#voter_name", this.element).hide();
	}
	
	var me = this;
	var button_create = $("#button_create", this.element);
	button_create.unbind("click");
	button_create.click(function(){
		if (me.createNew){
			me.createNew.fire.call(me.createNew, this, accessInfo.definition);
		}
	});
	
	this.initWidgets();	
};

boompoll.View_Display.prototype.getContentHolder = function(){
	return $('#current', this.element).get(0);
};

boompoll.View_Display.prototype.hideCurrent = function(){
	$('#current', this.element).hide();
	this.removeVoteButton();
};

boompoll.View_Display.prototype.showCurrent = function(){
	$('#current', this.element).show();
};

boompoll.View_Display.prototype.removeVoteButton = function(){
	$('#button_vote', this.element).remove();
};