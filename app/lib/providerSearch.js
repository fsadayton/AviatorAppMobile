var _menu = null; 
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
		}],
		function(setMenu){
			_menu = setMenu;
		});
		listView.search.addEventListener("change", providerListObj.searchTimeout);
	});
};

exports.changeActionView = function(actionView){
	var item = _menu === null ? null : _.findWhere(_menu.getItems(), {title:"search..."});
	if(item){
		item.actionView = actionView;	
	}
};
