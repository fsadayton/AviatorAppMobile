var args = arguments[0] || {};
var profileBasics = Alloy.Models.profileBasics;

profileBasics.fetch();

Alloy.Globals.addActionBarButtons($.win);
Ti.API.info("prfoil: " + profileBasics.get('profile_pic'));
$.accountImage.image = Ti.Utils.base64decode(profileBasics.get('profile_pic'));
Ti.API.info("account image: " + JSON.stringify($.accountImage.image));

var allCounties = null;

function updateProfilePic(){
	Titanium.Media.openPhotoGallery({
	success:function(event) {
		// called when media returned from the camera
		Ti.API.debug('Our type was: '+event.mediaType);
		if(event.mediaType == Ti.Media.MEDIA_TYPE_PHOTO) {
			Ti.API.info("media: "+JSON.stringify(event.media));
			profileBasics.save({
				profile_pic: Ti.Utils.base64encode(event.media)
			});
			$.accountImage.image = event.media;
			//JS
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

function viewContacts(){
	Ti.Contacts.showContacts({
		selectedPerson: function(e){
			Ti.API.info("person:"+JSON.stringify(e));
		},
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
			leftImage:"/global/close.png",
			rightImage:"/global/checkmark.png",
			updateElement: $.county
		}).getView().open();
	}
	
}

function change(e){
	Ti.API.info("change: " + e.value);
}
