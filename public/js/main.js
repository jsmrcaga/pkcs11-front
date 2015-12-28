/* ################ PKCS WEB INTERFACE ############ */
/*					   JS module					*/
/* ################################################ */

/* Objects definitions */
function cryptoDevice(id, hardwareSlot, manufacturerID, removableDevice, slotDescription, tokenPresent)
{
	this.id=id;
	this.hardwareSlot = hardwareSlot;
	this.manufacturerID = manufacturerID;
	this.removableDevice = removableDevice;
	this.slotDescription = slotDescription;
	this.tokenPresent = tokenPresent;
	this.display = function display(){ //return text pannel with fields of the device. the id of this device is "cd-*its number*"
		var res ="<div class='col s3 card-panel' id='cd-"+this.id+"'><table class='striped'><thead><tr><th data-field='id'>Name</th><th data-field='name'>Value</th></tr></thead><tbody>";
		for(e in this)
		{
			if(e != "display")
			{
				res +="<tr><td>"+e+"</td><td>"+this[e]+"</td></td>";	
			}
			
		}
		res +="</tbody></table></div>";
		return res;
	}
}


/* Global Variables */

var cdList = [];
function findIndexById(id)
{

		for(var i=0;i<cdList.length;i++)
		{
			if(cdList[i].id == id)
				return i;
		}
		return -1;
}


/* pks11 api interface  request     */
//fonctions to call the api


/* pks11 api interface answers      */
//fonctions to treat api responses

function addCd(JsonAnswer)//adds a CD from Json answer into the crypto-device list
{
	//create the object
	var cD = new cryptoDevice();
	var tmp = JSON.parse(JsonAnswer);
	cD.hardwareSlot = tmp.hardwareSlot;
	cD.manufacturerID = tmp.manufacturerID;
	cD.removableDevice = tmp.removableDevice;
	cD.slotDescription  = tmp.slotDescription;
	cD.tokenPresent = tmp.tokenPresent;
	//push the object
	cdList.push(cD);
	// actualize collapsed list
	actualizeList();
	// display in central pannel
	displayCd(cD);
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
function displayCd(cD)//display a CD selected int the central panel
{
	var tmp= $('#display-panel').html();
	console.log(tmp);
	$('#display-panel').html(tmp + cD.display());
	//to implement
}
function unDisplayCd(id)//remove CD selected int the central panel
{
	
	console.log("id :");
	console.log(id);
	$("#cd-"+id).remove();

}

function actualizeList()
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
				res +="<a href='#' class='secondary-content'><i class='material-icons' id='rm-cd-"+cdList[e].id+"'>close</i></a></li>";
				$("#crypto-list").html($("#crypto-list").html()+res);														
				res="";
			}
		}
		for(var e=0; e<cdList.length; e++)
		{
			$("#rm-cd-"+cdList[e].id).click((function _clicRm(index){
				return function _removeCd(){
					removeCd(cdList[index].id);
				}
			})(e));	
		}							
	}
		
}

function testDisp(nb)// test function that display a random cD into the central panel
{
	 if (typeof(nb)==='undefined') nb = 1;
	var cD = new cryptoDevice();
	cD.id=nb;
	cD.hardwareSlot = "yes";
	cD.manufacturerID = "yes";
	cD.removableDevice = "yes"
	cD.slotDescription  = "yes";
	cD.tokenPresent = "yes";
	cdList.push(cD);
	displayCd(cD);
	actualizeList();
}

/* graphic environment set up       */

	$(".button-collapse").sideNav();
	$('.modal-trigger').leanModal();
	testDisp(1);
	testDisp(2);
	testDisp(3);
	actualizeList();