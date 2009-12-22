/**
 * @constructor
 */
boompoll.Application = function(target, logger) {
	this.target = target;
	this.logger = logger;
};

boompoll.Application.prototype = {
	start: function() {
		var controller;
		if (boompoll.container.isPollDefined()) {
			controller = new boompoll.Controller_Display(this, this.target);			
		}
		else {
			controller = new boompoll.Controller_Create(this, this.target);
		}		
		controller.start();
	},
	log: function(message, level){
		var p = $(boompoll.templates.log).appendTo(this.logger);
		
		$(".ui-icon", p).addClass('ui-icon-'+boompoll.messageLevel.icon(level));	
		$(".poll-log-text", p).text(message);		
		
		this.logger.append(p);
		
		var timer = setTimeout(function() { 
				p.unbind().
					hide("clip", null, 500, function() { $(this).remove(); }); 
			},
			20000);
		p.show('clip').
			click(function(){
				window.clearTimeout(timer);
				$(this).
					hide("clip", null, 500, function() { $(this).remove(); }).
					unbind(); 
			});
	},
	logError : function(message){
		this.log(message, boompoll.messageLevel.ERROR);
	},
	logHttpError : function(code){
		var codes = boompoll.regional.get('httpCodes');
		var message = codes[code] ? codes[code] : codes['default'];
		this.logError(message);
	},
	logValidationErrors: function(problems, reference){
		for(var k in problems){
			var message = reference[k] ? reference[k] : problems[k];
			this.logError(message);
		}
	},
	loggerEmpty: function(){
		this.logger.empty();
	},
	blockUi: function(){
		$(this.target).block({message: "Sending..."});
	},
	unblockUi: function(){
		$(this.target).unblock();
	},
	generateCreateNewEventHadler: function(){
		var me = this;
		var handler = new boompoll.Event_Handler(this, function(sender, definition){
			if (boompoll.container.returnToCreation.call(boompoll.container, definition)){
				me.start();
			}
		});
		return handler;
	}
};