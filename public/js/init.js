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
				if(cd.properties[0].tokenPresent == true){
					//if token is there, add the pinche token description to the properties

					app.routing.tokens.getToken(0, function (err, res) {
						console.info("Got token", JSON.parse(res));
						var token = tokenFactory(res);
						console.log("Token from factory", token);
						console.log("Adding to cd...");
						cd.push(token);
						console.log("Added to cd:", cd);
						$("#loading_modal").closeModal();
						Materialize.toast("Module loaded succesfully!", 3000);
					});

				}
			}


		})(i));
	}
}


function loadModule (path) {
	if(app.paths.history.indexOf(path) < 0) app.paths.history.push(path);
	app.paths.current = path;

	$("#loading_modal").openModal();
	app.routing.setPath(function(err, res, xml){
		console.log("Got session id:");
		if(res == "") throw new Error("Did not get Session ID");
		res = JSON.parse(res);
		config.routing.api.so_path.jsession = res.jsessionid;

		module_getSlotNumber();
	});
	
}

document.getElementById("button_load_module").addEventListener("click", function(e){
	e.preventDefault();
	var path = document.getElementById("path_to_so");
	if (path.value == "") {
		path.style.outline = "#AA0000 solid 1px"; 
		return;
	}

	loadModule(path.value); 
});