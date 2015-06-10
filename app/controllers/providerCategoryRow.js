var args = arguments[0] || {};

$.navText.text = args.text;

function showInfo(e){
	e.cancelBubble = true;
	alert(args.info);
}

$.row.categories = args.categories;
