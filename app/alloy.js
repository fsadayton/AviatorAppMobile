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

Alloy.Globals.addActionBarButtons = function(window){
    window.activity.onCreateOptionsMenu = function(e) { 
	    var menu = e.menu; 
	    var menuItem = menu.add({ 
	    	title:"Hide App",
	        icon : "images/blind2.png", 
	        showAsAction : Ti.Android.SHOW_AS_ACTION_ALWAYS
	    }); 
	    
	    var help = menu.add({
	    	title:"Notify trusted contacts to help you",
	        icon : "images/add126.png", 
	        showAsAction : Ti.Android.SHOW_AS_ACTION_ALWAYS
	    });
	    
	    menuItem.addEventListener("click", function(e) { 
	        Ti.Platform.openURL("http://www.news.yahoo.com"); 
	    }); 
	    
	    help.addEventListener("click", function(e){
	    	alert("Your trusted contacts have been notified to help you.");
	    });
    };
    
};

/**
 * Method for sending an HTTP Request via Titanium's Ti.Network
 * library.
 * 
 * The parameters are as follows:
 * 	@param {String} url - REST URL of the request.
 * 	@param {String} type - HTTP method type (e.g., GET, POST, PUT, etc. ).
 * 	@param {boolean} setUserPass - true if username/password credentials need to be sent 
 * 		              with request (i.e., url is an SSL request), 
 *                    false otherwise.
 *  @param {Object} customUserPass (REMOVE IN PRODUCTION) - JSON object formed as {username:'user', password:'pass'}
 * 					  used for the wp-JSON api to pass in custom login data. FOR TESTING ONLY.
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
   	    Alloy.Globals.createNotificationPopup("Cannot establish connection to Drinkos. Please check your network connection.", "Network Error");
   	}
};
Alloy.Globals.updateActionBar = function(){
	var abx = require('com.alcoapps.actionbarextras');
	abx.titleFont = "Quicksand-Regular.otf";
	abx.setBackgroundColor("#65c8c7");
};

