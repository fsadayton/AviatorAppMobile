
var win = Alloy.Globals.isAndroid ? $.index.getView() : $.nav;

//Only open app home screen if user has agreen to the conditions of use
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
		view.title = args == null || args.title == null  ? "" : args.title; //shows tile name at top of window
		view.open();
	}
	else{ //if iOS, open window in navigation window
		$.nav.openWindow(view);
	}
};
