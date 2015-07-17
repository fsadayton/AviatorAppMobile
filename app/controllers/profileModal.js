var args = arguments[0] || {};

args.callbacks = {leftCallback:closeWin, rightCallback:saveCounty};
$.countySelector.init(args);

function close(){
	$.win.close();
}
			
function closeWin(){
	$.win.close();
}
	
function saveCounty(county){
	Ti.API.info("county name: " + county.name);
	Ti.API.info("county id: "+ county.id);
	
	var profileBasics = Alloy.Models.profileBasics;
	profileBasics.save({
		county: county.name	
	});

	args.updateElement.value = county.name;

	$.win.close();
}
Alloy.Globals.addActionBarButtons($.win);

