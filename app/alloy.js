// The contents of this file will be executed before any of
// your view controllers are ever executed, including the index.
// You have access to all functionality on the `Alloy` namespace.
//
// This is a great place to do any initialization for your app
// or create any global variables/functions that you'd like to
// make available throughout your app. You can easily make things
// accessible globally by attaching them to the `Alloy.Globals`
// object. For example:
//
// Alloy.Globals.someGlobalFunction = function(){};

// Loads the map module, which can be referenced by Alloy.Globals.Map
Alloy.Globals.Map = require('ti.map');

// Global variable that checks os
Alloy.Globals.isAndroid = (Ti.Platform.osname == "android") ? true : false;

Alloy.Globals.Location = require('LocationUtils');

Alloy.Globals.currentLocation = null;

Alloy.Collections.trustedContacts = Alloy.createCollection('trustedContacts');
Alloy.Collections.favorites = Alloy.createCollection('favorites');
Alloy.Models.profileBasics = Alloy.createModel('profileBasics');

//retrieve most current info from collections and models
Alloy.Collections.trustedContacts.fetch();
Alloy.Collections.favorites.fetch();
Alloy.Models.profileBasics.fetch();

Alloy.Globals.addActionBarButtons = function(window, additionalButtons, callback){
	if(Alloy.Globals.isAndroid){
	    window.activity.onCreateOptionsMenu = function(e) { 
		    var menu = e.menu; 
		    var menuItem = menu.add({ 
		    	title:"Hide App",
		        icon : "images/blind2.png", 
		        showAsAction : Ti.Android.SHOW_AS_ACTION_ALWAYS
		    }); 
		    
		    menuItem.addEventListener("click", Alloy.Globals.hideScreen);
		     
		   	var help = menu.add({
		    	title:"Notify trusted contacts to help you",
		        icon : "images/add126.png", 
		        showAsAction : Ti.Android.SHOW_AS_ACTION_ALWAYS
		    });
		    
		    help.addEventListener("click", Alloy.Globals.sendTextMessage);
		    
		    if(additionalButtons){
		    	_.each(additionalButtons, function(button){
		    		menu.add(button.params);
		    	});
		    }
		    if (typeof callback === 'function'){
		    	callback(menu);
		    }
	    };
	}
};

/**
 * Method for sending an HTTP Request via Titanium's Ti.Network
 * library.
 * 
 * The parameters are as follows:
 * 	@param {String} url - REST URL of the request.
 * 	@param {String} type - HTTP method type (e.g., GET, POST, PUT, etc. ).
 * 	@param {Object} data - JSON object containing any data to be sent with request, 
 * 	           should be null if there's no data to send (JSON).
 * 	@param {Object} onSuccess - callback function to run if request is successful.
 *  @param {Object} onError - callback function to run if request failed
 */
Alloy.Globals.sendHttpRequest = function(url, type, data, onSuccess, onError){
    if (Ti.Network.online){
    	var client = Ti.Network.createHTTPClient({
    		timeout: 15000,
    		onload:onSuccess
    	});
    	
    	if(onError){
            client.onerror = onError;
    	}
    	else{
    	    client.onerror = function (e){
                Alloy.Globals.createNotificationPopup('Action cannot be completed at this time ('+this.status+') - ' + e.error, "Network Error");
                Ti.API.error(e);
            };
    	}
    	
    	if(type == "POST"){
    		//this property must be set BEFORE opening the connection.
    		client.setAutoRedirect(false); //do not attempt to redirect to another URL in the event of a 302 Found response
    	}
    	
    	var apiUrl = '';
    	if (url.indexOf('http') > -1){//If the url passed into the method contains http, use that url
    		apiUrl = url;
    	}
    	else{ //otherwise assume that the wooCommerce API is being used
    		apiUrl = Alloy.CFG.apiUrl + url;
    	}
    	//open the connection
    	client.open(type, apiUrl);
        
        if(type == "POST" || type == "PUT"){
        	//this property must be set AFTER opening the connection
    		client.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
    	}

    	Ti.API.info("sending http request for url: "+apiUrl);
    	
    	//send request
       	data == null ? client.send() : client.send(JSON.stringify(data));
   	}
   	else{
   	    Alloy.Globals.createNotificationPopup("Please check your network connection.", "Network Error");
   	}
};

/**
 * Function that creates either a toast notification or alert
 * based on whether the platform is Android or not.
 * @param {string} message - message to appear in notification
 */
Alloy.Globals.createNotificationPopup = function(message){
	Alloy.Globals.isAndroid ? Ti.UI.createNotification({message:message,
    				duration: Ti.UI.NOTIFICATION_DURATION_LONG}).show() : alert(message);
};

/**
 * Sets the background color and font of the android action bar
 */
Alloy.Globals.updateActionBar = function(){
	if (Alloy.Globals.isAndroid){
		var abx = require('com.alcoapps.actionbarextras');
		abx.titleFont = "Dosis-Bold.otf";
		abx.setBackgroundColor("#009577");
		abx.titleColor = "#fff";
	}
};

/**
 * Function that hides the apps current screen 
 */
Alloy.Globals.hideScreen = function(){
	var website = Alloy.Models.profileBasics.get('website');
	if(website.indexOf('http://') > -1 || website.indexOf('https://') > -1){
		Ti.Platform.openURL(website);
	}
	else{
		Ti.Platform.openURL("http://" + website);
	}
};
/**
 * Function that composes and sends a text message to user's trusted
 * contacts. Text message is sent automatically from Android platform.
 * iOS requires user to push send button after fields have been pre-
 * populated.
 */
Alloy.Globals.sendTextMessage = function(){
	var count = 0; //flag used to determine if any of the recipients did not get message
	
	//get list of trusted contacts
	var contacts = Alloy.Collections.trustedContacts;
	contacts.fetch();
	
	//get emergency message
	Alloy.Models.profileBasics.fetch();
	var message = Alloy.Models.profileBasics.get("emergency_message");
	
	var timeout; //timeout used to create alert message after all texts have been sent
	var sms; //sms module to use depending on platform
	
	if(Alloy.Globals.isAndroid){
		if(contacts.length == 0){
			alert("You do not have any trusted contacts. Go to 'My Account' to add trusted contacts.");
			return;
		}
		sms = require('ti.android.sms');
	    sms.addEventListener('complete', isComplete);
	    
		contacts.each(function(contact){
			sms.sendSMS(contact.get("phone_number"), message);
	    });
	}
	else{
		var module = require('com.omorandi');
		sms = module.createSMSDialog();
		
		if(!sms.isSupported()){
			alert("Required feature is not available on your device.");
		}
		else{
			sms.addEventListener('complete', isComplete);
			sms.recipients = contacts.pluck("phone_number");
			sms.messageBody = message;
			sms.open({animated:true});
		}
	}
	
	/**
	 * Locally scoped function to be called once a text message has been sent. If message failed, 
	 * user is alerted that one or more numbers may have failed. If no failed status, user is alerted
	 * that their trusted contacts have been notified.  
 	 * @param {Object} e
	 */
	function isComplete(e){
		clearTimeout(timeout);
		if(e.result === sms.FAILED){
			count++;
		}
		timeout = setTimeout(function(e){
			if(count > 0){
				alert("Operation complete, but " + count + " of your trusted contacts could not be reached.");
			}
			else{
				alert("Your trusted contacts have been notified.");
			}
			sms.removeEventListener('complete', isComplete);
		}, 1000);
	}
};
