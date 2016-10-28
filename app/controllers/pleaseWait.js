var args = arguments[0] || {};

/**
 * Function that displays a loading animation and adds
 * the quick hide and trusted contact buttons to the 
 * 'Please Wait' dialog. 
 */
function initWin(){
	$.activityIndicator.show();
	Alloy.Globals.updateActionBar();
}

