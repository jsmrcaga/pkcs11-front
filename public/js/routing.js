config.routing = {
	host: "http://92.222.5.101:8080/pkcs11-api/webapi",
	// host: "http://lamouri.no-ip.biz:8080/pkcs11-api/webapi",
	api:{
		so_path:{
			endpoint: "/module",
			jsession:null,
		},
		slots:{
			path: "/slot",
			number: "/slot/nbSlot",
			id: function _slotId(id, select){
				if (!select) select = "*";
				return "/slot/info/" + id + add_jsession() + getSelect(select);
			}
		},
		tokens:{
			id: function  _tokenId(id, select){
				if (!select) select = "*";
				return "/token/info/" + id + add_jsession() + getSelect(select);
			},
			init: function _tokenInit(id){
				return "/token/init/"+ id+ add_jsession() 
			},

			initUserPin: function _tokenInitPinU(id){
				return "/token/initUserPin/" + id + add_jsession() 
			},

			reset: function _tokenreset(id){
				return "/token/changePW/" + id + add_jsession()
			},

			mechanisms: function _tokenMech(id, select){
				return "/token/mechanisms/" + id + add_jsession()+ getSelect(select); 
			},

			login: function _tokenLogin(id){
				return "/session/" + id + add_jsession()
			}
		}
	}
};

function getSelect(selects){
	if(typeof selects == 'undefined') return "?select=*";
	var plep = "?";
	for(var sel in selects){
		plep += "&select="+ selects[sel];
	}
	return plep;
}

function add_jsession(url){
	if(typeof url == 'undefined') return ";jsessionid=" + config.routing.api.so_path.jsession;
	return url + ";jsessionid=" + config.routing.api.so_path.jsession;
}

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

	};

	Workshop.ajax(options);
}


function getSlotNumber(callback) {
	var options = {
		url: config.routing.host + config.routing.api.slots.number + ";jsessionid=" + config.routing.api.so_path.jsession,
		method: "GET",
		callback:callback,
		// rh: {
		// 	"SET-COOKIE" : "JSESSOINID=" + config.routing.api.so_path.jsession + ";Path=/ HttpOnly",
		// }
	};

	Workshop.ajax(options);
}

function getSlot(id, callback, select){
	var options = {
		// for the moment select = *
		url: config.routing.host + config.routing.api.slots.id(id, select),
		method: "GET",
		callback:callback,
		// rh: {
		// 	"SET-COOKIE" : "JSESSOINID=" + config.routing.api.so_path.jsession + ";Path=/ HttpOnly",
		// }
	};

	Workshop.ajax(options);
}

// *
// @Tonio:
	// remove from GUI 
function deleteModule(callback){
	var options= {
		method:"DELETE",
		url: config.routing.host + config.routing.api.so_path.endpoint + add_jsession(),
		callback: callback,
		status: 204
	};

	Workshop.ajax(options);
}

function getToken(id, callback, select){
	var options = {
		url: config.routing.host + config.routing.api.tokens.id(id, select),
		method: "GET",
		callback:callback,
		// rh: {
		// 	"SET-COOKIE" : "JSESSOINID=" + config.routing.api.so_path.jsession + ";Path=/ HttpOnly",
		// }
	};

	Workshop.ajax(options);
}


function initToken(id, label, pin, callback){
	var data = {};
	data.pinSO = pin; //null if protected machin
	data.label = label;

	var options = {
		method: "PUT",
		data: data,
		url : config.routing.host + config.routing.api.tokens.init(id),
		callback: callback,
		status: 204,
		
	};

	Workshop.ajax(options);
}

// * ***
function token_login(id, pin, userType, callback){
	// pin = null if protectedAuthenticationPath = true;
	// userType  =so / user
	var options = {
		method: "PUT",
		url: config.routing.host + config.routing.api.tokens.login(id),
		data: {
			userType:userType,
			pin: pin
		},
		status: 204,
		callback: callback,
	};

	Workshop.ajax(options);
}

function token_logout(id, callback){
	var options = {
		method: "DELETE",
		url: config.routing.host + config.routing.api.tokens.login(id),
		callback: callback
	};

	Workshop.ajax(options);
}

function token_init_user_pin (id, pin, callback) {
	//pin null if protected machin
	var options = {
		url: config.routing.host + config.routing.api.tokens.initUserPin(id),
		method: "PUT",
		callback: callback
	};
	
	Workshop.ajax(options);
}

function token_reset (id, pinSo, label, callback) {
	// logout before!
		// checklogin
	// pin null if machin

	var options = {
		url: config.routing.host + config.routing.api.tokens.reset(id),
		method: "PUT",
		callback: callback
	};
	
	Workshop.ajax(options);
}

function token_mech (id, callback, select) {
	var options = {

		url: config.routing.host + config.routing.api.tokens.mechanisms(id, select),

		method: "GET",
		callback: callback
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
		init : initToken,
		login : token_login,
		logout: token_logout,
		initUserPin : token_init_user_pin,
		reset: token_reset,
		mechanisms: token_mech
	}
};
