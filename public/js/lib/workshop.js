/**
 * Workshop Namespace
 * @namespace
 * @borrows ajax as AJAXCall
*/
var Workshop = {};

// *************************
// Arrays
// *************************

/**
 * Finds an object in an array thanks to a single property
 * @param {string} prop - The property to look for (i.e. "id")
 * @param {} value - The value to match in the obejct
 * @returns {Object} Returns found object or NULL 
*/
Object.defineProperty(Array.prototype, "findObjectByProp", {
	value: function _findObjectByProp (prop, value) {
		for(var i = 0; i<this.length; i++){
			if (this[i][prop] == value){
				this[i].found_index = i;
				return this[i];
			}
		}
		return null;
	},
	enumerable: false,
	writable:false,
});


/**
 * Finds multiple objects in an array thanks to a single property
 * @param {string} prop - The property to look for (i.e. "id")
 * @param {} value - The value to match in the obejct
 * @returns {Object} Returns found object or NULL
*/
Object.defineProperty(Array.prototype, "findObjectsByProp", {
	value: function _findObjectsByProp (prop, value) {
		var results = [];
		for(var i = 0; i<this.length; i++){
			if (this[i][prop] == value){
				this[i].found_index = i;
				results.push(this[i]);
			}
		}
		return (results.length == 0) ? null : results;
	},
	enumerable: false,
	writable: false
});

Object.defineProperty(Array.prototype, "last", {
	get : function(){
		return this[this.length - 1];
	},

	set : function(a){
		this[this.length - 1] = a;
	},
	enumerable: false,
});

// *************************
// Numbers
// *************************

/**
 * Checks if number is between A and B (A<x<B)
 * @param {number} a - The lower value to check against
 * @param {number} b - The upper value to check against
 * @returns {bool}
*/
Object.defineProperty(Number.prototype, "isBetween", {
	value: function _isBetween (a, b, includes){
		if (!includes) includes = 0;
		switch(includes){
			case -1 :
				if(this >= a && this < b) return true;
				break;
			case 2 :
				if(this >= a && this <= b) return true;
				break;
			case 1 :
				if(this > a && this <= b) return true;
				break;
			case 0 :
				if(this > a && this < b) return true;
				break;
		}
		return false;
	},
	enumerable: false,
	writable: false
});

// *************************
// Math
// *************************

Math.ZERO = 0;
Math.GOLDEN_RATIO = (Math.sqrt(5)+1)/2;
Math.INVERSE_GOLDEN_RATIO = 1/Math.GOLDEN_RATIO;
Math.GOOGOL = 1e100;
	// Physics
Math.G = 9.80665;
Math.AU = 1.4959787066 * 1e11;

Math.map = {
	/**
	 * Maps a vlaue to a linear function
	 * @param {number} value - Value to find in function
	 * @param {point} point1 - First point of function, described as {x:, y:}
	 * @param {point} point2 - Second point of function, described as {x:, y:}
	 * @returns {number} The corresponding Y value of the given value (as f(value) = y)
	*/
	linear: function _mapLinear(val, point1, point2){
		if (point1.x == point2.x) throw new Error("In a linear expression xa and xb cannot be the same value");;
		if (point1.y == point2.y) throw new Error("In a linear expression ya and yb cannot be the same value");

		var a = (point2.y-point1.y)/(point2.x-point1.x);
		var b = point1.y - (a*point1.x);
		return a*val + b;
	},

	/**
	 * Maps a value form given bounds
	 * @param {number} value - The value to map
	 * @param {Object} from - The 'from' values, given as: {min:, max:}
	 * @param {Object} to - The 'to' values, given as : {min:, max:}
	 * @returns {number} Value mapped to input value 
	*/
	bounds : function _mapBounds (val, _in, _out){
		return Math.map.linear(val, {x:_in.min, y: _out.min}, {x:_in.max, y:_out.max});
	},

	exponential: function _mapExp(){
		
	},

	cosinus: function _mapCos(){

	},

	sinus: function _mapSin(){

	},

	inverse: function _mapInv(){

	},

	logarithmic: function _mapLog(){

	}
};

Object.defineProperty(Math.map, "types", {
	get: function(){
		return ["linear", "inverse", "exponential", "cosinus", "sinus", "logarithmic"];
	}
});

/**
 * Mathematical Sum
 * @param {int} from - First value of sum
 * @param {int} to - Las value of sum
 * @param {sting} formula - Formula to sum, as "Math.pow(x,2) + (Math.log(x))"
 * @param {int} [step] - The step to advance in sum, default is 1
 * @memberof Math
*/
Math.sum = function _mathSum(from, to, formula, step){
	//if no step defined step = 1
	step = step ? step : 1;
	to += step;

	var res = 0;
	for(var i = from; i < to; i = i + step){
		var tempFor = formula.replace('x', i);
		res += eval(tempFor);
	}

	return res
};

