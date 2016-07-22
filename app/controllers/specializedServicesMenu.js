var args = arguments[0] || {};
//initialize actions
Alloy.Globals.addActionBarButtons($.win);


var tableSection = Ti.UI.createTableViewSection({headerView: Alloy.createController('TableViewHeader', {text:args.tableHeader}).getView()});

//create veterans row
//FIXME: Create and use API call for getting specialty groups
/*tableSection.add(Alloy.createController('providerCategoryRow',{
	text: "Veterans", 
	info: "View services that are dedicated to serving veterans, military personnel, and their families."
}).getView());*/

_.each(args.tableRows, function(row){
	tableSection.add(Alloy.createController('providerCategoryRow', row).getView());
});
		
$.generalTable.setData([tableSection]);

/**
 * Opens veteran services view until more groups have
 * been incorporated. 
 */
function listProviders(){
	
	Alloy.Globals.open(args.viewName, args.viewArgs);
}
