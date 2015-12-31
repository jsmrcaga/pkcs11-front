function init () {
	app.routing.slots.getSlotNumber(function (err, nb){
		if(err){
			console.error(err);
			return;
		} 

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

				var cd = addCd();
				addSlotDescription(slot, cd);
			}


		})(i));
	}
}