/**
 * Mathematical Sum
 * @param {int} from - First value of multiplication
 * @param {int} to - Las value of multiplication
 * @param {sting} formula - Formula to multiplicate, as "Math.pow(x,2) + (Math.log(x))"
 * @param {int} [step] - The step to advance in multiplication, default is 1
 * @memberof Math
*/
Math.mult = function _mathMult(from, to, formula, step){
	//if no step defined step = 1
	step = step ? step : 1;
	to += step;

	var res = 1;
	for(var i = from; i < to; i = i + step){
		var tempFor = formula.replace('x', i);
		res *= eval(tempFor);
	}

	return res;
};

//AJAX

XMLHttpRequest.prototype.setRequestHeaders = function _setRequestHeaders(rh, defaultCT){
	if(!defaultCT) defaultCT = 'application/json';
	if(! "Content-Type" in rh) this.setRequestHeader("Content-Type", defaultCT);

	for(var header in rh){
		console.info("Setting header: ", header, rh[header]);
		this.setRequestHeader(header, rh[header]);
	}
}


function AJAXCall (params){
	//params = url, method, callback(err, resp), data, async, debug, status, rh
	if (typeof params == 'undefined'){
		throw new Error("Parameters are required");
	}

	if(typeof params.debug == 'undefined' || params.debug == null) params.debug = false; 

	if (typeof params.url == 'undefined'){
		throw new Error("URL is required for AJAXCall");
	}

	if (typeof params.method == 'undefined' || (params.method != "GET" && params.method != "POST" && params.method != "DELETE" && params.method != "PUT")){
		throw new Error("method for AJAXCall is required and must be GET, POST, DELETE or PUT only");
	}

	var xml = new XMLHttpRequest();
	xml.onreadystatechange = function(){
		if(xml.readyState == 4){
			if (xml.status == (params.status || 200)){
				//readyState 4 = end of call and success
				if (typeof params.callback != 'undefined') params.callback(null, xml.responseText);
				return xml.responseText;
			} else if(xml.status == 0) {
				if(params.debug) console.log("XMl Error: readyState: ", xml.readyState, " status:", xml.status);
				if (typeof params.callback != 'undefined') params.callback({error: {message: xml.statusText, state: xml.readyState, status: xml.status}}, xml.responseText);				
			}
		}
	};

	var async;
	if (typeof params.async != 'undefined'){
		async = params.async;
	}else{
		async = true;
	}

	if (params.method == "GET" || params.method == "DELETE"){

		if (typeof params.data == 'undefined'){
			xml.open(params.method, params.url, async);
			xml.setRequestHeaders(params.rh || {});
			xml.send();
		}else{
			var url = (params.url.substring(params.url.length-1, params.url.length) == "/")? "?" : "/?";
			for (var key in params.data){
				url += key + "=" + params.data[key] + "&";
			}
			url = url.substring(0,url.length-1);
			params.url += url;
			xml.open(params.method, params.url, async);
			xml.setRequestHeaders(params.rh || {});
			xml.send();
		}

	}else if(params.method == "POST" || params.method == "PUT"){
		xml.open(params.method, params.url, async);
			xml.setRequestHeaders(params.rh || {});
		if (typeof params.data != 'undefined'){
			xml.send(JSON.stringify(params.data));
		}else{
			xml.send();
		}
	}
}

// Navigator


/**
 * This function is executed on request end (success or error) of Workshop.ajax()
 * @callback ajaxCallback
 * @param {Object} err - Error result of ajax call, {success:true} if no error, {error:{message:, status:, state:}} if error
 * @param {string} data - Data received from server 
*/


/**
 * Performs a request to distant server via XMLHttpRequest
 * @param {Object} params - Parameters for performing an ajax call (method, url...)
 * @param {string} params.url - Full url for request (without GET data), e.g.: "http://domain.com/some/path"
 * @param {string} params.method - Method for request, only allows GET, POST, PUT and DELETE
 * @param {Object} params.requestHeaders - Request headers to set to request, as JavaScript object, e.g. {'Content-Type': 'application/json'}
 * @param {Object} params.data - Data to send with request. If method is GET or DELETE, data will be appended to url, if POST or PUT, will be sent normally.
 * @param {ajaxCallback} params.callback - Function to execute on end of request
 * @param {bool} params.async - If request should be asynchronous or not, default is true
 * @param {int} params.status - Http status to wait for before callback, default is 200
 * @param {bool} params.debug - If function should display debug info in console
 * @memberof Workshop
*/

Workshop.ajax = AJAXCall;


Workshop.getDeviceOrientation = function _getDeviceOrientation (callback) {
	window.addEventListener('deviceorientation', callback);
}

Workshop.getDeviceMotion = function _getDeviceMotion (callback) {
	window.addEventListener('devicemotion', callback);
}

