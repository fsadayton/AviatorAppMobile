
var tableSection = Ti.UI.createTableViewSection({headerView: Alloy.createController('TableViewHeader', {text:"What can we help you with?"}).getView()});	
var crimeTableSection = Ti.UI.createTableViewSection({headerView: Alloy.createController('TableViewHeader', {text:"What can we help you with?"}).getView()});

var generalArray = ["Compensation & Assistance", "Counseling & Support", "Children & Families"];
var crimeArray = ["Violent Crimes", "Cyber Crimes", "Crimes Against Eldery"];

for (var i = 0; i<crimeArray.length; i++){
	tableSection.add(Alloy.createController('providerCategoryRow',{text:generalArray[i], info:"Info about this category."}).getView());
	crimeTableSection.add(Alloy.createController('providerCategoryRow',{text:crimeArray[i], info:"Info about this crime category."}).getView());

	if (i == crimeArray.length - 1){
		$.generalTable.setData([tableSection]);
		$.crimeTable.setData([crimeTableSection]);
	}
}

function listProviders(){
	Alloy.createController('serviceProviders').getView().open();
}