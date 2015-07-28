var args = arguments[0] || {};

var contacts = Alloy.Collections.trustedContacts;

var id;

if($model){
	id = $model.id;
}

function deleteContact(e){
	e.cancelBubble = true;
	$.dialog.message = "Remove " + contacts.get(id).name + " from your trusted contacts?";
	$.dialog.show();
}

function editContact(){
	
}

function doClick(e){
	if(!e.cancel){
		var contact = contacts.get(id);
		contact.destroy();
	}
}
