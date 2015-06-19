var args = arguments[0] || {};

Alloy.Globals.sendHttpRequest("GetCategoryLookupIndex", "GET", null, storeCategoryLookup);
var categoryDictionary = null;
var crisisHeaders = [];
function storeCategoryLookup(){
	categoryDictionary = JSON.parse(this.responseText);
	
	var allCats = _.pluck(categoryDictionary, 'id');
	
	Alloy.Globals.sendHttpRequest("GetServiceProviders?counties=57&categories=" 
	+ allCats.join(), "GET", null, parseServiceProviders);
}

function parseServiceProviders(){
	
	var crisisHeaders = [];
	var json = JSON.parse(this.responseText);
	
	var crisisProviders = _.filter(json, function(obj){return obj.crisisNumber != null;});
	
_.each(crisisProviders, function(provider){
	crisisHeaders.push(Alloy.createController('serviceProviderRow', {
			name:provider.name,
			crisis: provider.crisisNumber
		}).getView());
});

$.crisisLineTable.setData(crisisHeaders);
}

function callPhoneNumber(e){
    var cleanNumber = e.row.crisis.replace(/\s|-|\./g,'');
    Ti.Platform.openURL('tel:' + cleanNumber);
}


Alloy.Globals.addActionBarButtons($.win);