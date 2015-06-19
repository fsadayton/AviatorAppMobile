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
var geocoder = require('ti.geocoder');

// Global variable that checks os
Alloy.Globals.isAndroid = (Ti.Platform.osname == "android") ? true : false;

Alloy.Globals.currentLocation = null;

Alloy.Globals.addActionBarButtons = function(window){
    window.activity.onCreateOptionsMenu = function(e) { 
	    var menu = e.menu; 
	    var menuItem = menu.add({ 
	        title : "Hide", 
	        icon : "/global/blind2.png", 
	        showAsAction : Ti.Android.SHOW_AS_ACTION_IF_ROOM 
	    }); 
	    
	    var help = menu.add({
	        title : "Help",
	        icon : "/global/add126.png", 
	        showAsAction : Ti.Android.SHOW_AS_ACTION_IF_ROOM 
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

Alloy.Globals.estimateDistance = function(currentPos, address, callback){
	var distance = "??? mile(s)";
	if(currentPos){

		geocoder.forwardGeocoder(address, function(e){
		    if(e.success){
		        distance = getDistance(parseFloat(currentPos.latitude), parseFloat(currentPos.longitude), parseFloat(e.places[0].latitude), parseFloat(e.places[0].longitude)) + " mile(s)";
				callback(distance); 
		    }   
		
		    var test = JSON.stringify(e);
		    //Ti.API.info("Forward Results stringified" + test);
		});
		return distance;	
	}
};



/**
 * Function that calculates the distance between two positions
 * in miles. 
 * 
 * @param {Object} lat1 - latitude of the current position
 * @param {Object} lon1 - longitude of the current position
 * @param {Object} lat2 - latitude of the delivery address
 * @param {Object} lon2 - longitude of the delivery address
 */ 
function getDistance(lat1,lon1,lat2,lon2){
	Number.prototype.toDeg = function() {
    	return this * 180 / Math.PI;
	};
	Number.prototype.toRad = function() {
    	return this * Math.PI / 180;
	};
    var R = 3959; // earth's radius in miles
    var dLat = (lat2-lat1).toRad();
    var dLon = (lon2-lon1).toRad();
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c;
    return d.toFixed(2);
}

/**
 * Initialize/configure location services so that delivery distances can be calculated
 * as well as sending location updates to interested customers. 
 */	
if (Ti.Geolocation.locationServicesEnabled){	
	
	//configure geolocation for android platform
	if (Alloy.Globals.isAndroid) {
		
		//provider that triggers location notification every 50 meters
		var gpsProvider = Ti.Geolocation.Android.createLocationProvider({
			name: Ti.Geolocation.PROVIDER_GPS,
			minUpdateDistance: 50.0,//meters
			minUpdateTime: 0 //seconds
		});
		
		Ti.Geolocation.Android.addLocationProvider(gpsProvider);
		Ti.Geolocation.Android.manualMode = true;
	}
	else{
		//trigger location notification every 50 meters
		Ti.Geolocation.setDistanceFilter(50);
		Ti.Geolocation.setAccuracy(Ti.Geolocation.ACCURACY_HUNDRED_METERS);
	}
	
	/**
	 * callback function used to process new location
	 */
	var locationCallback = function(e){
		if (!e.success || e.error)
		{
			Ti.API.error('error in location callback:' + JSON.stringify(e.error));
		}
		else 
		{
			Ti.API.info(Ti.API.info('coords:' + JSON.stringify(e.coords)));
			Alloy.Globals.currentLocation = e.coords;
		}
	};
	Titanium.Geolocation.addEventListener('location', locationCallback);
}	
else{
	alert('Location services must be enabled in order to estimate the distance between you and a potential service provider.');
}
