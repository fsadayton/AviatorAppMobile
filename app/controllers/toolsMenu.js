var args = arguments[0] || {};
//initialize actions
Alloy.Globals.addActionBarButtons($.win);


var tableSection = Ti.UI.createTableViewSection({headerView: Alloy.createController('TableViewHeader', {text:args.tableHeader}).getView()});

_.each(args.tableRows, function(row){
	tableSection.add(Alloy.createController('providerCategoryRow', row).getView());
});
		
$.generalTable.setData([tableSection]);

/**
 * Opens views as listed in the args variable. 
 */
function listProviders(){
	
	Alloy.Globals.open(args.viewName, args.viewArgs);
}
