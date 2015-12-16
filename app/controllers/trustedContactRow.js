var args = arguments[0] || {};

var contacts = Alloy.Collections.trustedContacts;
//contacts.fetch();
var id;

if($model){
	id = $model.id;
}

/**
 * Function that creates confirm dialog for deleting a trusted contact
 * @param {Object} e
 */
function deleteContact(e){
	
	e.cancelBubble = true;

	Alloy.createController("alertDialog", {
		title: "Remove Trusted Contact",
		message:"Remove " + contacts.get(id).get("name") + " from your trusted contacts?",
		callback: function(){
			var contact = contacts.get(id);
			contact.destroy();
		}
	}).getView().show();
}

/**
 * Function that opens edit dialog for trusted contact
 */
function editContact(e){
	e.cancelBubble = true;
	var contact = contacts.get(id);
	Alloy.createController("profileModal", {
			header: "ADD CONTACT",
			description: "Enter contact's name",
			subDescription: "Enter contact's phone number",
			name: contact.get("name"),
			phone: contact.get("phone_number"),
			modelId: id
	}).getView().open();
}

function callContact(e){
	var cleanNumber = $.contactNumber.text.replace(/\s|-|\./g,'');
    Ti.Platform.openURL('tel:' + cleanNumber);
}
