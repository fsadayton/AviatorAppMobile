var args = arguments[0] || {};

var profileBasics = Alloy.Models.profileBasics;
var countySelector = require("countySelectorUtils");
var previouslySelected = $.profile; //initialize "selected" view as profileInfo view

//retrieve most recent info from collections and model
Alloy.Collections.trustedContacts.fetch();
Alloy.Collections.favorites.fetch();
profileBasics.fetch();

//initialize android actions
if(Alloy.Globals.isAndroid){
	Alloy.Globals.addActionBarButtons($.win, [{
		params:{
			title:"Help",
			icon: "images/question30.png",
			showAsAction : Ti.Android.SHOW_AS_ACTION_ALWAYS
		}
		}], 
		function getMenu(menu){
			//Add functionality for sharing a service provider
			var shareItem = _.findWhere(menu.getItems(), {title:"Help"});
			shareItem.addEventListener("click", openMessage);
		}
	);
}

/**
 * Message that is displayed when help question mark is clicked.
 */
function openMessage(){
	Alloy.createController("alertDialog", {
		title: "Help",
		message:"Customize your app settings here. Set your preferred county, quick-hide site, add trusted contacts, and view your favorite providers. Would you like to visit our YouTube channel for a complete tutorial?",
		callback: function(){
			Ti.Platform.openURL("https://www.youtube.com/playlist?list=PL5h6KCzb5JtT3n7fjEvtRrhlVk1aEEP20");
		}
	}).getView().show();
}

/**
 * Change view and update button colors based on which profile button was pressed.
 * (i.e., profile info, trusted contacts, favorite services)
 */
function toggleSelection(e){
	
	if (previouslySelected){
		previouslySelected.backgroundColor = "#fff";
	}
	
	if(e.source.id === "profile"){
		$.profileScroll.scrollToView(0);
	}
	else if(e.source.id === "trustedContacts"){
		$.profileScroll.scrollToView(1);

	}
	else if(e.source.id === "favorites"){
		$.profileScroll.scrollToView(2);
	}
	
	e.source.backgroundColor = "#e9e9e9";
	previouslySelected = e.source;
}

/**
 * Used to clean up resources after window is closed
 */
function destroy(){
	$.destroy();
}

/**
 * If no contacts or favorite services exist, make "no X selected" label visible.
 */
function updateLabel(e){
	if(Alloy.Globals.isAndroid){
		var label = e.source.id === "favoriteServicesTable" ? $.noFavorites : $.noContacts;
		if(e.source.getData().length == 0){
			label.visible = true;
		}
		else{
			label.visible = false;
		}
	}
}

/**
 * ******************************
 * *** PROFILE INFO FUNCTIONS ***
 * ******************************
 */

/**
 * Function for choosing new profile picture.
 */
function updateProfilePic(){
	if(Ti.Media.hasCameraPermissions()){
		openGallery();
	}
	else{
		Ti.Media.requestCameraPermissions(function(e){
			Ti.API.info(JSON.stringify(e));
			if(e.success){
				openGallery();
			}
			else{
				alert("You cannot select a profile picture until permissions are granted.");
			}
		});
	}
	
	function openGallery(){
		Titanium.Media.openPhotoGallery({
			success:function(event) {
				// called when media returned from the camera
				if(event.mediaType == Ti.Media.MEDIA_TYPE_PHOTO) {
					//persist profile pic path
					profileBasics.save({
						profile_pic: event.media.nativePath
					});
		
				} else {
					alert("got the wrong type back ="+event.mediaType);
				}
			},
			error:function(error) {
				// called when there's an error
				var a = Titanium.UI.createAlertDialog({title:'Camera'});
				if (error.code == Titanium.Media.NO_CAMERA) {
					a.setMessage('Please run this test on device');
				} else {
					a.setMessage('Unexpected error: ' + error.code);
				}
				a.show();
			}
		});
	}
	
}


/**
 * Function for retrieving counties and creating popup for searching counties.
 */
function pickCounty(e){
	var plzWait = null;
	if(Alloy.Globals.isAndroid && countySelector.isCountiesNull()){
		plzWait = Alloy.createController("pleaseWait").getView();
		plzWait.open();
	}
	
	countySelector.getCounties(function(counties){
		if(plzWait){
			plzWait.close();
		}
		
		createPopup(counties);
	});
	
	/**
	 * helper function for creating filter view
	 */
	function createPopup(countiesList){
		Alloy.createController("profileModal", {
			counties: countiesList,
			header: "COUNTIES",
			updateElement: $.county
		}).getView().open();
	}
	
}

/**
 * Create popup with different content based on whether user wants
 * to edit website or name.
 */
function updateProfile(e){
	var params = null;
	if(e.source.id === "website"){
		params = {
			header:"QUICK HIDE WEBSITE",
			description: "Enter a website url (e.g. http://google.com) to be used as part of the 'quick-hide' feature",
		};
	}
	else if(e.source.id === "nameField"){
		params = {
			header: "NAME",
			description:"Enter your name"
		};
	}
	params.sourceId = e.source.id;
	Alloy.createController("profileModal", params).getView().open();
}

/**
 * ***************************
 * ** ADD CONTACT FUNCTIONS **
 * ***************************
 */

/**
 * Function that shows the alert dialog for
 * manually adding a contact or choosing one 
 * from the contacts list
 */
function addContact(){
	$.dialog.show();
}

/**
 * Function executed when user selects manual/contact list
 * from alert dialog opened in addContact method.
 * @param {Object} e - event
 */
function doClick(e){
	if(e.index == 1){ //manually add was selected
		Alloy.createController("profileModal", {
			header:"ADD CONTACT",
			description:"Enter contact's name",
			subDescription:"Enter contact's phone number"
		}).getView().open();
	}
	else if(e.index == 2){ //add from contact list selected
		if(Ti.Contacts.hasContactsPermissions()){
			showContacts();
		}
		else{
			Ti.Contacts.requestContactsPermissions(function(e){
				if(e.success){
					showContacts();
				}
				else{
					alert("Cannot select contact until permission has been granted.");
				}
			});
		}
		
		function showContacts(){
			if(Alloy.Globals.isAndroid){
				Ti.Contacts.showContacts({
					selectedPerson: function(e){
						Ti.API.info("person:" + JSON.stringify(e));
						if(e.person != null && (e.person.phone == null || _.isEmpty(e.person.phone))){
							alert("This person does not have a phone number associated with their entry.");
						}
						else if(e.person != null && (e.person.phone != null || !_.isEmpty(e.person.phone))){
							Alloy.createController('trustedContactModal', e.person).getView().open();
						}
						else{
							alert("Cannot get the proper information to add this contact as a trusted person.");
						}
					},
					fields:['phone', 'name']
				});
			}
			else{
				Ti.Contacts.showContacts({
					selectedProperty: function(e){
						var modelUtils = require('modelUtils');
						modelUtils.storeTrustedContact(e.value, e.person.fullName);
					},
					fields: ['phone']
				});
			}
		}
		
	}
}

/**
 * Function that is called upon return key being pressed after editing
 * emergency message.
 * @param {Object} e - return event
 */
function saveMessage(e){
    if(e.value.length <= 160){ //if emergency message is less than or equal to 160 characters
     		profileBasics.save({
				emergency_message: e.value
			},
			{
				silent: true
			});
			$.trustedMessageEdit.blur();
			Alloy.Globals.createNotificationPopup("Message Saved.");
     }
     else{
     	//do not save until message is small enough
     	alert("Your message is greater than 160 characters.");
     }
}
