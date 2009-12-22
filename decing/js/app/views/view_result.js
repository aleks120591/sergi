/**
 * @constructor
 * @extends View_Template
 */
boompoll.View_Result = function(elem) {
	boompoll.View_Template.call(this, elem);
	this.constructor = boompoll.View_Result;
};

boompoll.View_Result.prototype = new boompoll.View_Template();
boompoll.View_Result.template = boompoll.templates.display.result;

boompoll.View_Result.prototype.populate = function(accessInfo){	
	
	$("#winner", this.element).text(accessInfo.result.winner);
	var d = new Date(accessInfo.result.endDate);
	$("#endDate", this.element).text(d.toLocaleString());
	var table = $("#result", this.element);
	for(var i=0;i<accessInfo.result.optionsResult.length;i++){
		var tr = $("<tr/>").appendTo(table);
		var td = $("<td/>").
			appendTo(tr).
			text(accessInfo.definition.actualOptions[i]);
		var v = accessInfo.result.optionsResult[i];
		v = Math.round(100*v)/100;
		td = $("<td/>").
			appendTo(tr).
			text(v);
	}
};