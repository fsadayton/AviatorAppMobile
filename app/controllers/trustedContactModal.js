var args = arguments[0] || {};

var phoneNumberTypes = Object.keys(args.phone);
var allHeaders = [];

init();

if(args.fullName){
	$.description.text = args.fullName + " will be contacted via text message when the help icon "
	+ "is tapped. " + $.description.text;
}

function init(){
	_.each(phoneNumberTypes, function(type){
		var header = Ti.UI.createTableViewSection(
			{headerView: Alloy.createController('TableViewHeader', {text:type}).getView()}
		);
		_.each(args.phone[type], function(phoneNumber){
			Ti.API.info("phone number: " + phoneNumber);
			header.add(Alloy.createController('genericTableRow', {text:phoneNumber}).getView());
		});
		allHeaders.push(header);
	});

	$.table.setData(allHeaders);
}

function storeNumber(e){
	Ti.API.info("phone num: " + e.row.phone);
	
	var modelUtils = require('modelUtils');
	modelUtils.storeTrustedContact(e.row.phone, args.fullName, $.win);
}

