var args = arguments[0] || {};
var countySelector = require("countySelectorUtils");

var mapModule;
var map;
var listView;

var filterParams;

exports.setMapViews = function(mapModule, map){
	this.mapModule = mapModule;
	this.map = map;
};

exports.setListView = function(listView){
	this.listView = listView;
};

exports.setFilterParams = function(paramsObj){
	filterParams = paramsObj;
};

/**
 * Function that either displays list of service providers or map of
 * service providers based on user preference. 
 */
function toggleMapListView(){
	if($.mapModule.visible){
		setMapVisibility(false);
	}
	else{
		setMapVisibility(true);
		$.map.setRegion({latitude:39.719704, longitude:-84.219832, latitudeDelta:0.2, longitudeDelta:0.2});
	}
	
	function setMapVisibility(isMapVisible){
		$.mapModule.visible = isMapVisible;
		$.mapButton.visible = !isMapVisible;
		
		$.listView.visible = !isMapVisible;
		$.listButton.visible = isMapVisible;
	}
}

/**
 * Function that passes in all category names and counties, a callback method
 * to be executed once filtering option have been submitted, and the 
 * current counties and categories that users are viewing to the filter 
 * window and opens it. 
 */
function filterResults(){
	countySelector.getCounties(function(counties){
		createFilter(counties);
	});
	
	/**
	 * helper function for creating filter view
	 */
	function createFilter(countiesList){
		Alloy.createController("serviceProviderFilter", {
			categories: categoryNames,
			counties: countiesList,
			filterCallback:getTableData,
			currentCategories: filteredCategories,
			currentCounties: filteredCounties
		}).getView().open();
	}
}