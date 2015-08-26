
exports.createAndroidSearchBar = function(window, providerListObj){
	var listView = providerListObj.getListView();
	window.addEventListener("open", function(e){
		listView.search = Alloy.createController("searchView").getView();
		Alloy.Globals.addActionBarButtons(window, [{
				params:{
			        title: "search...",
		            icon: Ti.Android.R.drawable.ic_menu_search,
		            actionView: listView.search,
		           	showAsAction : Ti.Android.SHOW_AS_ACTION_ALWAYS
	           	}
        	}]);
       listView.search.addEventListener("change", providerListObj.searchTimeout);
	});
};