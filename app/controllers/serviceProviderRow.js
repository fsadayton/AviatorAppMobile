var args = arguments[0] || {};

$.providerName.text = args.orgName;
$.subtext.text = args.crisis ? "CALL " + args.crisis : Alloy.Globals.Location.estimateDistance(Alloy.Globals.currentLocation, args.address + ", US", setSubtext);

$.row.orgName = args.orgName;
$.row.address = args.address;
$.row.orgDesc = args.orgDesc;
$.row.phone = args.phone;
$.row.email = args.email;
$.row.website = args.website;


if(Alloy.Globals.isAndroid){
	$.row.title = args.orgName;
}

if(args.crisis){
	$.row.crisis = args.crisis;
}

function setSubtext(distance){
	$.subtext.text = distance;
}


