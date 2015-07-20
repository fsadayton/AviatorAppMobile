var args = arguments[0] || {};

$.headerLabel.text = args.header;
if(args.counties){
	$.countySelector.init(args);
	
	var selectable = require('countySelectorUtils');
	
	function isSelectable(isSelectable){
		selectable.setCountySelectable(isSelectable);
		selectable.setCounty(null);
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
}


function close(){
	$.win.close();
	
	if(isSelectable){
		isSelectable(true);
	}
}

function submit(){
	var county = selectable.getSelectedCounty();
	if(county){
		selectable.setCountySelectable(true);
		saveCounty(county);
	}
	else{
		alert("No county selected!");
	}
}
			
Alloy.Globals.addActionBarButtons($.win);

