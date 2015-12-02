var args = arguments[0] || {};
var providerSearch = require('providerSearch');

if(Alloy.Globals.isAndroid){
	providerSearch.createAndroidSearchBar($.win, $.providerList);
}

$.providerButtonBar.setProviderListObject($.providerList);

/**
 * Reset menu options to prevent java exception.
 */
function close(){
	providerSearch.nullifyAndroidMenu();
}