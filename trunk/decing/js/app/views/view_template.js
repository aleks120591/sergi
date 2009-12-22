/**
 * Base templating view
 * @constructor
 * @param Path to template file
 */
boompoll.View_Template = function(elem) {
	this.element = elem;
};

/**
 * Load to view content from specified template
 */
boompoll.View_Template.prototype.load = function(template){
	if (!template){
		template = this.constructor.template;
		if (!template){
			throw new Error("Cannot load view because class property 'template' not specified for this view");
		}
	}
	$(this.element).html(template);
};

boompoll.View_Template.prototype.initWidgets = function(){
	$("button.poll-button:not(.ui-state-disabled)", this.element)
		.hover(
			function(){ 
				$(this).addClass("ui-state-hover"); 
			},
			function(){ 
				$(this).removeClass("ui-state-hover"); 
			}
		)
		.mousedown(function(){
				$(this).parents('.poll-buttonset-single:first').find(".poll-button.ui-state-active").removeClass("ui-state-active");
				if( $(this).is('.ui-state-active.poll-button-toggleable, .poll-buttonset-multi .ui-state-active') ){ $(this).removeClass("ui-state-active"); }
				else { $(this).addClass("ui-state-active"); }	
		})
		.mouseup(function(){
			if(! $(this).is('.poll-button-toggleable, .poll-buttonset-single .poll-button,  .poll-buttonset-multi .poll-button') ){
				$(this).removeClass("ui-state-active");
			}
		});
	
	if (jQuery.browser.mozilla){
		$(".poll-button .poll-icon", this.element).css('margin-left', "-22px");
	}
}