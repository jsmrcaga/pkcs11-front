var select_token_button = document.getElementById("select_token_button");
var select_token_input = document.getElementById("select_token_input");


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
				addSlotDescription(slot, cd, index);

				if(cd.properties.findObjectByProp("name", "informations").tokenPresent == true){
					//if token is there, add the pinche token description to the properties

					app.routing.tokens.getToken(index, (function (CD){

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
							var option = document.createElement("option");
							option.value = index;
							option.innerHTML = "CryptoDevice " + index + " Token";
							select_token_input.appendChild(option);
						
							$("select").material_select();
						};
						
					})(cd));
						app.routing.tokens.mechanisms(index, (function (CD){
						return function (err, res) {
							if(err){
								Materialize.toast("Error getting mechanisms", 3000, "toast-fail");
								return;
							}

							console.info("Got mcm", JSON.parse(res));
							var mcm = MechanismFactory(res);
							console.log("Adding to cd...");
							CD.push(mcm);

						};
						
					})(cd));

				}
				$("#loading_modal").closeModal();
				displayCd(cd.id);
		
			}


		})(i));
	}
}


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
					app.logged_tokens.push(index);
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
			app.logged_tokens.push(index);
			app.login_method = uType;

			var rand = parseInt(Math.random() * 100000);

			var span_l = document.createElement("span");
			span_l.id = rand;
			span_l.className = "span-logged";
			span_l.innerHTML = "Logged Into Token <bold>" + index + "</bold> as <bold>" + app.login_method + "</bold>";
			
			var logout_button = document.createElement("a");
				var i_l = document.createElement("i");
				i_l.className="material-icons";
				i_l.innerHTML = "clear";
				logout_button.appendChild(i_l);
			logout_button.href = "#!";
			logout_button.className = "logout_button";
			logout_button.addEventListener("click", (function(id){

				return function(){
					app.routing.tokens.logout(index, function(err, res){
						if(err){
							Materialize.toast("Could not logout", 3000, "toast-fail");
							return;
						}

						document.getElementById(id).style.display = "none";

					});
				};

			})(rand));

			span_l.appendChild(logout_button);
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
		document.getElementById("button_token_dump_accept").onclick = function(){
			var path = $("#dump_path").value;
			path = (path == "") ? "~" : path; 
			app.routing.tokens.dump(app.active_token, path, function(err, res){
				res = (res == "" || res == null || res.length == 0) ? res : JSON.parse(res);
				if(err){
					Materialize.toast("deso gros: "+err.error.message,3000, "toast-fail");
					$("#modal_dump_token").closeModal();
					return;
				}
				Materialize.toast("Data dumped!", 3000, "toast-success");
				$("#modal_dump_token").closeModal();
			});
							
		};
	}

});

document.getElementById("button_token_reset").addEventListener("click", function(){

	$("#token_select").openModal();
	select_token_button.onclick = null;
	select_token_button.onclick = function(){
		app.active_token = parseInt(select_token_input.value);
		if(app.active_token === "" || app.active_token == null || isNaN(app.active_token)) {
			Materialize.toast("Please be sure to select a token", 3000, "toast-fail");
			return;
		}

		$("#token_select").closeModal();
		$("#token_reset_modal").openModal();

	}
});




document.getElementById("token_reset_button").addEventListener("click", function(){
	var pin = document.getElementById("pin_so_reset_input").value;
	var label = document.getElementById("label_reset_input").value;
	if(pin == ""){
		Materialize.toast("Please enter your SO pin", 3000, "toast-fail");
		return;
	}
	app.routing.tokens.reset(app.active_token, pin, label, function(err, res){
		if(err){
			Materialize.toast("Error resetting token", 3000, "toast-fail");
			return;
		}

		Materialize.toast("Token reset!", 3000, "toast-success");
	});
});

document.getElementById("button_token_uPin").addEventListener("click", function(){
	$("#token_select").openModal();
	select_token_button.onclick = null;
	select_token_button.onclick = function(){
		app.active_token = parseInt(select_token_input.value);
		if(app.active_token === "" || app.active_token == null || isNaN(app.active_token)) {
			Materialize.toast("Please be sure to select a token", 3000, "toast-fail");
			return;
		}

		$("#token_select").closeModal();
		$("#modal_token_uPin").openModal();

	}
});


