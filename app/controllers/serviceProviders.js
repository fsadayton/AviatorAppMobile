var args = arguments[0] || {};
var providerSearch = require('providerSearch');

$.crisisMenu.search = Alloy.createController("searchView").getView();

if(Alloy.Globals.isAndroid){
	providerSearch.createAndroidSearchBar($.tabGroup, $.providerList);
}
$.providerList.setCategories(args.categories);
$.providerList.setCrisisMenu($.crisisMenu);
$.providerButtonBar.setProviderListObject($.providerList);

/**
 * Automatically opens phone app to call crisis line
 */
function callPhoneNumber(e){
    var cleanNumber = e.row.crisis.replace(/\s|-|\./g,'');
    Ti.Platform.openURL('tel:' + cleanNumber);
}

/**
 * When tab changes, change the table with which the search function is associated. 
 */
$.tabGroup.addEventListener("focus", function(e) {
	if($.tabGroup.activeTab.title === "NEARBY" && $.providerList.getListView().search != null){
		providerSearch.changeSearchActionView($.providerList.getListView().search);
	}
	else if($.tabGroup.activeTab.title === "QUICK CALL"){
		providerSearch.changeSearchActionView($.crisisMenu.search);
	}
});

/**
 * Reset menu options to prevent java exception.
 */
function close(){
	providerSearch.nullifyAndroidMenu();
}
