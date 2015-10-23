var args = arguments[0] || {};

$.navText.text = args.text;

function showInfo(e){
	e.cancelBubble = true;
	var dialog = Ti.UI.createAlertDialog({
    	message: args.info,
    	ok: 'Thanks',
    	title: 'Information'
  	});
  dialog.show();
}

$.row.categories = args.categories;