Workshop.getDeviceMovement = function _deviceMovement (callback) {
	var resp = {};
	window.addEventListener('deviceorientation', function(data){
		resp.alpha = data.alpha;
		resp.beta = data.beta;
		resp.gamma = data.gamma;

		callback(resp);
	});

	window.addEventListener('devicemotion', function(data){
		resp.acceleration = data.acceleration;
		resp.gravity = data.accelerationIncludingGravity;

		callback(resp);
	});
}

// Geolocation


/**
 * This function is executed on request end (success) of Workshop.getGeoLocation
 * @callback geoCallback
 * @param {Object} data - Data received after geoLoc request.
 * @returns {Object} geoloc - {coords: {latitude:, longitude:}, accuracy:, altitude: {value:, accuracy:}, speed:, timestamp}
*/

/**
 * Gets geolocation from browser
 * @param {geoCallback} callback - Function to call if geoloc success
 * @param {function} error - Function to call in case of error
 * @memberof Workshop
*/
Workshop.getGeoLocation = function _getGeoLocation(callback, error){
	if(!navigator){
		var err = {
			message:"Navigator does not exist",
			code: 101
		};
		error(err);
		return;
	}

	if(!navigator.geolocation){
		var err = {
			message:"Geolocation not available in this browser",
			code : 102
		};
		error(err);
		return;
	}

	function success(geoloc){
		var resp = {
			coords:{
				latitude: geoloc.coords.latitude,
				longitude: geoloc.coords.longitude
			},
			
			accuracy: geoloc.coords.accuracy,
			
			altitude: {
				value: geoloc.coords.altitude,
				accuracy: geoloc.coords.altitudeAccuracy
			},

			speed: geoloc.coords.speed,

			timestamp: geoloc.timestamp

		};

		callback(resp);
		return geoloc;
	}

	function error(err){
		error(err);
		return;
	}

	var geo = navigator.geolocation.getCurrentPosition(success, error);
};

// Notifications

Workshop.notifications = {
	subscribe : subscribeToGCM,
	unsubscribe: unsubscribeFromGCM,
	init: registerPushInit,

	config: {
		debug: true,
		setDebug: function(on_off){
			if(on_off){
				Workshop.notifications.config.debug = true;
				console.log("Set debug to true");
			}else{
				Workshop.notifications.config.debug = false;
				console.log("Set debug to false");
			}
		},

		isEnabled : false,
		_server_endpoint: null,
		_service_worker: null,
		setServiceWorker: function(sw_path){
			if(!sw_path || typeof sw_path == "undefined"){
				throw new Error("Service Worker Path must be defined");
			}

			Workshop.notifications.config._service_worker = sw_path;			
		},
		setServerEndpoint : function(endpoint){
			if(!endpoint || typeof endpoint == "undefined"){
				throw new Error("Endpoint must be defined");
			}

			Workshop.notifications.config._server_endpoint = endpoint;
		}
	},

};

/*************
	TIME
*************/
Date.prototype.toSeconds = function _toSeconds(){
	return this.getHours()*3600 + this.getMinutes()*3600 + this.getSeconds();
};

Object.defineProperty(Date.prototype, "minutes", {
	get: function(){
		return this.getMinutes();
	},

	set: function(minutes) {
		this.setMinutes(minutes);
	}
});

Object.defineProperty(Date.prototype, "hours", {
	get: function(){
		return this.getHours();
	},

	set: function(hours) {
		this.setHours(hours);
	}
});

Object.defineProperty(Date.prototype, "seconds", {
	get: function(){
		return this.getSeconds();
	},

	set: function(seconds) {
		this.setSeconds(seconds);
	}
});

Date.prototype.toDecimal = function _toDecimal(){
	var transform = 100000 / 86400;

	var s = this.getSeconds();
	var m = this.getMinutes();
	var h = this.getHours();

	var total_60 = h*3600 + m*60 + s;
	var total_10 = total_60 * transform;

	var hours = total_10 / Math.pow(100,2);
		var minutes = (hours - Math.floor(hours)) * 100;
	hours = Math.floor(hours);

	var seconds = Math.floor((minutes - Math.floor(minutes)) * 100);
	minutes = Math.floor(minutes);

	return {
		string: hours+":"+minutes+":"+seconds,
		date:{
			hours:hours,
			minutes:minutes,
			seconds: seconds
		},

	};
};



// Libraries

	// Notifications

