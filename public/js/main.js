/* ################ PKCS WEB INTERFACE ############ */
/*					   JS module					*/
/* ################################################ */

/* Objects definitions */
function info(id, hardwareSlot, manufacturerID, removableDevice, slotDescription, tokenPresent)
{
	this.name = "informations";
	this.id=id;
	this.hardwareSlot = hardwareSlot;
	this.manufacturerID = manufacturerID;
	this.removableDevice = removableDevice;
	this.slotDescription = slotDescription;
	this.tokenPresent = tokenPresent;
	this.display = function display(){ //return text pannel with fields of the slot. the id of this device is "sl-*its number*"	
		var res = "<li><div class='collapsible-header'>"+this.name+"</div>";
        res += "<div class='collapsible-body'><table class='striped '><thead><tr><th data-field='id'>Name</th><th data-field='name'>Value</th></tr></thead><tbody>";
		for(e in this)
		{
			if(e != "display" && e != "name")
			{
				res +="<tr><td>"+e+"</td><td>"+this[e]+"</td></td>";	
			}
			
		}
		res +="</tbody></table></div></li>";
		
		return res;
	}
}
function action(name, action)
{
	this.name = name;
	this.action = action;
}
function managment(listOfPossibleActions)
{
	this.name ="Managment";
	this.name.display = false;
	this.mngOperations = new Array(listOfPossibleActions);
	this.addMngOperation = function _addMngOperation(op){// function to add.
		this.mngOperations.push(op);
	}
	this. display =function display(){ //return html of the table  Needs further bind for .click() operations
		var res = "<li><div class='collapsible-header'>"+this.name+"</div>";
        res += "<div class='collapsible-body'><table class='striped '><thead><tr><th data-field='id'>Action</th></tr></thead><tbody>";
		for(var i=0;i< this.mngOperations.length;i++)
		{

				res +="<tr><td><input type='submit' id='mng-"+i+"' value='"+this.mngOperations[i].name+"'></input></td></tr>";
			
			
		}
		res +="</tbody></table></div></li>";
		
		return res;
	}
}
function cryptOperations(listOfPossibleActions)
{
	this.name ="Crypto-Operations";
	this.name.display = false;
	this.crtOperations = new Array(listOfPossibleActions);
	this.addCrtOperation = function _addCrtOperation(op){// function to add.
		this.crtOperations.push(op);
	}
	this. display =function display(){ ////return html of the table. Needs further bind for .click() operations
		var res = "<li><div class='collapsible-header'>"+this.name+"</div>";
        res += "<div class='collapsible-body'><table class='striped '><thead><tr><th data-field='id'>Action</th></tr></thead><tbody>";
		for(var i=0;i< this.crtOperations.length;i++)
		{

				res +="<tr><td><input type='submit' id='crt-"+i+"' value='"+this.crtOperations[i].name+"'></input></td></tr>";	

			
		}
		res +="</tbody></table></div></li>";
		
		return res;
	}
}
function cryptoDevice()
{
	this.id = singleId();
	this.properties =new Array();
	this.nbSlots = function _nbSlots(){ return this.properties.length;};
	this.display = function _display(){
		var res ="<div class='col s3' id='cd-"+this.id+"'>";
		res +="<div class ='card-panel'> Slot "+ this.id;
		res += "<a href='#' class='secondary-content'><i class='material-icons' id='rd-cd-"+this.id+"'>remove</i></a></div>"; 	// reduce button
		res += "<div><ul class='collapsible' data-collapsible='accordion'>";
		for(var i=0; i<this.nbSlots(); i++)
		{
			res += this.properties[i].display();
		}
		res +="</ul></div>";
		return res;
	}
	this.push = function _pushSlot(slot){
		this.properties.push(slot);
		var t = $("#cd-"+this.id);
		if(t.length!=0)
		{
			//element already displayed
			unDisplayCd(this.id)
			displayCd(this.id);
		}
	}



}

/* Global Variables */

var cdList = new Array();
function findIndexById(id)
{

		for(var i=0;i<cdList.length;i++)
		{
			if(cdList[i].id == id)
				return i;
		}
		return -1;
}
var iter=0; // global variable to create unique ids for CDs.
function singleId()
{
	var ret = iter;
	iter ++;
	return ret ;
}//to increment each time we use the variable

/* pks11 api interface  request     */
//fonctions to call the api

/* pks11 api interface answers      */
//fonctions to treat api responses

