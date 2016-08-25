var args = arguments[0] || {};
//initialize actions
Alloy.Globals.addActionBarButtons($.win);

$.generalIndicator.show();


//Create table headers for each table type: families and crimes
var tableSection = Ti.UI.createTableViewSection({headerView: Alloy.createController('TableViewHeader', {text:"What can we help you with?"}).getView()});	


//send request to get families and crime types
Alloy.Globals.sendHttpRequest(Alloy.CFG.appData + "GetSpecialPopulationFamilies", "GET", null, parseFamilies);

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
 * Opens veteran services view until more groups have
 * been incorporated. 
 */
function listProviders(e){
	Alloy.Globals.open('serviceProviders', {categories:e.row.categories, title:e.row.family});
	//Alloy.Globals.open(args.viewName, args.viewArgs);
}
