var args = arguments[0] || {};

$.textArea.value = "In using Armor App, I, the end-user, understand and agree to the following conditions:\n\n" + 
			
			"1) Although a resource (i.e., service provider) may be listed in the app, " +  
			"attempts to reach a particular resource via email, phone, or " +
			"other form of communication may go unanswered, even in the event " +
			"of a crisis. I will not hold Armor App liable for unsuccessful attempts " + 
			"to contact a resource.\n\n" +
			
			"2) I will not hold Armor App liable for the content of any third-party websites that are accessible through the app.";
			
function saveAgreement(){
	Ti.App.Properties.setBool("hasAgreedToConditions", true);
	args.index.open();
	$.win.close();
}
