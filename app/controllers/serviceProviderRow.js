var args = arguments[0] || {};

$.providerName.text = args.name;
$.subtext.text = args.crisis ? "CALL " + args.crisis : Alloy.Globals.estimateDistance(Alloy.Globals.currentLocation, args.address + ", US", setSubtext);

$.row.name = args.name;
$.row.address = args.address;
$.row.description = args.description;
$.row.phone = args.phone;
$.row.email = args.email;
$.row.website = args.website;
 
if(args.crisis){
	$.row.crisis = args.crisis;
}

function setSubtext(distance){
	$.subtext.text = distance;
}


