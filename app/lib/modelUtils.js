var contacts = Alloy.Collections.trustedContacts;

exports.updateTrustedContact = function(id, fullName, phone, window){
	
	var existingNumber = contacts.where({phone_number:phone});

	if(existingNumber.length > 0){
		alert("That number is already listed as a trusted contact.");
	}
	else{
		var contact = contacts.get(id);
		contact.save({
			name: fullName,
			phone_number: phone
		});
	
		window.close();
	}
	
};

exports.storeTrustedContact = function(phoneNumber, fullName, window){
	
	var existingNumber = contacts.where({phone_number:phoneNumber});
	if(existingNumber.length > 0){
		alert("That number is already listed as a trusted contact.");
	}
	else if(contacts.length < 3){
		// Create a new model for the trusted contacts collection
	    var contact = Alloy.createModel('trustedContacts', {
	        name : fullName,
	        phone_number : phoneNumber
	    });
	
	    // add new model to the global collection
	    contacts.add(contact);
	
	    // save the model to persistent storage
	    contact.save();
	
	    // reload the tasks
	    contacts.fetch();
	    window.close();
	}
	else{
		alert("You can only have 3 trusted contacts. Remove a current contact if this person should be added.");
	}
};