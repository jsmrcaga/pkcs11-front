function module_getSlotNumber () {
	app.routing.slots.getSlotNumber(function (err, nb){
		if(err){
			console.error(err);
			return;
		} 

		nb = JSON.parse(nb).nbSlot;
		init_getSlots(nb);
	});
}

function init_getSlots(nb){
	for(var i = 0; i < nb; i++){
		app.routing.slots.getSlot(i, (function (index){
			return function (err, slot){
				if(err){
					console.error(err);
					return;
				}
				console.log("Got slot, adding: ", JSON.parse(slot));

				var cd = addCd();
				addSlotDescription(slot, cd);

				if(cd.properties.findObjectByProp("name", "informations").tokenPresent == true){
					//if token is there, add the pinche token description to the properties
	app.routing.tokens.getToken(0, (function (CD){
						return function (err, res) {
							if(err){
								Materialize.toast("Error getting token", 3000, "toast-fail");
								return;
							}

							console.info("Got token", JSON.parse(res));
							var token = tokenFactory(res);
							console.log("Adding to cd...");
							CD.push(token);
							console.log("Added to cd:", CD);
							$("#loading_modal").closeModal();
							displayCd(CD.id);
					
							var option = document.createElement("option");
							option.value = CD.id;
							option.innerHTML = "CryptoDevice " + CD + " Token";
							select_token_input.appendChild(option);
						};
						
					})(cd));

					app.routing.tokens.mechanisms(0, function (err, res) {
						console.info("Got token", JSON.parse(res));
						var mcm = mechanismFactory(res);
						console.log("Mcm from factory", mcm);
						console.log("Adding to cd...");
					});

				}
				$("#loading_modal").closeModal();
				displayCd(cd.id);
		
				actualize_token_list();
			}


		})(i));
	}
}

var select_token_button = document.getElementById("select_token_button");
var select_token_input = document.getElementById("select_token_input");

function loadModule (path) {
	if(app.paths.history.indexOf(path) < 0) {
		app.paths.history.push(path);
	}else{
		Materialize.toast("Module already loaded!", 3000, "toast-fail");
		return;
	}
	app.paths.current = path;

	$("#loading_modal").openModal();
	app.routing.setPath(function(err, res, xml){
		console.log("Got session id:", res);
		if(res == ""){
			$("#loading_modal").closeModal();
			Materialize.toast("Could not contact server, please verify its availability", 3000, "toast-fail");
		}
		res = JSON.parse(res);
		config.routing.api.so_path.jsession = res.jsessionid;
		Materialize.toast("Module loaded succesfully!", 3000, "toast-success");

		module_getSlotNumber();
	});
	
}


// load module
document.getElementById("button_load_module").addEventListener("click", function(e){
	e.preventDefault();
	var path = document.getElementById("path_to_so");
	if (path.value == "") {
		path.style.outline = "#AA0000 solid 2px";
		Materialize.toast("Please specify a path to the module", 3000, "toast-fail");
		return;
	}

	$("#modal_newCrypto").closeModal();
	loadModule(path.value); 
});



document.getElementById("button_token_login").addEventListener("click", function(){
	$("#token_select").openModal();
	select_token_button.onclick = null; //purge
	select_token_button.onclick = function(){
		app.active_token = parseInt(select_token_input.value);
		if(app.active_token === "" || app.active_token == null || isNaN(app.active_token)) {
			Materialize.toast("Please be sure to select a token", 3000, "toast-fail");
			return;
		}
		$("#token_select").closeModal();

		if(cdList[app.active_token].properties.findObjectByProp("name", "token").protectedAuthenticationPath){
			$("#modal_token_login_wait").openModal();
			console.info("Token has pin on itself, making request...");
			app.routing.tokens.login(app.active_token, null, "", (function (index){
				return function (err, res){
					if(err){
						Materialize.toast("Error logging in!", 3000, "toast-fail");
						return;
					}
					Materialize.toast("Success, you are now logged in!", 3000, "toast-success");
					$("#modal_token_login_wait").closeModal();
					app.logged_token.push(index);
				}
			})(app.active_token));
		}else{
			$("#modal_token_login").openModal();	
		}

	};
});

