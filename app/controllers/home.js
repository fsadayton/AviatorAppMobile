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
	Alloy.Globals.open('specializedServicesMenu', {title: "Specialized Services"});
		Ti.Analytics.featureEvent('home.select.specialPopulations');

}

/**
 * Function that opens the victim compensation view.
 */
function openVictimCompensation(){
	Alloy.Globals.open('victimCompensation', {title: "Compensation"});
		Ti.Analytics.featureEvent('home.select.victimCompensation');

}

Alloy.Globals.addActionBarButtons($.win);
