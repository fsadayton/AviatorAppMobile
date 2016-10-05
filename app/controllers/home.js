/**
 * CONTROLLER FOR HOME VIEW
 */


/**
 * Function that opens the service provider categories view.
 */
function openProviders(){
	Alloy.Globals.open('providerCategories', {title: "Personal Resources"});
	Ti.Analytics.featureEvent('home.select.personalResources');
}

/**
 * Function that opens the law and corrections view.
 */
function openCorrections(){
	Alloy.Globals.open('corrections', {title: "Law & Corrections"});
	Ti.Analytics.featureEvent('home.select.corrections');
}

/**
 * Function that opens the user's personal account view.
 */
function openAccount(){
	Alloy.Globals.open('account', {title: "My Account"});
	Ti.Analytics.featureEvent('home.select.myAccount');

}

/**
 * Function that opens the crisis lines view.
 */
function openCrisisLines(){
	Alloy.Globals.open('crisisLines', {title: "Crisis Contacts"});
		Ti.Analytics.featureEvent('home.select.crisisContacts');
}

/**
 * Function that opens the specialized services view.
 */
function openSpecialServices(){
	Alloy.Globals.open('specializedServicesMenu', {title: "Special Populations"});
	Ti.Analytics.featureEvent('home.select.specialPopulations');
}

/**
 * Function that opens the victim compensation view.
 */
function openVictimCompensation(){
	Alloy.Globals.open('victimCompensation', {title: "Compensation"});
		Ti.Analytics.featureEvent('home.select.victimCompensation');
}

function openTools(){
	
	Alloy.Globals.open('toolsMenu', {title: "Useful Tools"});
}

//initialize android actions
if(Alloy.Globals.isAndroid){
	Ti.API.info("I'm here!!!!");
	Alloy.Globals.addActionBarButtons($.win, [{
		params:{
			title:"My Account",
			icon: "images/user.png",
			showAsAction : Ti.Android.SHOW_AS_ACTION_ALWAYS
		}
		}], 
		function getMenu(menu){
			//Add functionality for sharing a service provider
			var shareItem = _.findWhere(menu.getItems(), {title:"My Account"});
			shareItem.addEventListener("click", openAccount);
		}
	);
}
