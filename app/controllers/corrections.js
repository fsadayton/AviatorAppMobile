var args = arguments[0] || {};
var providerSearch;

if(Alloy.Globals.isAndroid){
	providerSearch = require('providerSearch');
	providerSearch.createAndroidSearchBar($.tabGroup, $.providerList);
}

$.providerButtonBar.setProviderListObject($.providerList);

/**
 * Reset menu options to prevent java exception.
 */
function close(){
	if(Alloy.Globals.isAndroid){
		providerSearch.nullifyAndroidMenu();
	}
}
