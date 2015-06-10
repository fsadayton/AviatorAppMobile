function providers(){
	Alloy.createController('providerCategories').getView().open();
}

function incarceration(){
	//Alloy.createController('incarceration').getView().open();
	Ti.Platform.openURL("https://www.vinelink.com/");
}

function account(){
	Alloy.createController('account').getView().open();
}

function crisisLines(){
	Alloy.createController('crisisLines').getView().open();
}

$.index.open();


Alloy.Globals.addActionBarButtons($.index);

alert("If this is an emergency, close the app and dial 911.");

