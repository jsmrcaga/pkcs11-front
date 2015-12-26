/* ################ PKCS WEB INTERFACE ############ */
/*					   JS module					*/
/* ################################################ */

/* Objects definitions */
function cryptoDevice(hardwareSlot, manufacturerID, removableDevice, slotDescription, tokenPresent)
{
	this.hardwareSlot = hardwareSlot;
	this.manufacturerID = manufacturerID;
	this.removableDevice = removableDevice;
	this.slotDescription = slotDescription;
	this.tokenPresent = tokenPresent;

	this.display = function display(){ //return text pannel with fields of the device.
		var res ="<div class='col s3 card-panel'><table class='striped'><thead><tr><th data-field='id'>Name</th><th data-field='name'>Value</th></tr></thead><tbody>";
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

var cdList = new Array();

/* graphic environment set up       */

	$(".button-collapse").sideNav();
	$('.modal-trigger').leanModal();


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
		//to implement
	// display in central pannel
	displayCd(cD);
}
function removeCd(position)//removes a CD from the cryptoDevice list in the position position (integer Required)
{
	// we can think to pup up a confirmation panel here
	cdList.splice(position, 1);
	//if displayed, remove
		//to implement
	//actualize display of collapsed list
}
function displayCd(cD)//display a CD selected int the central panel
{
	var tmp= $('#display-panel').html();
	console.log(tmp);
	$('#display-panel').html(tmp + cD.display());
	//to implement
}
function testDisp()// test function that display a random cD into the central panel
{
	var cD = new cryptoDevice();
	cD.hardwareSlot = "yes";
	cD.manufacturerID = "yes";
	cD.removableDevice = "yes"
	cD.slotDescription  = "yes";
	cD.tokenPresent = "yes";
	displayCd(cD);
}