var args = arguments[0] || {}; //contains message, alert title, and callback method
$.dialog.message = args.message;
$.dialog.title = args.title;

/**
 * Function that executes callback method located in args object after user has clicked
 * "YES".
 * @param {Object} e - click event
 */
function doClick(e){
	e.cancelBubble = true;
	if(!e.cancel || (!Alloy.Globals.isAndroid && e.index === 0)){
		args.callback();
	}
}
