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

Alloy.Globals.currentLocation = null;

Alloy.Globals.addActionBarButtons = function(window){
    window.activity.onCreateOptionsMenu = function(e) { 
	    var menu = e.menu; 
	    var menuItem = menu.add({ 
	        title : "Hide", 
	        icon : "/global/blind2.png", 
	        showAsAction : Ti.Android.SHOW_AS_ACTION_IF_ROOM 
	    }); 
	    
	    menu.add({
	        title : "Help",
	        icon : "/global/add126.png", 
	        showAsAction : Ti.Android.SHOW_AS_ACTION_IF_ROOM 
	    });
	    
	    
	    menuItem.addEventListener("click", function(e) { 
	        Ti.Platform.openURL("http://www.npr.org"); 
	    }); 
    };
    
};

function hide(){
    //Either line can be commented or un-commented to show the photo gallery or camera of the device
//Titanium.Media.openPhotoGallery({
Titanium.Media.showCamera({
    success:function(event) {
 // called when media returned from the camera
        Ti.API.debug('Our type was: '+event.mediaType);
 if(event.mediaType == Ti.Media.MEDIA_TYPE_PHOTO) {
            var imageView = Ti.UI.createImageView({
                width:win.width,
                height:win.height,
                image:event.media
            });
            win.add(imageView);
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
    },
    saveToPhotoGallery:true,
 // allowEditing and mediaTypes are iOS-only settings
    allowEditing:true,
    mediaTypes:[Ti.Media.MEDIA_TYPE_VIDEO,Ti.Media.MEDIA_TYPE_PHOTO]
});
};

Alloy.Globals.estimateDistance = function(currentPos, address, callback){
	var distance = "??? mile(s)";
	if(currentPos){
		Ti.Geolocation.forwardGeocoder(address, function(evt){
			Ti.API.info("inside forward geocoder");
			if(evt.success && evt.latitude)
			{
				
				distance = getDistance(parseFloat(currentPos.latitude), parseFloat(currentPos.longitude), parseFloat(evt.latitude), parseFloat(evt.longitude)) + " mile(s)";
				callback(distance);
			}
			else{
				Ti.API.info("error with " + address +": "+ evt.error);
			}
		});	
		Ti.API.info("returning distance: " + distance);
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
 	Ti.API.info("miles:" +d.toFixed(2));
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
