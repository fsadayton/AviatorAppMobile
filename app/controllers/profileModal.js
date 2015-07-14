var args = arguments[0] || {};

function close(){
	$.win.close();
}
			
function closeWin(){
	$.win.close();
}
	
function saveCounty(county){
	Ti.API.info("county name: " + county.name);
	Ti.API.info("county id: "+ county.id);
		
	$.win.close();
}
Alloy.Globals.addActionBarButtons($.win);
args.callbacks = {leftCallback:closeWin, rightCallback:saveCounty};
$.countySelector.init(args);
