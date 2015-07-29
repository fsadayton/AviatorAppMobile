var args = arguments[0] || {};

$.headerLabel.text = args.header;
var profileBasics = Alloy.Models.profileBasics;

if(args.counties){
	$.counties.visible = true;
	$.generalTextView.visible = false;
	$.subTextView.visible = false;
	
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
	else if(args.sourceId === "nameField"){
		function saveName(){
			profileBasics.save({
				name: $.generalTextField.value.trim()	
			});
			$.win.close();
		}
	}
	else{
		Ti.API.info("in the else");
		$.subTextView.visible = true;
		$.subDescription.text = args.subDescription;
		if(args.name){
			$.generalTextField.value = args.name;
			$.subTextField.value = args.phone;
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
	else if(args.sourceId === "nameField"){
		saveName();
	}
	else{
		var modelUtils = require('modelUtils');
		var phone = $.subTextField.value.trim();
		var name = $.generalTextField.value.trim();
		if(args.modelId){
			modelUtils.updateTrustedContact(args.modelId, name, phone, $.win);
		}
		else{
			modelUtils.storeTrustedContact(phone, name, $.win);
		}		
	}
}
			
Alloy.Globals.addActionBarButtons($.win);
