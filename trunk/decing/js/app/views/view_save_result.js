boompoll.View_Save_Result = function(elem) {
	boompoll.View_Template.call(this, elem);
	this.constructor = boompoll.View_Save_Result;
};

boompoll.View_Save_Result.prototype = new boompoll.View_Template();
boompoll.View_Save_Result.template = boompoll.templates.creating.save_result;

/**
* Populate data to controls
* param data Data to populate on view
* @return void
*/
boompoll.View_Save_Result.prototype.populateData = function(dto) {
	var data = dto.keys;
	var me = this;
	var copier = $("#dlg-copy", me.element).dialog({ autoOpen: false });
	var baseUrl = document.location.protocol + "//" + document.location.host + document.location.pathname;
	var jTable = $("#tbl_saveResult tbody", me.element);
	for (var userIdx in dto.definition.participants) {
		var user = dto.definition.participants[userIdx].name;
		var tr = $("<tr>").appendTo(jTable);
		tr.append(boompoll.templates.creating.row_ai);
		var url = baseUrl+"?"+data[user];
		$(".bp-participant-name", tr).text(user);
		$(".bp-participant-url-href", tr).attr("href", url);
		$(".bp-participant-url", tr).text(url);
		$(".poll-icon-clipboard", tr).click(function(){
			copier.dialog('open');
			
			var tr = $(this).closest("tr");
			$("#partName", copier).text(tr.find(".bp-participant-name").text());
			
			var input = $("input", copier);				
			input.val(tr.find(".bp-participant-url").text());
			input = input.get(0);
			
			input.focus();
			input.select();
		});
	}
	$("#button_create", me.element).click(function(){
		if (me.createNew){
			me.createNew.fire.call(me.createNew, this, dto.definition);
		}
	});
	this.initWidgets();
};
