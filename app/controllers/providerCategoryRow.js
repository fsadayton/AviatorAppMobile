var args = arguments[0] || {};

//set row element data
$.navText.text = args.text;
$.row.categories = args.categories;
$.row.family = args.text;

/**
 * Function that extracts descriptive information from 
 * the row when its info button is clicked and 
 * displays it in a popup dialog.
 * @param {Object} e
 */
function showInfo(e){
	e.cancelBubble = true;
	var dialog = Ti.UI.createAlertDialog({
    	message: args.info,
    	ok: 'Thanks',
    	title: 'Information'
  	});
  dialog.show();
}
