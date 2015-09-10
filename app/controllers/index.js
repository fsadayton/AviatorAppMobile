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
 * Function that opens the specialized services view.
 */
function openSpecialServices(){
	Alloy.createController('specializedServicesMenu').getView().open();
}

/**
 * Function that opens the victim compensation view.
 */
function openVictimCompensation(){
	Alloy.createController('victimCompensation').getView().open();
}

if(!Ti.App.Properties.getBool("hasAgreedToConditions", false)){
	Alloy.createController("ConditionsOfUse", {index:$.index}).getView().open();
}
else{
	$.index.open();
	alert("If this is an emergency, close the app and dial 911.");

}

Alloy.Globals.addActionBarButtons($.index);
