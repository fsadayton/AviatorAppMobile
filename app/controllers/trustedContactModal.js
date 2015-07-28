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
	
	var contacts = Alloy.Collections.trustedContacts;
		
	var existingNumber = contacts.where({phone_number:e.row.phone});

	if(existingNumber.length > 0){
		alert("That number is already listed as a trusted contact.");
	}
	else if(contacts.length < 3){
		// Create a new model for the trusted contacts collection
	    var contact = Alloy.createModel('trustedContacts', {
	        name : args.fullName,
	        phone_number : e.row.phone
	    });
	
	    // add new model to the global collection
	    contacts.add(contact);
	
	    // save the model to persistent storage
	    contact.save();
	
	    // reload the tasks
	    contacts.fetch();
	    $.win.close();
	}
	else{
		alert("You can only have 3 trusted contacts. Remove a current contact if this person should be added.");
	}
}

