var args = arguments[0] || {};
var providerSearch;

if(Alloy.Globals.isAndroid){
	providerSearch = require('providerSearch');
	providerSearch.createAndroidSearchBar($.tabGroup, $.providerList);
}
else{
	var args = {
		description: "VINE allows crime victims to obtain timely and reliable information about criminal cases and the custody status of offenders 24 hours a day.",
		website: "https://www.vinelink.com/",
		hasApp:true,
		orgName:"Victim Information and Notification Everyday"
	};

	var view = Alloy.createController('providerDetail', args).getView('container');
	
	$.tab2.add(view);
}

$.providerButtonBar.setProviderListObject($.providerList);

/**
 * Reset menu options to prevent java exception.
 */
function close(){
	providerSearch.nullifyAndroidMenu();
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
	$.leftTab.tintColor = "#929292";

}

