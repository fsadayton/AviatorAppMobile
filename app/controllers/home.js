/**
 * CONTROLLER FOR HOME VIEW
 */

/**
 * Function that opens the service provider categories view.
 */
function openProviders(){
	Alloy.Globals.open('providerCategories');
	//Alloy.createController('providerCategories').getView().open();
}

/**
 * Function that opens the law and corrections view.
 */
function openCorrections(){
	Alloy.Globals.open('corrections');
	//Alloy.createController('corrections').getView().open();
}

/**
 * Function that opens the user's personal account view.
 */
function openAccount(){
	Alloy.Globals.open('account');
	//Alloy.createController('account').getView().open();
}

/**
 * Function that opens the crisis lines view.
 */
function openCrisisLines(){
	Alloy.Globals.open('crisisLines');
	//Alloy.createController('crisisLines').getView().open();
}

/**
 * Function that opens the specialized services view.
 */
function openSpecialServices(){
	Alloy.Globals.open('specializedServicesMenu');
	//Alloy.createController('specializedServicesMenu').getView().open();
}

/**
 * Function that opens the victim compensation view.
 */
function openVictimCompensation(){
	Alloy.Globals.open('victimCompensation');
	//Alloy.createController('victimCompensation').getView().open();
}

Alloy.Globals.addActionBarButtons($.win);
