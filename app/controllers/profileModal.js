var args = arguments[0] || {};

$.headerLabel.text = args.header;
var profileBasics = Alloy.Models.profileBasics;

//if counties are part of the args, initialize county selection functions
if(args.counties){
	
	//set visibilities of fields
	$.counties.visible = true;
	$.generalTextView.visible = false;
	$.subTextView.visible = false;
	
	args.countyCallback = updateSelection;
	$.countySelector.init(args);
	
	var selectable = require('countySelectorUtils');
	
	/**
	 * upon submission, try to persist county
	 */
	function saveCounty(){
		var county = selectable.getSelectedCounty();
		if(county){
			selectable.setCountySelectable(true);
			
			profileBasics.save({
				countyName: county.name,
				countyId: county.id
			});
			Ti.Analytics.featureEvent('myAccount.county.' + county.name);
			$.win.close();
		}
		else{
			alert("No county selected!");
		}
	}
	
	/**
	 * Function for updating selected county if only one county can be 
	 * selected at a time.
	 */
	function updateSelection(countyId, countyName, isNew){
		if(isNew){
			selectable.setSelectedCounty({id:countyId, name:countyName});
			selectable.setCountySelectable(false);
		}
		else{
			selectable.setSelectedCounty(null);
			selectable.setCountySelectable(true);
		}
	}
}
else{
	//set visibilities of appropriate fields
	$.counties.visible = false;
	$.generalTextView.visible = true;
	$.description.text = args.description;
	
	//initialize save website function
	if(args.sourceId === "website"){
		//function that persists website url
		function saveWebsite(){
			if($.generalTextField.value.trim().length == 0){
				alert("Please enter a value before saving");
			}
			else{
				profileBasics.save({
					website:$.generalTextField.value.trim()
				});
				$.win.close();
			}
			
		}
	}
	else if(args.sourceId === "nameField"){ //initialize save name fucntion
		//function that persists new name for user
		function saveName(){
			if($.generalTextField.value.trim().length == 0){
				alert("Please enter a value before saving");
			}
			else{
				profileBasics.save({
					name: $.generalTextField.value.trim()
				});
				$.win.close();
			}
		}
	}
	else{ //profile modal is used to add/update trusted contact
		$.subTextView.visible = true;
		$.subDescription.text = args.subDescription;
		if(args.name){ //indicates that trusted contact is being updated, not added
			$.generalTextField.value = args.name;
			$.subTextField.value = args.phone;
		}
	}
}

/**
 * function executed upon closing modal window using X button
 */
function close(){
	$.win.close();
	
	if(args.counties){
		//reset selected counties
		selectable.setCountySelectable(true);
		selectable.setSelectedCounty(null);
	}
}

/**
 * function executed upon submitting information entered into modal window
 */
function submit(){
	if(args.counties){
		saveCounty(); //persist entered county of interest
	}
	else if(args.sourceId === "website"){
		saveWebsite(); //persist quick-hide website
	}
	else if(args.sourceId === "nameField"){
		saveName(); //persist name of user
	}
	else{
		//persist trusted contact info
		var modelUtils = require('modelUtils');
		var phone = $.subTextField.value.trim() === args.phone ? null : $.subTextField.value.trim();
		var name = $.generalTextField.value.trim();
		if(args.modelId && ((phone != null && phone.length > 0) || phone == null) && name.length > 0){
			modelUtils.updateTrustedContact(args.modelId, name, phone, $.win);
		}
		else if(phone.length > 0 && name.length > 0){
			modelUtils.storeTrustedContact(phone, name, $.win);
		}		
		else{
			alert("Please enter a value before saving.");
		}
	}
}
			
Alloy.Globals.addActionBarButtons($.win);
