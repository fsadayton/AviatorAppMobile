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

otherSection.add(Alloy.createController('providerCategoryRow', {text:'Document Storage', info:"Take pictures of documents for later retrieval."}).getView());

//send request to get families and crime types
Alloy.Globals.sendHttpRequest(Alloy.CFG.toolsApi + urlEndPoint, "GET", null, parseToolsList);

function parseToolsList(e){
	
var json = JSON.parse(this.responseText);
	_.each(json, function(tool){
		tableSection.add(Alloy.createController('providerCategoryRow',{
			text: tool.name, 
			info: tool.description,
			viewArgs :{
				title: tool.name,
				description: tool.description,
				website: tool.websiteUrl,
				hasApp:tool.appStoreUrl == null ? false : true,
				orgName:tool.name,
				itunesUrl: tool.appStoreUrl,
				androidUrl: tool.appStoreUrl
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
	
	if(e.row.family.indexOf("Document Storage") > -1){
		Alloy.Globals.open("documentStorage", {title:"Document Storage"});
	}
	else{
		Alloy.Globals.open("providerDetail", e.row.viewArgs);
	}
}
