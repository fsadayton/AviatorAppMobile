
var win = Alloy.Globals.isAndroid ? $.index.getView() : $.nav;

if(!Ti.App.Properties.getBool("hasAgreedToConditions", false)){
	Alloy.createController("ConditionsOfUse", {index:win}).getView().open();
}
else{
	win.open();
	alert("If this is an emergency, close the app and dial 911.");
}


Alloy.Globals.open = function(controllerName, args){
	Ti.API.info("open");
	var view = Alloy.createController(controllerName, (args || {})).getView();
	Ti.API.info(view.tabs == null);
	if(Alloy.Globals.isAndroid){
		view.title = args == null || args.title == null  ? "" : args.title; //shows tile name at top of window
		view.open();
	}
	else{
		$.nav.openWindow(view);
		/*if(view.tabs == null){
			$.nav.openWindow(view);
		}
		else{
			view.open();
		}*/
	}
};
