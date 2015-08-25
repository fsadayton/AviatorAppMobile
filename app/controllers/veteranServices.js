var args = arguments[0] || {};

if(Alloy.Globals.isAndroid){
	var listView = $.providerList.getListView();
	$.win.addEventListener("open", function(e){
		listView.search = Alloy.createController("searchView").getView();
		Alloy.Globals.addActionBarButtons($.win, [{
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

