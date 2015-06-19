/**
 * CONTROLLER FOR HOME VIEW
 */

/**
 * Function that opens the service provider categories view.
 */
function openProviders(){
	Alloy.createController('providerCategories').getView().open();
}

/**
 * Function that opens the law and corrections view.
 */
function openCorrections(){
	Alloy.createController('corrections').getView().open();
}

/**
 * Function that opens the user's personal account view.
 */
function openAccount(){
	Alloy.createController('account').getView().open();
}

/**
 * Function that opens the crisis lines view.
 */
function openCrisisLines(){
	Alloy.createController('crisisLines').getView().open();
}

/**
 * Function that opens the veteran services view.
 */
function openVeteranServices(){
	Alloy.createController('veteranServices').getView().open();
}

/**
 * Function that opens the victim compensation view.
 */
function openVictimCompensation(){
	Alloy.createController('victimCompensation').getView().open();
}

//open the home view
$.index.open();


Alloy.Globals.addActionBarButtons($.index);

alert("If this is an emergency, close the app and dial 911.");

