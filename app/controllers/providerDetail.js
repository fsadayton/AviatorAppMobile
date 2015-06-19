var args = arguments[0] || {};

$.providerName.text = args.orgName;

if(args.address){
	var address = args.address.split(",");
	$.address.text = address[0] + "\n" + address[1].trim() + ", " + address[2].trim();
}
else{
	$.address.visible = false;
	$.addressLabel.visible = false;
	$.driveButton.visible = false;
	$.providerDescription.height = "35%";
}

$.providerDescription.value = args.description;
$.phoneLabel.text = "CALL " + args.phone;

$.phoneView.visible = args.phone ? true : false;
$.emailView.visible = args.email ? true : false;
$.websiteView.visible = args.website ? true :false;

$.phoneView.height = args.phone ? $.phoneView.height : 0;
$.emailView.height = args.email ? $.emailView.height : 0;
$.websiteView.height = args.website ? $.websiteView.height :0;

$.win.activity.onCreateOptionsMenu = function(e){
	var menu = e.menu;
	var share = menu.add({
		title:"Share with Friends",
		icon: "/global/share256.png"
	});
	
	share.addEventListener("click", shareInformation);
	
	var favorite = menu.add({
		title:"Tag as Favorite",
		icon:"/global/star256.png"
	});
	
	favorite.addEventListener("click", function(e){alert("Feature coming soon!");});
};

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
	emailDialog.subject = "Request for Info: " + args.name;
	emailDialog.toRecipients = [args.email];
	emailDialog.messageBody = "Hello, \nI'm interested in your services. At your earliest convenience, please send me information about your organization.";
	emailDialog.open();
}

function openWebsite(){
	Ti.Platform.openURL(args.website);
}

function shareInformation(){
	var activity = Ti.Android.currentActivity;
	var intent = Ti.Android.createIntent({
		action: Ti.Android.ACTION_SEND,
		type: 'text/plain'
	});
	var body = "You might be interested in this organization. \nDescription: " 
		+ args.description + "\nPhone: " + args.phone 
		+ "\nEmail: " + args.email + "\nWebsite: " + args.website;
	intent.putExtra(Ti.Android.EXTRA_SUBJECT, args.name);
	intent.putExtra(Ti.Android.EXTRA_TEXT, body);
	activity.startActivity(Ti.Android.createIntentChooser(intent, 'Share'));
}

//Alloy.Globals.addActionBarButtons($.win);
