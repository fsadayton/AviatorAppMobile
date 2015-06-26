var args = arguments[0] || {};

$.bubbleText.text = "  " + args.text + "  ";

var countyFilter = [];
var categoryFilter = [];

var originalColor = $.bubbleText.backgroundColor;

function toggle(){
	Ti.API.info("original color: " + originalColor);
	if($.bubbleText.backgroundColor == originalColor){
		$.bubbleText.backgroundColor = "#f9c84d";
		args.callback(args.type, args.id, $.bubbleText.text, true);
	}
	else{
		$.bubbleText.backgroundColor = originalColor;
		args.callback(args.type, args.id, $.bubbleText.text, false);
	}
}
