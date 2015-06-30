var args = arguments[0] || {};

$.bubbleText.text = "  " + args.text + "  "; //set filter bubble text

var originalColor = $.bubbleText.backgroundColor; //store original unselected bubble color

/**
 * if user is currently filtering by given value, mark it as selected
 */
if(args.isSelected){
	toggle();
}

/**
 * function to toggle the "selected" color of the filter bubble
 * and call function that updates list of selected filters
 */
function toggle(){
	if($.bubbleText.backgroundColor == originalColor){ //value is being "selected"
		$.bubbleText.backgroundColor = "#f9c84d";
		args.callback(args.type, args.id, $.bubbleText.text, true); //add new value to list
	}
	else{ //bubble is being "de-selected"
		$.bubbleText.backgroundColor = originalColor;
		args.callback(args.type, args.id, $.bubbleText.text, false); //remove value from list
	}
}
