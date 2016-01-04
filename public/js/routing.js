config.routing = {
	// host: "http://172.25.28.190:8080/pkcs11-api/webapi",
	host: "http://lamouri.no-ip.biz:8080/pkcs11-api/webapi",
	api:{
		so_path:{
			endpoint: "/module"
		},
		slots:{
			path: "/slot",
			number: "/slot/nbSlot",
			id: function _slotId(id, select){
				if (!select) select = "*";
				return "/slot/"+id + "/info?select=" + select;
			}
		},
		tokens:{
			id: function  _tokenId(id, select){
				if (!select) select = "*";
				return "/token/" + id + "/info?select=" + select;
			},
			init: function _tokenInit(id){
				return "/token/"+ id +"/init"
			}
		}
	}
};

// CALLBACKS
	// Callbacks MUST be fct(err, data). Error is sent first.
function setPath(callback){
	var options = {
		url: config.routing.host + config.routing.api.so_path.endpoint,
		method:"POST",
		data:{
			path: app.paths.current
		},
		callback: callback,
		status: 204,
	};

	Workshop.ajax(options);
}

function getSlotNumber(callback) {
	var options = {
		url: config.routing.host + config.routing.api.slots.number,
		method: "GET",
		callback:callback
	};

	Workshop.ajax(options);
}

function getSlot(id, callback, select){
	var options = {
		// for the moment select = *
		url: config.routing.host + config.routing.api.slots.id(id, select),
		method: "GET",
		callback:callback
	};

	Workshop.ajax(options);
}

function getToken(id, callback, select){
	var options = {
		url: config.routing.host + config.routing.api.tokens.id(id, select),
		method: "GET",
		callback:callback
	};

	Workshop.ajax(options);
}


function initToken(id, label, pin, callback){
	var data = {};
	data.pinSO = pin
	data.path = app.paths.current;
	data.label = label;

	var options = {
		method: "POST",
		data: data,
		url : config.ruting.host + config.routing.api.tokens.init(id),
		callback: callback,
		status: 204
	};

	Workshop.ajax(options);
}

app.routing = {
	setPath: setPath,
	slots:{
		getSlotNumber : getSlotNumber,
		getSlot: getSlot
	},
	tokens:{
		getToken: getToken,
		init : initToken
	}
}
