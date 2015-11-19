/**
 * CONTROLLER FOR HOME VIEW
 */

/**
 * Function that opens the service provider categories view.
 */
function openProviders(){
	Alloy.Globals.open('providerCategories', {title: "Personal Resources"});
}

/**
 * Function that opens the law and corrections view.
 */
function openCorrections(){
	Alloy.Globals.open('corrections', {title: "Law & Corrections"});
}

/**
 * Function that opens the user's personal account view.
 */
function openAccount(){
	Alloy.Globals.open('account', {title: "My Account"});
}

/**
 * Function that opens the crisis lines view.
 */
function openCrisisLines(){
	Alloy.Globals.open('crisisLines', {title: "Crisis Contacts"});
}

/**
 * Function that opens the specialized services view.
 */
function openSpecialServices(){
	Alloy.Globals.open('specializedServicesMenu', {title: "Specialized Services"});
}

/**
 * Function that opens the victim compensation view.
 */
function openVictimCompensation(){
	Alloy.Globals.open('victimCompensation', {title: "Compensation"});
}

Alloy.Globals.addActionBarButtons($.win);
