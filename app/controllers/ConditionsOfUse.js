var args = arguments[0] || {};

//TODO: REPLACE WITH OWN USER AGREEMENT VERBIAGE
$.textArea.value = "This app is funded through a grant from the Office for Victims of Crime, Office of Justice Programs, " +
		"U.S. Department of Justice. Neither the U.S. Department of Justice nor any of its components operate, control, are " +
		"responsible for, or necessarily endorse, this application (including, without limitation, its content, technical " +
		"infrastructure, and policies, and any services or tools provided).\n\n" +
		
		"This app was produced by Family Service Association, Inc. under Grant #2014-VF-GX-K019, awarded by the Office for Victims " +
		"of Crime, Office of Justice Programs, U.S. Department of Justice. The opinions, findings, and conclusions or recommendations " +
		"expressed in this app are those of the contributors and do not necessarily represent the official positions or policies of " +
		"the U.S. Department of Justice.\n\n" +
		
		"In using AVIATOR, I, the end-user, understand and agree to the following conditions:\n\n" + 
			
			"1) Although a resource (i.e., service provider) may be listed in the app, " +  
			"attempts to reach a particular resource via email, phone, or " +
			"other form of communication may go unanswered, even in the event " +
			"of a crisis. I will not hold Family Services of Dayton, Ohio liable for unsuccessful attempts " + 
			"to contact a resource.\n\n" +
			
			"2) I will not hold Family Services of Dayton, Ohio liable for the content of any third-party websites that are accessible through the app.";

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
