var args = arguments[0] || {};
$.dialog.message = args.message;
$.dialog.title = args.title;
function doClick(e){
	
	Ti.API.info("event: " + JSON.stringify(e));
	e.cancelBubble = true;
	if(!e.cancel || (!Alloy.Globals.isAndroid && e.index === 0)){
		args.callback();
	}
}
