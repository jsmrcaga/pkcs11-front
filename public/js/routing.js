config.routing = {
	host: "http://92.222.5.101:8080/pkcs11-api/webapi",
	api:{
		slots:{
			path: "/slot",
			number: "/slot/nbSlot",
			id: function _slotId(id){
				return "/slot/"+id;
			}
		}
	}
};

function getSlotNumber(callback) {
	var options = {
		url: config.routing.host + config.routing.api.slots.number,
		method: "POST",
		data: {
			libraryPath: app.paths.current
		},
		callback:callback
	};

	Workshop.ajax(callback);
}

function getSlot(id, callback){
	var options = {
		// for the moment select = *
		url: config.routing.host + config.routing.api.slots.id(id) + "/info?select=*",
		method: "POST",
		data: {
			path: app.paths.current
		},
		callback:callback
	};

	Workshop.ajax(callback);
}

