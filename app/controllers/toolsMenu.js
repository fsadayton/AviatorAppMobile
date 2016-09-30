var args = arguments[0] || {};
//initialize actions
Alloy.Globals.addActionBarButtons($.win);

var urlEndPoint = null;
if(Alloy.Globals.isAndroid){
	urlEndPoint = "GetToolsForAndroid";
}
else{
	urlEndPoint = "GetToolsForIOS";
}

var tableSection = Ti.UI.createTableViewSection({headerView: Alloy.createController('TableViewHeader', {text:"Apps and Sites"}).getView()});
var otherSection = Ti.UI.createTableViewSection({headerView: Alloy.createController('TableViewHeader', {text:"Other"}).getView()});

otherSection.add(Alloy.createController('providerCategoryRow', {text:'Document Storage', info:"stuff"}).getView());

//send request to get families and crime types
Alloy.Globals.sendHttpRequest(Alloy.CFG.toolsApi + urlEndPoint, "GET", null, parseToolsList);

function parseToolsList(e){
	
var json = JSON.parse(this.responseText);
	Ti.API.info(this.responseText);
	_.each(json, function(tool){
		tableSection.add(Alloy.createController('providerCategoryRow',{
			text: tool.Name, 
			info: tool.Description,
			viewArgs :{
				title: tool.Name,
				description: tool.Description,
				website: tool.WebsiteUrl,
				hasApp:tool.AppStoreUrl == null ? false : true,
				orgName:tool.Name,
				itunesUrl: tool.AppStoreUrl,
				androidUrl: tool.AppStoreUrl
			}	
		}).getView());
	});
	$.generalTable.setData([tableSection, otherSection]);
	/*itunesUrl: "itunes.apple.com/us/app/companion-never-walk-alone/id925211972",
				androidUrl:"io.companionapp.companion"*/
}

/**
 * Opens views as listed in the args variable. 
 */
function listProviders(e){
	Ti.API.info(JSON.stringify(e.row));
	Alloy.Globals.open("providerDetail", e.row.viewArgs);
}
