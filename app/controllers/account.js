var args = arguments[0] || {};
var profileBasics = Alloy.Models.profileBasics;

Alloy.Collections.trustedContacts.fetch();
profileBasics.fetch();

Ti.API.info("widths: " + $.accountImage.width + " " + $.name.width);
Alloy.Globals.addActionBarButtons($.win);
Ti.API.info("prfoil: " + profileBasics.get('profile_pic'));
//$.accountImage.image = profileBasics.get('profile_pic');
//Ti.API.info("account image: " + JSON.stringify(Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, "global/user256.png").read()));

var allCounties = null;

function updateProfilePic(){
	Titanium.Media.openPhotoGallery({
	success:function(event) {
		// called when media returned from the camera
		Ti.API.debug('Our type was: '+event.mediaType);
		if(event.mediaType == Ti.Media.MEDIA_TYPE_PHOTO) {
			profileBasics.save({
				profile_pic: event.media.nativePath
			});

		} else {
			alert("got the wrong type back ="+event.mediaType);
		}
	},
	cancel:function() {
		// called when user cancels taking a picture
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

var previouslySelected = $.profile;
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

function editing(e){
	Ti.API.info("editing");
	e.source.editable = true;
}


function pickCounty(e){
	if (allCounties){
		createPopup(allCounties);
	}
	else{
		Alloy.Globals.sendHttpRequest("GetCounties", "GET", null, 
		function(){
			allCounties = JSON.parse(this.responseText);
			createPopup(allCounties);
		});
	}
	
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

function updateProfile(e){
	Ti.API.info("source: " + e.source.id);
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

function addContact(){
	$.dialog.show();
	
}

function doClick(e){
	if(e.index == 0){
		Ti.API.info("lol coming");
		Alloy.createController("profileModal", {
			header:"ADD CONTACT",
			description:"Enter contact's name",
			subDescription:"Enter contact's phone number"
		}).getView().open();
	}
	else if(e.index == 1){
		Ti.Contacts.showContacts({
			selectedPerson: function(e){
				Ti.API.info("person:" + JSON.stringify(e.person.phone));
				Alloy.createController('trustedContactModal', e.person).getView().open();
			},
			fields:['phone', 'name']
		});
	}
}

function setHeaderWidth(){
	$.centeredView.width = parseInt($.accountImage.width) + $.name.toImage().width + "dp";
}

var timeout;
function saveMessage(e){
		Ti.API.info("set timeout");
    	if(e.value.length <= 160){ //if search field contains a value
     		profileBasics.save({
				emergency_message: e.value
			},
			{
				silent: true
			});
			$.trustedMessageEdit.blur();
			Alloy.Globals.isAndroid ? Ti.UI.createNotification({message:"Message Saved.",
    				duration: Ti.UI.NOTIFICATION_DURATION_LONG}).show() : alert("Message Saved.");
     	}
     	else{
     		//if search is empty, put all annotations back on the map
     		alert("Your message is greater than 160 characters.");
     	}
}

function destroy(){
	Ti.API.info("destroy");
	$.destroy();
}
