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
	$.leftTab.tintColor = "#929292";;
}

//on android, make the action bar buttons visible
Alloy.Globals.addActionBarButtons($.tabGroup);