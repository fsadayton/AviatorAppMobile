var _menu = null; //keeps track of android menu bar object

/**
 * Creates search icon/functionality that is located within the android menu bar
 * @param {Object} window - window or tabgroup containing the menu bar
 * @param {Object} providerListObj - an instance of serviceProviderListerView   
 */
exports.createAndroidSearchBar = function(window, providerListObj){
	var listView = providerListObj.getListView();
	window.addEventListener("open", function(e){
		listView.search = Alloy.createController("searchView").getView();
		Alloy.Globals.addActionBarButtons(window, [{
			params:{
				title: "search...",
				icon: "images/magnifying47.png",
				actionView: listView.search,
				showAsAction : Ti.Android.SHOW_AS_ACTION_ALWAYS
			}
		}],
		function(setMenu){
			_menu = setMenu;
			var abx = require('com.alcoapps.actionbarextras');
			abx.setSearchView({
				searchView: listView.search,
				textColor:"#fff",
				hintColor:"#b2dfd6",
				searchIcon:"images/magnifying47.png"
			});
		});
		listView.search.addEventListener("change", providerListObj.searchTimeout);
	});
};

/**
 * Method that changes which view the search bar is associated with.
 * To be used in cases of multiple tabs sharing the same android menu search.
 *  
 * @param {Object} actionView - the search property of a tableview (e.g. $.myTable.search)
 */
exports.changeSearchActionView = function(actionView){
	var item = null;
	
	if(_menu != null){
		item = _.findWhere(_menu.getItems(), {title:"search..."});
	} 
	
	if(item){
		item.actionView = actionView;	
	}
};

exports.nullifyAndroidMenu = function(){
	_menu = null;
};