function addSlotDescription(JsonAnswer, cD)//adds a slot from Json answer into the crypto-device
{
	//create the object
	var sl = new slot();
	//create 
	var tmp = JSON.parse(JsonAnswer);
	sl.hardwareSlot = tmp.hardwareSlot;
	sl.manufacturerID = tmp.manufacturerID;
	sl.removableDevice = tmp.removableDevice;
	sl.slotDescription  = tmp.slotDescription;
	sl.tokenPresent = tmp.tokenPresent;
	//push the object
	cD.push(sl);
	// actualize collapsed list
	actualizeList();
	//actualize display in central pannel if there
	var t = $("#cd-"+id);
	if(t.length!=0)
	{
		//element already displayed
		unDisplayCd(cD)
		displayCd(cD);
	}
}
/************* utilities **************************************/
function returnPropByName(cD, name)
{
	for(var i=0;i<cD.properties.length;i++)
	{
		if (cD.properties[i].name == name)
			return cD.properties[i];
	} 
	console.log("error, unexisting property");
	return -1;
}
function addCd()// returns a new cd.
{
	var cD = new cryptoDevice(); 
	cdList.push(cD);
	displayCd(cD.id);
	actualizeList();
	return cD;
}
function removeCd(id)//removes a CD from the cryptoDevice list in the position position (integer Required)
{
	console.log("id received:");
	console.log(id);
	var position = findIndexById(id);
	console.log("index received:");
	console.log(position);
	// we can think to pup up a confirmation panel here

	cdList.splice(position, 1);
	//if displayed, remove
	unDisplayCd(id);	
	//actualize display of collapsed list
	actualizeList();
}
function displayCd(id)//display a CD selected int the central panel
{
	//We first test if the element is not already displayed
	var t = $("#cd-"+id);
	if(t.length!=0)
	{
		//element already displayed
		Materialize.toast('crypto-device already displayed !', 4000);
	}
	else
	{
		//display it
		var position = findIndexById(id);
		var cD = cdList[position];
		var tmp= $('#display-panel').html();
		console.log(tmp);
		$('#display-panel').append(cD.display());
		$("#rd-cd-"+cD.id).click((function _clicRm(index){
																			return function _undispCd()
																										{
																											unDisplayCd(cdList[index].id);
																										}
																			})(position)
										);// add actions to the displayed div

		for(var i = 0; i< cD.properties.length;i++)
		{
			switch(cD.properties[i].name)
			{
				case "Managment":
					for(var j=0;j<cD.properties[i].mngOperations.length; j++)
						$("#cd-"+cD.id+" #mng-"+j).click(cD.properties[i].mngOperations[j].action); // add all operation interactions
				break;
				case "Crypto-Operations":
					for(var j=0;j<cD.properties[i].crtOperations.length; j++)
						$("#cd-"+cD.id+" #crt-"+j).click(cD.properties[i].crtOperations[j].action); // add all operation interactions
				break;
			}
			
			
		}	
		$('.collapsible').collapsible({
      							accordion : false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
    									});
	}	
}

function unDisplayCd(id)//remove CD selected int the central panel
{
	
	console.log("id :");
	console.log(id);
	$("#cd-"+id).remove();

}

function actualizeList()// actualize the collapsing list with the array of devices
{
	var res="";
	$("#crypto-list").html("");
	console.log("cd list :");
	console.log(cdList);
	if (cdList.length !=0)
	{
		for(var e=0; e<cdList.length; e++)
		{
			console.log("element :");
			console.log(cdList[e]);
			console.log("param rec:");
			console.log(cdList[e].id);
			if(e !='undefined')
			{
				res +="<li class='collection-item' id='cList-"+cdList[e].id+"'>crypto-device number : "+cdList[e].id;
				res +="<a href='#' class='secondary-content'><i class='material-icons' id='rm-cd-"+cdList[e].id+"'>close</i></a>";// adds delete button
				res +="<a href='#' class='secondary-content'><i class='material-icons' id='dp-cd-"+cdList[e].id+"'>add</i></a></li>";// adds show button
				$("#crypto-list").html($("#crypto-list").html()+res);														
				res="";
			}
		}
		for(var e=0; e<cdList.length; e++)
		{

			$("#rm-cd-"+cdList[e].id).click((function _clicRm(index){
																			return function _removeCd()
																										{
																											removeCd(cdList[index].id);
																										}
																			})(e)	
													);
			$("#dp-cd-"+cdList[e].id).click((function _clicRm(index){
																			return function _displayCd()
																										{
																											displayCd(cdList[index].id);
																										}
																			})(e)	
													);		
		}							
	}
		
}
function yolo(){return "yolo";}
function testCd(nb)// test function that display a random cD into the central panel
{
	 if (typeof(nb)==='undefined') nb = 1;
	var cD = new cryptoDevice();
	sl = new info();
	sl.id=nb;
	sl.hardwareSlot = "yes";
	sl.manufacturerID = "yes";
	sl.removableDevice = "yes"
	sl.slotDescription  = "yes";
	sl.tokenPresent = "yes";
	cD.push(sl);
	act = new action("toast", toastMe)
	mg = new managment(act);
	cD.push(mg);
	cO = new cryptOperations(act);
	cD.push(cO);
	cdList.push(cD);
	displayCd(cD.id);
	actualizeList();
}

/* graphic environment set up       */

	$(".button-collapse").sideNav();
	$('.modal-trigger').leanModal();
	$(document).ready(function(){
    $('.collapsible').collapsible({
      accordion : false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
    });
  });
/* testing functionnalites, debug  */

function toastMe()
{
	Materialize.toast("it's a toast !", 4000);
}
	testCd(1);
	testCd(1);
	testCd(1); // just for testing functionalities
	// sl = new Array();
	// sl.functional="yes";
	// sl.display = function _disp(){return sl.functional};
	// cdList[0].push(sl);
	actualizeList();
