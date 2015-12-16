var args = arguments[0] || {};

Alloy.Globals.sendHttpRequest(Alloy.CFG.appData + "GetCategoryLookupIndex", "GET", null, storeCategoryLookup);
var categoryDictionary = null;
var crisisHeaders = [];
$.activityIndicator.show();

$.crisisLineTable.filterAttribute = Alloy.Globals.isAndroid ? "title" : "orgName";

function storeCategoryLookup(){
	categoryDictionary = JSON.parse(this.responseText);
	
	var allCats = _.pluck(categoryDictionary, 'id');
	
	Alloy.Globals.sendHttpRequest(Alloy.CFG.appData + "GetServiceProviders?counties=" 
		+ Alloy.Models.profileBasics.get('countyId') + "&categories=" 
		+ allCats.join("&categories="), "GET", null, parseServiceProviders);
}

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

function callPhoneNumber(e){
    var cleanNumber = e.row.crisis.replace(/\s|-|\./g,'');
    Ti.Platform.openURL('tel:' + cleanNumber);
}

$.crisisLineTable.search = Alloy.createController("searchView").getView();

if(Alloy.Globals.isAndroid){
	Alloy.Globals.addActionBarButtons($.win, [{
	params:{
		title: "search...",
		icon: Ti.Android.R.drawable.ic_menu_search,
		actionView: $.crisisLineTable.search,
		showAsAction : Ti.Android.SHOW_AS_ACTION_ALWAYS
	}
}]);	
}
