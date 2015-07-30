var args = arguments[0] || {};
$.dialog.message = args.message;
$.dialog.title = args.title;
function doClick(e){
	e.cancelBubble = true;
	if(!e.cancel){
		args.callback();
	}
}
