boompoll.Event_Handler = function(target, callback){
	this.target = target;
	this.callback = callback;
};

boompoll.Event_Handler.prototype.fire = function(){
	this.callback.apply(this.target, arguments);
};