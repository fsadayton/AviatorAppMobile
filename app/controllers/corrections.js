
if(Alloy.Globals.isAndroid){
	var listView = $.providerList.getListView();
	$.tabGroup.addEventListener("open", function(e){
		Ti.API.info("tabgroup open.......");
		listView.search = Alloy.createController("searchView").getView();
		Alloy.Globals.addActionBarButtons($.tabGroup, [{
				params:{
			        title: "search...",
		            icon: Ti.Android.R.drawable.ic_menu_search,
		            actionView: listView.search,
		           	showAsAction : Ti.Android.SHOW_AS_ACTION_ALWAYS
	           	}
        	}]);
       listView.search.addEventListener("change", $.providerList.searchTimeout);
	});
}

$.providerButtonBar.setProviderListObject($.providerList);

