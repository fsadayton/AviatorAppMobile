var args = arguments[0] || {};

var phoneNumberTypes = Object.keys(args.phone);
var allHeaders = [];

init();

if(args.fullName){
	$.description.text = args.fullName + " will be contacted via text message when the help icon "
	+ "is tapped. " + $.description.text;
}

//iterate through phone numbers of selected contact and present options in table
function init(){
	_.each(phoneNumberTypes, function(type){
		var header = Ti.UI.createTableViewSection(
			{headerView: Alloy.createController('TableViewHeader', {text:type}).getView()}
		);
		_.each(args.phone[type], function(phoneNumber){
			header.add(Alloy.createController('genericTableRow', {text:phoneNumber}).getView());
		});
		allHeaders.push(header);
	});

	$.table.setData(allHeaders);
}

/**
 * Function for persisting phone number and name of trusted contact
 * @param {Object} e
 */
function storeNumber(e){
	var modelUtils = require('modelUtils');
	modelUtils.storeTrustedContact(e.row.phone, args.fullName, $.win);
}

