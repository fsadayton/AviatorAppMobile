var args = arguments[0] || {};

//TODO: REPLACE WITH OWN USER AGREEMENT VERBIAGE
$.textArea.value = "In using AVIATOR, I, the end-user, understand and agree to the following conditions:\n\n" + 
			
			"1) Although a resource (i.e., service provider) may be listed in the app, " +  
			"attempts to reach a particular resource via email, phone, or " +
			"other form of communication may go unanswered, even in the event " +
			"of a crisis. I will not hold AVIATOR liable for unsuccessful attempts " + 
			"to contact a resource.\n\n" +
			
			"2) I will not hold AVIATOR liable for the content of any third-party websites that are accessible through the app.";

/**
 * Function for saving the status of agreeing to conditions of use.
 */			
function saveAgreement(e){
	e.cancelBubble = true;
	Ti.App.Properties.setBool("hasAgreedToConditions", true);
	args.index.open();
	$.win.close();
}

/**
 * Function for closing app if user does not agree to
 * conditions of use.
 */
function closeApp(){
	Ti.App.Properties.setBool("hasAgreedToConditions", false);
	if(Alloy.Globals.isAndroid){
		$.win.close();
	}
	else{
		alert("You cannot proceed to the app unless you agree to the Conditions of Use.");
	}
	
}
