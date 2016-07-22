/**
 * CONTROLLER FOR DISPLAYING A SERVICE PROVIDER'S DETAIL PAGE
 */
var args = arguments[0] || {};

var menu;

//set provider name and description
$.providerName.text = args.orgName;
$.providerDescription.value = args.description;

if(args.address){ //format address
	var address = args.address.split(",");
	$.address.text = address[0] + "\n" + address[1].trim() + ", " + address[2].trim();
}
else{ //no address, remove address view
	$.container.remove($.addressView);
	$.descGroup.setHeight("35%");
}

//if no phone number, remove view from details
if(args.phone == null){
	$.container.remove($.phoneView);
}
else{ //phone number available, display in details
	$.phoneLabel.text = "CALL " + args.phone;
}

//remove any views that are not needed
if(args.email == null){ //remove email button
	$.container.remove($.emailView);
}
if(args.website == null){ //remove website button
	$.container.remove($.websiteView);
}
if(!args.hasApp){ //remove 'download app' button
	$.container.remove($.downloadAppView);
}

/**
 * Add sharing and tagging capabilities to menu bar
 * for the Android implementation
 */
if(Alloy.Globals.isAndroid){
	Alloy.Globals.addActionBarButtons($.win, [{
		params:{
			title:"Share with Friends",
			icon: "/global/share256.png",
			showAsAction : Ti.Android.SHOW_AS_ACTION_NEVER
		}
	},
	{params:{
		title:"Tag as Favorite",
		icon:"/global/star256.png",
		showAsAction : Ti.Android.SHOW_AS_ACTION_NEVER
	}}],
	function getMenu(menu){
		
		//Add functionality for sharing a service provider
		var shareItem = _.findWhere(menu.getItems(), {title:"Share with Friends"});
		shareItem.addEventListener("click", shareInformation);
		
		/**
		 * Local function that enables a user to share info about a service provider (e.g. email, phone, etc.)
		 * via email, SMS, or other app capable of sending text.
		 */
		function shareInformation(){
			var activity = Ti.Android.currentActivity;
			var intent = Ti.Android.createIntent({
				action: Ti.Android.ACTION_SEND,
				type: 'text/plain'
			});
			var body = "You might be interested in this organization. \nDescription: " 
				+ args.description + "\nPhone: " + args.phone 
				+ "\nEmail: " + args.email + "\nWebsite: " + args.website;
			intent.putExtra(Ti.Android.EXTRA_SUBJECT, args.orgName);
			intent.putExtra(Ti.Android.EXTRA_TEXT, body);
			activity.startActivity(Ti.Android.createIntentChooser(intent, 'Share'));
		}
		
		//Add functionality for saving a favorite service provider
		var favoriteItem = _.findWhere(menu.getItems(), {title:"Tag as Favorite"});
		favoriteItem.addEventListener("click", tagAsFavorite);
	});
}

/**
 * Function for calculating directions between current location and
 * provider address. Directions will open up in google maps or apple maps.
 */
function getDirections() {       
        // Get Address of order without the name
	    var destination = args.address;

	    Titanium.Geolocation.accuracy = Titanium.Geolocation.ACCURACY_BEST;
	       
	    // Get Driver's location from GPS
        var url = Alloy.CFG.mapUrl+"?daddr="+destination;
        if(Alloy.Globals.isAndroid) {
			var mapIntent = Ti.Android.createIntent({
				action : Ti.Android.ACTION_VIEW,
				data : url
			});
			Ti.Android.currentActivity.startActivity(mapIntent);
		} else {
			Ti.Platform.openURL(url);
		}
	
}

/**
 * Function that opens the call dialog for a phone number.
 */
function callPhoneNumber(){
    var cleanNumber = args.phone.replace(/\s|-|\./g,'');
    Ti.Platform.openURL('tel:' + cleanNumber);
}

/**
 * Function that opens email dialog in order to email a service provider.
 */
function openEmail(){
	var emailDialog = Ti.UI.createEmailDialog();
	emailDialog.subject = "Request for Info: " + args.orgName;
	emailDialog.toRecipients = [args.email];
	emailDialog.messageBody = "Hello, \nI'm interested in your services. At your earliest convenience, please send me information about your organization.";
	emailDialog.open();
}

/**
 * Function initially opens up disclaimer for navigating away from 
 * app to a website. 
 */
function openWebsite(){
	$.dialog.show();
}

/**
 * If user understands that he/she is navigating away from the app,
 * open the service provider's website in a browser.
 * @param {Object} e
 */
function doClick(e){
	if(!e.cancel || (!Alloy.Globals.isAndroid && e.index === 0)){
		Ti.Platform.openURL(args.website);
	}
}

/**
 * Function that allows service provider information to be shared 
 * on the iOS platform
 */
function iosShare(e){
    socialWidget=require('com.alcoapps.socialshare');
    var body = "You might be interested in this organization. \nDescription: " 
				+ args.description + "\nPhone: " + args.phone 
				+ "\nEmail: " + args.email + "\nWebsite: " + args.website;
    socialWidget.share({
        status: body
    });
}
/**
 * Function that opens up VINE mobile app in app store or google play store.
 */
//FIXME: Look into abstracting ability for more than VINE to be used
function downloadApp(){
	Alloy.Globals.isAndroid ? Ti.Platform.openURL("market://details?id=" + args.androidUrl) : Ti.Platform.openURL("itms://"+ args.itunesUrl);
}

/**
* Function that persists a service provider if it has not already 
* been saved. 
*/
function tagAsFavorite(){
	var favorites = Alloy.Collections.favorites;
	var existingFavorite = favorites.where({name:args.orgName});
			
	if(existingFavorite.length > 0){
		//Notify user that he/she has already saved service provider
		Alloy.Globals.createNotificationPopup(args.orgName + " is already tagged.");
	}
	else{
		var favorite = Alloy.createModel('favorites', {
			name: args.orgName,
			address: args.address,
			description: args.description,
			phone_number: args.phone,
			email: args.email,
			website: args.website
		});
			
		favorites.add(favorite);
		favorite.save();
		favorites.fetch();
				
		//Notify user that the service provider has been saved
		Alloy.Globals.createNotificationPopup("Favorite Added.");
	}
}
