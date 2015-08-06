var args = arguments[0] || {};

var menu;

//set provider name and description
$.providerName.text = args.orgName;
$.providerDescription.value = args.description;

if(args.address){ //format address
	var address = args.address.split(",");
	$.address.text = address[0] + "\n" + address[1].trim() + ", " + address[2].trim();
}
else{ //no address, remove address-related views
	$.win.remove($.addressLabel);
	$.win.remove($.addressView);
	$.providerDescription.height = "35%";
}

//check phone status
if(args.phone == null){
	$.win.remove($.phoneView);
}
else{
	$.phoneLabel.text = "CALL " + args.phone;
}

//remove any views that are not needed
if(args.email == null){
	$.win.remove($.emailView);
}
if(args.website == null){
	$.win.remove($.websiteView);
}
if(!args.hasApp){
	$.win.remove($.downloadAppView);
}
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
	}
);

/*$.win.activity.onCreateOptionsMenu = function(e){
	var menu = e.menu;
	var share = menu.add({
		
	});
	
	share.addEventListener("click", shareInformation);
	
	var favorite = menu.add({
		title:"Tag as Favorite",
		icon:"/global/star256.png"
	});
	
	favorite.addEventListener("click", function(e){
		var favorites = Alloy.Collections.favorites;
		var existingFavorite = favorites.where({name:args.orgName});
		
		if(existingFavorite.length > 0){
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
			
			Alloy.Globals.createNotificationPopup("Favorite Added.");
		}
	});
};*/

function getDirections() {
	if (Titanium.Geolocation.locationServicesEnabled==false) {
	    Titanium.UI.createAlertDialog({message:'Please enable location services.'}).show();
	} else {        
        // Get Address of order without the name
	    var destination = args.address;

	    Titanium.Geolocation.accuracy = Titanium.Geolocation.ACCURACY_BEST;
	       
	    // Get Driver's location from GPS
        var url = Alloy.CFG.mapUrl+"?&daddr="+destination;
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
}

function callPhoneNumber(){
    var cleanNumber = args.phone.replace(/\s|-|\./g,'');
    Ti.Platform.openURL('tel:' + cleanNumber);
}

function openEmail(){
	var emailDialog = Ti.UI.createEmailDialog();
	emailDialog.subject = "Request for Info: " + args.orgName;
	emailDialog.toRecipients = [args.email];
	emailDialog.messageBody = "Hello, \nI'm interested in your services. At your earliest convenience, please send me information about your organization.";
	emailDialog.open();
}

function openWebsite(){
	$.dialog.show();
}

function doClick(e){
	if(!e.cancel){
		Ti.Platform.openURL(args.website);
	}
}



function downloadApp(){
	Alloy.Globals.isAndroid ? Ti.Platform.openURL("market://details?id=com.appriss.vinemobile") : Ti.Platform.openURL("itms://itunes.apple.com/us/app/vinemobile/id625472495?mt=8");
}
