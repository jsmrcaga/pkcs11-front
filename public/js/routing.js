config.routing = {
	host: "http://92.222.5.101:8080/pkcs11-api/webapi",
	api:{
		slots:{
			path: "/slot",
			number: "/slot/nbSlot",
			id: function _slotId(id, select){
				if (!select) select = "*";
				return "/slot/"+id + " /info?select=" + select;
			}
		},
		tokens:{
			id: function  _tokenId(id, select){
				if (!select) select = "*";
				return "/token/" + id + " /info?select=" + select;
			}
		}
	}
};

// CALLBACKS
	// Callbacks MUST be fct(err, data). Error is sent first.


function getSlotNumber(callback) {
	var options = {
		url: config.routing.host + config.routing.api.slots.number,
		method: "POST",
		data: {
			libraryPath: app.paths.current
		},
		callback:callback
	};

	Workshop.ajax(options);
}

function getSlot(id, select, callback){
	var options = {
		// for the moment select = *
		url: config.routing.host + config.routing.api.slots.id(id, select) + "/info?select=*",
		method: "POST",
		data: {
			path: app.paths.current
		},
		callback:callback
	};

	Workshop.ajax(options);
}

function getToken(id, select, callback){
	var options = {
		url: config.routing.host + config.routing.api.tokens.id(id, select),
	};

	Workshop.ajax(options);
}

app.routing = {
	slots:{
		getSlotNumber : getSlotNumber,
		getSlot: getSlot
	},
	tokens:{
		getToken: getToken
	}
}
