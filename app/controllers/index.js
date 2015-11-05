
var win = Alloy.Globals.isAndroid ? $.index.getView() : $.nav;

if(!Ti.App.Properties.getBool("hasAgreedToConditions", false)){
	Alloy.createController("ConditionsOfUse", {index:win}).getView().open();
}
else{
	win.open();
	alert("If this is an emergency, close the app and dial 911.");
}


Alloy.Globals.open = function(controllerName, args){
	var view = Alloy.createController(controllerName, (args || {})).getView();
	if(Alloy.Globals.isAndroid){
		view.open();
	}
	else{
		$.nav.openWindow(view);
	}
};
