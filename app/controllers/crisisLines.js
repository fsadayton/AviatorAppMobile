var args = arguments[0] || {};

//send request to get all categories
Alloy.Globals.sendHttpRequest(Alloy.CFG.appData + "GetCategoryLookupIndex", "GET", null, storeCategoryLookup); 

var categoryDictionary = null;
var crisisHeaders = [];
$.activityIndicator.show();

//set search filter attribute based on platform
$.crisisLineTable.filterAttribute = Alloy.Globals.isAndroid ? "title" : "orgName";

/**
 * Processes call to get all categories and then sends another request to get 
 * service providers in preferred county.
 */
function storeCategoryLookup(){
	categoryDictionary = JSON.parse(this.responseText);
	
	var allCats = _.pluck(categoryDictionary, 'id');
	
	Alloy.Globals.sendHttpRequest(Alloy.CFG.appData + "GetServiceProviders?counties=" 
		+ Alloy.Models.profileBasics.get('countyId') + "&categories=" 
		+ allCats.join("&categories="), "GET", null, parseServiceProviders);
}

/**
 * Parses all service providers and only displays service providers with 
 * crisis numbers. 
 */
function parseServiceProviders(){
	
	var crisisHeaders = [];
	var json = JSON.parse(this.responseText);
	
	var crisisProviders = _.filter(json, function(obj){return obj.crisisNumber != null;});
	
	_.each(crisisProviders, function(provider){
		crisisHeaders.push(Alloy.createController('serviceProviderRow', {
				orgName:provider.name,
				crisis: provider.crisisNumber
			}).getView());
	});
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
}]);	
}
