var args = arguments[0] || {};

$.headerLabel.text = args.header;
var profileBasics = Alloy.Models.profileBasics;

if(args.counties){
	$.counties.visible = true;
	$.generalTextView.visible = false;
	
	$.countySelector.init(args);
	
	var selectable = require('countySelectorUtils');
	
	function isSelectable(isSelectable){
		selectable.setCountySelectable(isSelectable);
		selectable.setSelectedCounty(null);
	}
	
	function saveCounty(){
		var county = selectable.getSelectedCounty();
		if(county){
			selectable.setCountySelectable(true);
			
			profileBasics.save({
				countyName: county.name,
				countyId: county.id
			});
			
			$.win.close();
		}
		else{
			alert("No county selected!");
		}
	}
}
else{
	$.counties.visible = false;
	$.generalTextView.visible = true;
	$.description.text = args.description;
	
	if(args.sourceId === "website"){
		function saveWebsite(){
			profileBasics.save({
				website:$.generalTextField.value.trim()
			});
			$.win.close();
		}
	}
	else{
		function saveName(){
			profileBasics.save({
				name: $.generalTextField.value.trim()	
			});
			$.win.close();
		}
	}
}


function close(){
	$.win.close();
	
	if(args.counties){
		isSelectable(true);
	}
}

function submit(){
	if(args.counties){
		saveCounty();
	}
	else if(args.sourceId === "website"){
		saveWebsite();
	}
	else{
		saveName();
	}
}
			
Alloy.Globals.addActionBarButtons($.win);