document.getElementById("button_token_init").addEventListener("click", function(){
	$("#token_select").openModal();
	select_token_button.onclick = null;
	select_token_button.onclick = function(){
		app.active_token = parseInt(select_token_input.value);
		if(app.active_token === "" || app.active_token == null || isNaN(app.active_token)) {
			Materialize.toast("Please be sure to select a token", 3000, "toast-fail");
			return;
		}
		$("#token_select").closeModal();

		if(cdList[app.active_token].properties.findObjectByProp("name", "token").protectedAuthenticationPath){
			var pin = document.getElementById("token_init_pin_input");
			pin.setAttribute("optional", true);
			pin.setAttribute("disabled", true);
			pin.value = "";
		}
		$("#modal_token_init").openModal();

	};
});

// INIT TOKEN MODAL Button
document.getElementById("button_token_init_accept").addEventListener("click", function(){
	if(document.querySelector("#modal_token_init form").validate()){
		var label = document.getElementById("token_init_label_input").value;
		var pin = document.getElementById("token_init_pin_input").value;
		
		pin = (pin === "") ? null : pin;

		if(app.needs_loading) $("#loading_modal").openModal();
		app.routing.tokens.init(app.active_token, label, pin, function (err, res){
			res = (res == "" || res == null || res.length == 0) ? res : JSON.parse(res);
			if(err){
				Materialize.toast("Error initializing token "+app.active_token+": " + res.description, 3000, "toast-fail");
				$("#modal_token_init").closeModal();
				if(app.needs_loading) $("#loading_modal").close
				return;
			}

			Materialize.toast("Token initialized successfully!", 3000, "toast-success");
			$("#modal_token_init").closeModal();
			if(app.needs_loading) $("#loading_modal").closeModal();
		});
	}
});

// LOGIN Button
document.getElementById("button_token_login_accept").addEventListener("click", function(){
	var pin = document.getElementById("login_pin_input").value;
	var so = document.getElementById("checkbox_so").checked;
	if(pin === ""){
		Materialize.toast("Please enter your PIN", 3000, "toast-fail");
		return;
	}

	var u = null;
	if(so){
		u = "so";
	}else{
		u = "user"
	}

	console.log("Logging in to token:", app.active_token, "as", u, "with PIN", pin);
	app.routing.tokens.login(app.active_token, pin, u, (function (index, uType){
		return function (err, res){
			res = (res == "" || res == null || res.length == 0) ? res : JSON.parse(res);
			if(err){
				Materialize.toast("Error logging in: "+res.description, 3000, "toast-fail");
				$("#modal_token_login").closeModal();
				return;
			}
			Materialize.toast("Success, you are now logged in!", 3000, "toast-success");
			$("#modal_token_login").closeModal();
			app.logged_token.push(index);
			app.login_method = uType;
			var span_l = document.createElement("span");
			span_l.className = "span-logged";
			span_l.innerHTML = "Logged Into Token <bold>" + index + "</bold> as <bold>" + app.login_method + "</bold>";
			
			var span_cont= document.getElementById("logged-container");
			span_cont.appendChild(span_l);

			span_l.style.display = "block";

		};
	})(app.active_token, u));

});
// init dump button.
document.getElementById("button_token_dump").addEventListener("click", function(e){
	e.preventDefault();

	$("#token_select").openModal();
	select_token_button.onclick = null;
	select_token_button.onclick = function(){
		app.active_token = parseInt(select_token_input.value);
		if(app.active_token === "" || app.active_token == null || isNaN(app.active_token)) {
			Materialize.toast("Please be sure to select a token", 3000, "toast-fail");
			return;
		}
		$("#token_select").closeModal();

		$("#modal_dump_token").openModal();
	}

});

