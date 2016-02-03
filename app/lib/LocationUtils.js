var geocoder = require('ti.geocoder');
Ti.API.info("geocoder: "+ geocoder);


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
			//Ti.API.info(Ti.API.info('coords:' + JSON.stringify(e.coords)));
			Alloy.Globals.currentLocation = e.coords;
		}
	};
	Titanium.Geolocation.addEventListener('location', locationCallback);
}	
else{
	alert('Location services must be enabled in order to estimate the distance between you and a potential service provider.');
}

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
 * Function that estimates distance between given address and current position
 * @param {Object} currentPos - lat/long of current position
 * @param {Object} address - address of the potential destination
 * @param {Object} callback - used to retrieve calculated distance between currentPos and address
 */
exports.estimateDistance = function(currentPos, address, callback){
	var distance = "??? mile(s)";
	if(currentPos){
		/*geocoder.forwardGeocoder(address, function(e){
		    if(e.success && e.places.length > 0){
		        distance = getDistance(parseFloat(currentPos.latitude), parseFloat(currentPos.longitude), parseFloat(e.places[0].latitude), parseFloat(e.places[0].longitude)) + " mile(s)";
				callback(distance); 
		    }   
		});*/
		Ti.Geolocation.forwardGeocoder(address, function(e){
			if(e.success){
				distance = getDistance(parseFloat(currentPos.latitude), parseFloat(currentPos.longitude), parseFloat(e.latitude), parseFloat(e.longitude)) + " mile(s)";
				callback(distance);
			}
		});
		return distance;	
	}
};

/**
 * Function for retrieving lat/long information for a given
 * address and manipulating information through a given callback method.
 * @param {Object} address - address to be converted into lat/long
 * @param {Object} callback - callback to execute upon successful conversion of
 * 							address to lat/long
 */
exports.runCustomFwdGeocodeFunction = function(address, callback){
	Ti.Geolocation.forwardGeocoder(address, function(e){
		callback(e);
	});
};