function registerPushInit(callback, error) {
	if(Workshop.notifications.config.debug) console.log("Entered registerPushInit");
	if(!callback || typeof callback == "undefined"){
		throw new Error("Callback must be defined");
	}

	if(!'serviceWorker' in navigator){
		var err = {
			message: "ServiceWorkers not supported in this navigator",
			code: 1001
		};
		error(err);
		return;
	}else{
		if(!Workshop.notifications.config._service_worker || typeof Workshop.notifications.config._service_worker == 'undefined'){
			throw new Error("Workshop service worker is not defined, please use Workshop.notifications.config.setServiceWorker('./path/to/sw.js')");
		}

		if(Workshop.notifications.config.debug) console.log("Service worker path: ", Workshop.notifications.config._service_worker);
		navigator.serviceWorker.register(Workshop.notifications.config._service_worker).then(function(){
			init(error);
		});
	}

	function init(error){
		if(Workshop.notifications.config.debug) console.log("Entered init");

		error = (error) ? error : function(err){console.log(err)};

		if(!('showNotification' in ServiceWorkerRegistration.prototype)){
			var err = {
				message: 'showNotification not supported by ServiceWorkerRegistration',
				code:1002
			};
			error(err);
			return;
		}

		if(Notification.permission === 'denied'){
			var err = {
				message: 'Permission for notifications is denied',
				code:1003
			};

			error(err);
			return;
		}

		if(!('PushManager' in window)){
			var err = {
				message: "PushManager not supported",
				code:1003
			};
			error(err);
			return;
		}

		navigator.serviceWorker.ready.then(function(serviceWorkerRegistration){
			
			if(Workshop.notifications.config.debug) console.log("Entered serviceWorker.ready on init", serviceWorkerRegistration);

			serviceWorkerRegistration.pushManager.getSubscription()
				.then(function(subscription){

					if(!subscription){
						var err = {
							message: 'No Current Subscription',
							code: 1006
						};
						error(err);
						callback(false, {from: {name: "getSubscription", code: 1}});
						return;
					}

					if(Workshop.notifications.config.debug) console.log("Got Subscription on Init: ", subscription);

					sendToServer(subscription);

					callback(true,{from: {name: "getSubscription", code: 1}});
				})
				.catch(function(err){
					error(err);
					return;
				});
		});
	}

}

function subscribeToGCM(callback, error){
	if(Workshop.notifications.config.debug) console.log("Entered subscribe");

	if(!callback || typeof callback == "undefined"){
		throw new Error("Callback must be defined");
	}

	error = (error) ? error : function(err){console.log(err)};

	navigator.serviceWorker.ready.then(function(serviceWorkerRegistration){
		serviceWorkerRegistration.pushManager.subscribe({userVisibleOnly:true})
		.then(function(subscription){
			if(Workshop.notifications.config.debug) console.log("Entered subscribre on pushManager:", subscription);
			callback(true, {from: {name: "subscribe", code: 2}});
			return sendToServer(subscription);
		})
		.catch(function(e){

			if(Notification.permission === 'denied'){
				var err = {
					message: 'Permission to notify denied',
					code: 1003
				};
				error(err);
				callback(false, {from: {name: "subscribe", code: 3}});
				return;
			}else{
				var err = {
					message: 'Error with subscription (check manifest.json, and if it\'s loaded in your browser, or well written)',
					original: e,
					code: 1004
				};
				callback(false, {from: {name: "subscribe", code: 4}});
				error(err);
				return;
			}

		});
	});
}

function unsubscribeFromGCM (callback, error) {
	if(Workshop.notifications.config.debug) console.log("Entered unsubscribe");

	if(!callback || typeof callback == "undefined"){
		throw new Error("Callback must be defined");
	}
	error = (error) ? error : function(err){console.log(err)};

	navigator.serviceWorker.ready.then(function(serviceWorkerRegistration){
		serviceWorkerRegistration.pushManager.getSubscription().
		then(function(pushSubscription){
			if(!pushSubscription){
				// do something
				callback(false, {from: {name: "getSubscription", code: 5}});
				return;
			}

			var sub_id = pushSubscription.subscriptionId;
			// SEND TO SERVER TO REMOVE FROM DB

			pushSubscription.unsubscribe().then(function(successful){
				callback(true, {from: {name: "unsubscribe", code: 6}});
			}).catch(function(e){
				var err = {
					message: 'Error while unsibscribing: ' + e,
					code: 1005,
				};
				callback(false, {from: {name: "unsubscribe", code: 6}});
				error(err);
				return;
			});
		})
		.catch(function(e){
			var err = {
					message: 'Error while unsibscribing: ' + e,
					code: 1004,
				};
			callback(false, {from: {name: "getSubscription", code: 7}});
			error(err);

			return;
		});
	});
}

function sendToServer(what) {
	if(Workshop.notifications.config.debug) console.log("Sending to server (", Workshop.notifications.config._server_endpoint, ") :", what);
	var options = {
		url: Workshop.notifications.config._server_endpoint,
		method:"POST",
		data:{
			subscription : what.endpoint.toString()
		},
		callback: function(resp){
			console.log("Resp from server:", resp);
		}
	};

	Workshop.ajax(options);
}