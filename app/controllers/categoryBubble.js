var args = arguments[0] || {};
var selectable = require('countySelectorUtils');
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
	Ti.API.info("selectable: "+ selectable.getCountySelectable());
	if($.bubbleText.backgroundColor == originalColor && selectable.getCountySelectable()){ //value is being "selected"
		$.bubbleText.backgroundColor = "#f9c84d";
		if(typeof args.callback === "function"){
			args.callback(args.id, $.bubbleText.text, true, args.type); //add new value to list
		}
	}
	else if($.bubbleText.backgroundColor != originalColor){ //bubble is being "de-selected"
		$.bubbleText.backgroundColor = originalColor;
		if(typeof args.callback === "function"){
			args.callback(args.id, $.bubbleText.text, false, args.type); //remove value from list
		}
	}
}