document.getElementById("button_token_reset_uPin_accept").addEventListener("click", function(){
	var pin = document.getElementById("new_user_pin").value;
	if(pin ==""){
		Materialize.toast("Please be sure to select a pin", 3000, "toast-fail");
		return;
	}
	app.routing.tokens.initUserPin(app.active_token, pin, function(err, res){
		if(err){
			Materialize.toast("Could not initialize user pin", 3000, "toast-fail");
			$("#modal_token_uPin").closeModal();
			return;
		}


		Materialize.toast("User Pin correctly Init", 3000, "toast-success");
		$("#modal_token_uPin").closeModal();

	});
});

document.getElementById("button_token_random").addEventListener("click", function(e){	
	e.preventDefault();
	document.getElementById("input-wraper").style.display="block";
	$("#token_select").openModal();

	select_token_button.onclick = function(){
		app.active_token = parseInt(select_token_input.value);
		if(app.active_token === "" || app.active_token == null || isNaN(app.active_token)) {
			Materialize.toast("Please be sure to select a token", 3000, "toast-fail");
			return;
		}		
		if(document.getElementById("random-size").value == "") {
			Materialize.toast("Please be sure to enter number of bytes", 3000, "toast-fail");
			return;
		}
		$("#token_select").closeModal();
		$("#modal_token_random_wait").openModal();	
		app.routing.tokens.random(app.active_token,document.getElementById("random-size").value,  function(err, res){
			if(err){

				Materialize.toast("deso gros: "+err.error.message,3000, "toast-fail");
				console.error(err);
				$("#modal_token_random_wait").closeModal();
				return;
			}
	
			Materialize.toast("Random generated!", 3000, "toast-success");
			$("#modal_token_random_wait").closeModal();

			var rand = JSON.parse(res);
			$("#random-data").html(" Data generated : "+rand.bytesArray);
			$("#modal_random_display").openModal();
		});
	};	
	$("#input-wraper").display="none";					
});

document.getElementById("button_token_objects").addEventListener("click", function(e){	
	e.preventDefault();
	$("#objects-data").html("");
	$("#token_select").openModal();
	select_token_button.onclick = null;
	select_token_button.onclick = function(){
		app.active_token = parseInt(select_token_input.value);
		if(app.active_token === "" || app.active_token == null || isNaN(app.active_token)) {
			Materialize.toast("Please be sure to select a token", 3000, "toast-fail");
			return;
		}

		$("#token_select").closeModal();
		app.routing.tokens.listObjects(app.active_token,  function(err, res){
			if(err){

				Materialize.toast("deso gros: "+err.error.message,3000, "toast-fail");
				console.error(err);

				return;
			}

			Materialize.toast("Received object list", 3000, "toast-success");
			res = JSON.parse(res);
			console.log("received object list :", res.handleAndObject);
			var nbObj =res.handleAndObject.entry.length;
			//$("#objects-data").html();
			$("#objects-data").append(" Number of objects in token : "+nbObj);
			//$("#objects-data").append("<table><thead><tr><td>field</td><td>value</td></tr></thead><tbody>");
			for(var i=0;i<nbObj;i++)
			{	
				//htm+="<table class='striped'><thead><tr><td>Object</td><td>"+res.handleAndObject.entry[i].key.value+"</td></tr></thead><tbody>";
				//$("#objects-data").prepend("<tr><td>"+"Object Id"+"</td><td>"+res.handleAndObject.entry[i].key.value+"</td></tr>");
				$("#objects-data").append("<table class='striped' id='table_object_"+res.handleAndObject.entry[i].key.value+"'><thead><tr><td>Object</td><td>"+res.handleAndObject.entry[i].key.value+"</td>");
				$("#objects-data").append("<td ><a href='#!' id='button_object_"+res.handleAndObject.entry[i].key.value+"'><i class='material-icons'>clear</i>Delete</a></td></tr></thead></tbody></table>");
				//$("#objects-data").append("mabite");
				document.getElementById("button_object_"+res.handleAndObject.entry[i].key.value).onclick= (function(index){

					return function _deleteObject(){	
						app.routing.tokens.deleteObject(app.active_token,index,  function(err, res){
							if(err){

								Materialize.toast("deso gros: "+err.error.message,3000, "toast-fail");
								console.error(err);
								return;
							}

							Materialize.toast("Removed ! generated!", 3000, "toast-success");
							$("#table_object_"+index).remove();
							$("#button_object_"+index).remove();
						});
					};
				})(res.handleAndObject.entry[i].key.value);
			}
			//$("#objects-data").append("</tbody></table>");
			//htm+="</tbody></table>";
			//$("#objects-data").html(htm);
			$("#modal_objects_display").openModal();
		});
	};
});