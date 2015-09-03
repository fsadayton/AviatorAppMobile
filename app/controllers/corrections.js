var args = arguments[0] || {};
var providerSearch = require('providerSearch');

if(Alloy.Globals.isAndroid){
	providerSearch.createAndroidSearchBar($.tabGroup, $.providerList);
}

$.providerButtonBar.setProviderListObject($.providerList);

/**
 * Reset menu options to prevent java exception.
 */
function close(){
	providerSearch.nullifyAndroidMenu();
}
