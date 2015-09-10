var args = arguments[0] || {};

var tableSection = Ti.UI.createTableViewSection({headerView: Alloy.createController('TableViewHeader', {text:"Select a Specialty Group"}).getView()});

//create veterans row
//TODO: Create and use API call for getting specialty groups
tableSection.add(Alloy.createController('providerCategoryRow',{
	text: "Veterans", 
	info: "View services that are dedicated to serving veterans, military personnel, and their families."
}).getView());
		
$.generalTable.setData([tableSection]);

/**
 * Opens veteran services view until more groups have
 * been incorporated. 
 */
function listProviders(){
	Alloy.createController('veteranServices').getView().open();
}
