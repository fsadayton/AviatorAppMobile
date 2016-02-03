$.generalIndicator.show();
$.crimeIndicator.show();
//NOTE: The term 'families' refers to broad categories of services, such as "Safety, Community, Basic Needs, etc."

//Create table headers for each table type: families and crimes
var tableSection = Ti.UI.createTableViewSection({headerView: Alloy.createController('TableViewHeader', {text:"What can we help you with?"}).getView()});	
var crimeTableSection = Ti.UI.createTableViewSection({headerView: Alloy.createController('TableViewHeader', {text:"What can we help you with?"}).getView()});

//send request to get families and crime types
Alloy.Globals.sendHttpRequest(Alloy.CFG.appData + "GetFamilies", "GET", null, parseFamilies);
Alloy.Globals.sendHttpRequest(Alloy.CFG.appData + "GetCrimeTypes", "GET", null, parseCrimes);

/**
 * Create list of family names
 */
function parseFamilies(){
	var json = JSON.parse(this.responseText);
	
	_.each(json, function(family){
		tableSection.add(Alloy.createController('providerCategoryRow',{
			text: family.name, 
			info: family.description,
			categories: family.categoryIds 
		}).getView());
	});
	$.generalIndicator.hide();
	$.generalTable.setData([tableSection]);
}

/**
 * Create list of crime names
 */
function parseCrimes(){
	var json = JSON.parse(this.responseText);
	_.each(json, function(family){
		crimeTableSection.add(Alloy.createController('providerCategoryRow',{
			text: family.name, 
			info: family.description,
			categories: [family.id]
		}).getView());

	});
	$.crimeIndicator.hide();
	$.crimeTable.setData([crimeTableSection]);
}

/**
 * Open list of service providers associated with a crime or family
 * @param {Object} e - event data
 */
function listProviders(e){
	Alloy.Globals.open('serviceProviders', {categories:e.row.categories, title:e.row.family});
	
	if(Alloy.Globals.isAndroid){
		if($.tabGroup.activeTab.title === "GENERAL"){
			Ti.Analytics.featureEvent('personalResources.category.general');
		}
		else{
			Ti.Analytics.featureEvent('personalResources.category.crime');
		}
	}
	else{
		if($.tab1.visible){
			Ti.Analytics.featureEvent('personalResources.category.general');
		}
		else{
			Ti.Analytics.featureEvent('personalResources.category.crime');
		}
	}
}

/**
 * Specific iOS function that makes the content associated
 * with the left tab visible, and changes the color of the 
 * active tab
 */
function onLeftTabClick(){
	$.tab1.visible = true;
	$.tab2.visible = false;
	
	$.leftTab.tintColor = "#009577";
	$.rightTab.tintColor = "#929292";
	
}

/**
 * Specific iOS function that makes the content associated
 * with the right tab visible, and changes the color of the 
 * active tab
 */
function onRightTabClick(){
	$.tab1.visible = false;
	$.tab2.visible = true;
	
	$.rightTab.tintColor = "#009577";
	$.leftTab.tintColor = "#929292";
	
}

function openMessage(){
	Alloy.createController("alertDialog", {
		title: "Help",
		message:"Find local resources by clicking on the category that aligns with your needs. If you are a victim of crime, use the Crime tab, otherwise use the General tab. Would you like to visit our YouTube channel for a complete tutorial?",
		callback: function(){
			Ti.Platform.openURL("https://www.youtube.com/playlist?list=PL5h6KCzb5JtT3n7fjEvtRrhlVk1aEEP20");
		}}).getView().show();
}
		
//on android, make the action bar buttons visible
if(Alloy.Globals.isAndroid){
	Alloy.Globals.addActionBarButtons($.tabGroup, [{
	params:{
		title:"Help",
		icon: "images/question30.png",
		showAsAction : Ti.Android.SHOW_AS_ACTION_ALWAYS
	}
	}], 
	function getMenu(menu){
		//Add functionality for sharing a service provider
		var shareItem = _.findWhere(menu.getItems(), {title:"Help"});
		shareItem.addEventListener("click", openMessage);
	}
);
}

		

