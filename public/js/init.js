function init () {
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
				console.log("Got slot, adding: ", slot);

				var cd = addCd();
				addSlotDescription(slot, cd);
				if(cd.properties[0].tokenPresent == "yes")
				{
					//if token is there, add the pinche token description to the properties

					app.routing.tokens.getToken(0, function (err, res) {
						var token = tokenFactory(res);
						cd.push(token);
					});
					toastMe();

				}
			}


		})(i));
	}
}

app.routing.setPath(function(err, res, xml){
	console.log("Got session id:");
	if(res == "") throw new Error("Did not get Session ID");
	res = JSON.parse(res);
	config.routing.api.so_path.jsession = res.jsessionid;

	init();
});