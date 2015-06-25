var args = arguments[0] || {};

$.bubbleText.text = "  " + args.text + "  ";
$.bubbleText.catId = args.id;

var originalColor = $.bubbleText.backgroundColor;
function toggle(){
	Ti.API.info("original color: " + originalColor);
	if($.bubbleText.backgroundColor == originalColor){
		$.bubbleText.backgroundColor = "#f9c84d";
	}
	else{
		$.bubbleText.backgroundColor = originalColor;
	}
}
