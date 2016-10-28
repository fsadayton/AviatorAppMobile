var args = arguments[0] || {};

//send request to get all categories
Alloy.Globals.sendHttpRequest(Alloy.CFG.crisisApi + "GetCrisisContacts", "GET", null, parseServiceProviders); 

var categoryDictionary = null;
var crisisHeaders = [];
$.activityIndicator.show();

//set search filter attribute based on platform
$.crisisLineTable.filterAttribute = Alloy.Globals.isAndroid ? "title" : "orgName";

/**
 * Parses all service providers and only displays service providers with 
 * crisis numbers. 
 */
function parseServiceProviders(){
	
	var crisisHeaders = [];
	var json = JSON.parse(this.responseText);
	if(_.isEmpty(json)){
		alert("There are no crisis numbers at this time.");
	}
	else{
		_.each(json, function(provider){
			crisisHeaders.push(Alloy.createController('serviceProviderRow', {
					orgName:provider.name,
					crisis: provider.phoneNumber
				}).getView());
		});
	}
	
	$.activityIndicator.hide();
	$.crisisLineTable.setData(crisisHeaders);
}

/**
 * Function that brings up a phone dialog to call the pressed phone number
 * @param {Object} e
 */
function callPhoneNumber(e){
    var cleanNumber = e.row.crisis.replace(/\s|-|\./g,'');
    Ti.Platform.openURL('tel:' + cleanNumber);
}

function openMessage(){
	Alloy.createController("alertDialog", {
	title: "Help",
	message:"All of the providers listed here can be called 24 hours a day, 7 days a week during your time of need. Tap on any provider to be immediately connected with a counselor. Would you like to visit Youtube for a tutorial?",
	callback: function(){
		Ti.Platform.openURL("https://www.youtube.com/playlist?list=PL5h6KCzb5JtT3n7fjEvtRrhlVk1aEEP20");
	}
	}).getView().show();
}
//set search for android
if(Alloy.Globals.isAndroid){
	$.crisisLineTable.search = Alloy.createController("searchView").getView();
	Alloy.Globals.addActionBarButtons($.win, [{
	params:{
		title: "search...",
		icon: Ti.Android.R.drawable.ic_menu_search,
		actionView: $.crisisLineTable.search,
		showAsAction : Ti.Android.SHOW_AS_ACTION_ALWAYS
	}
},
{
	params:{
		title:"Help",
		icon: "images/question30.png",
		showAsAction : Ti.Android.SHOW_AS_ACTION_COLLAPSE_ACTION_VIEW
	}
	}],
	function getMenu(menu){
		//Add functionality for sharing a service provider
		var shareItem = _.findWhere(menu.getItems(), {title:"Help"});
		shareItem.addEventListener("click", openMessage);
	});	
}
