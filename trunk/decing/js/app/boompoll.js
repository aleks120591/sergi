var boompoll = {
	messageLevel: {
			FATAL : 0,
			ERROR : 1,
			WARNING : 2,
			INFO : 3,
			DEBUG : 4,
			icon : function(level) {
				switch(level){
					case boompoll.messageLevel.ERROR: return 'alert';
					case boompoll.messageLevel.INFO: return 'info';
					case boompoll.messageLevel.DEBUG: return 'gear';
				}
				return 'notice';
			}
		},
		
	httpCodes: {
		SC_OK: 200,
		SC_BAD_REQUEST: 400,
		SC_UNAUTHORIZED: 401,
		SC_FORBIDDEN: 403,
		SC_BAD_METHOD: 405,
		SC_CONFLICT: 409,
		SC_GONE: 410,
		SC_INTERNAL_ERROR: 500
	}
};