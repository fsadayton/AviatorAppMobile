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
				county: county.name	
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
	
	function saveName(){
		//args.updateElement.value = $.generalTextField.value;
		profileBasics.save({
			name: $.generalTextField.value.trim()	
		});
		$.win.close();
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
	else{
		saveName();
	}
}
			
Alloy.Globals.addActionBarButtons($.win);

