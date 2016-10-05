/**
 * CONTROLLER FOR DISPLAYING A SERVICE PROVIDER'S DETAIL PAGE
 */
var args = arguments[0] || {};

var menu;

//set provider name and description
$.providerName.text = "Document Storage";
$.providerDescription.value = "View and store your important documents using your camera! Any pictures taken using the Document Storage feature" +
		" will only be available through AVIATOR; they will not show up in your phone's default gallery.\n " +
		"Use the 'Take Picture' button to open your camera, and take" +
		" a picture of any document.\nUse the 'View Documents' button to retrieve any previously pictured documents.";

/**
 * Function that opens the call dialog for a phone number.
 */
function viewDocuments(){
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
				alert("You cannot view  permissions are granted.");
			}
		});
	}
	
	function openGallery(){
		Titanium.Media.openPhotoGallery({
			success:function(event) {
				// called when media returned from the camera
				Ti.API.info("event: " + JSON.stringify(event));
				if(event.mediaType == Ti.Media.MEDIA_TYPE_PHOTO) {
					var imageView = Ti.UI.createImageView({
						image: event.media.nativePath
					});
					$.docImage.image = event.media;
					$.docImage.width = $.imageScroll.width;
					$.docImage.height = $.imageScroll.height;
		
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
 * Function that opens email dialog in order to email a service provider.
 */
function openCamera(){
	if(Ti.Media.hasCameraPermissions()){
		openCameraImage();
	}
	else{
		Ti.Media.requestCameraPermissions(function(e){
			Ti.API.info(JSON.stringify(e));
			if(e.success){
				openCameraImage();
			}
			else{
				alert("You cannot view  permissions are granted.");
			}
		});
	}
	
	function openCameraImage(){
		Titanium.Media.showCamera({
			success:function(event) {

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
			},
			saveToPhotoGallery:false
			

		});
	}
	
	
	
}




