var args = arguments[0] || {};

//set service provider row data
$.providerName.text = args.orgName;
$.subtext.text = args.crisis ? "CALL " + args.crisis : args.catNames.join(", ") + "";
$.miles.text = args.crisis == null ? Alloy.Globals.Location.estimateDistance(Alloy.Globals.currentLocation, args.address + ", US", setMilesAway) : "";

var tags = args.catNames ? "\n\nTAGS: " + args.catNames.join(", ") : ""; //if category names exist, add them to the description

$.row.orgName = args.orgName;
$.row.address = args.address;
$.row.orgDesc = args.orgDesc + tags;
$.row.phone = args.phone;
$.row.email = args.email;
$.row.website = args.website;

if(Alloy.Globals.isAndroid){
	$.row.title = args.orgName; //set title for search purposes
}

if(args.crisis){
	$.row.crisis = args.crisis;
}

/**
 * Function that sets and displays how far
 * a user is from a given servie provider
 * @param {Object} distance - string of distance in miles
 */
function setMilesAway(distance){
	$.miles.text = distance;
}


