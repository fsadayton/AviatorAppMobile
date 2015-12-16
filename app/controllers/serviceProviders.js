var args = arguments[0] || {};

$.crisisMenu.filterAttribute = Alloy.Globals.isAndroid ? "title" : "orgName";

if(Alloy.Globals.isAndroid){
	var providerSearch = require('providerSearch');
	$.crisisMenu.search = Alloy.createController("searchView").getView();
	providerSearch.createAndroidSearchBar($.tabGroup, $.providerList);
	
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

function onLeftTabClick(){
	$.tab1.visible = true;
	$.tab2.visible = false;
	
	$.leftTab.tintColor = "#009577";
	$.rightTab.tintColor = "#929292";
}

function onRightTabClick(){
	$.tab1.visible = false;
	$.tab2.visible = true;
	
	$.rightTab.tintColor = "#009577";
	$.leftTab.tintColor = "#929292";;
}

/**
 * Reset menu options to prevent java exception.
 */
function close(){
	providerSearch.nullifyAndroidMenu();
}
