$.generalIndicator.show();
$.crimeIndicator.show();

var tableSection = Ti.UI.createTableViewSection({headerView: Alloy.createController('TableViewHeader', {text:"What can we help you with?"}).getView()});	
var crimeTableSection = Ti.UI.createTableViewSection({headerView: Alloy.createController('TableViewHeader', {text:"What can we help you with?"}).getView()});

Alloy.Globals.sendHttpRequest(Alloy.CFG.appData + "GetFamilies", "GET", null, parseFamilies);
Alloy.Globals.sendHttpRequest(Alloy.CFG.appData + "GetCrimeTypes", "GET", null, parseCrimes);

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

function listProviders(e){
	//Alloy.createController('serviceProviders', {categories:e.row.categories}).getView().open();
	Alloy.Globals.open('serviceProviders', {categories:e.row.categories});
}

Alloy.Globals.addActionBarButtons($.tabGroup);