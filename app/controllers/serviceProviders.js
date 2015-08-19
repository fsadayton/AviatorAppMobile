var args = arguments[0] || {};

var Map = require('ti.map');
var countySelector = require("countySelectorUtils");

$.activityIndicator.show();
$.quickActivityIndicator.show();

var originalMapAnnotations = null; //list of map points from original search; used to maintain original points after search
var allHeaders = []; //list of all table headers to appear in list based on queried categories
var categoryNames = []; //array of relevant category names; used for filtering
var categoryDictionary = null; //dictionary of ALL category names and id's in database
var allCounties = null;

//list of categories and counties that are currently visible
//used to pre-populate filter values 
var filteredCategories = null;
var filteredCounties = null;

//get all category ID's and canonical names
Alloy.Globals.sendHttpRequest("GetCategoryLookupIndex", "GET", null, storeCategoryLookup);

/**
 * Function that stores the list of all categories and relevant category names upon
 * successful completion of GetCategoryLookupIndex REST call.
 */
function storeCategoryLookup(){
	categoryDictionary = JSON.parse(this.responseText);
	var profileBasics = Alloy.Models.profileBasics;
	profileBasics.fetch();
	categoryNames = getTableData(args.categories, [profileBasics.get('countyId')]);
}

/**
 * Function that iterates through category dictionary and creates a list of relevant category names
 * based on the given list of category ID's. Once category names are solidified, method sends request
 * to retrieve service provider data for given categories and counties. 
 * 		@param {array <int>} categories - list of category ID's for service provider info query
 * 		@param {array <int>} counties - list of county ID's for service provider info query
 * 		@return {array <Object>} - list of relevant category names and ID's 
 */
function getTableData(categories, counties){
	
	//hide any data that may be visible and show activity indicators
	$.crisisMenu.visible = false;
	$.providerList.visible = false;
	$.noResults.visible = false;
	$.quickNoResults.visible = false;
	$.activityIndicator.show();
	$.quickActivityIndicator.show();
	
	//reset table headers and 
	allHeaders = [];
	filteredCategories = [];
	
	//iterate through list of all categories
	_.each(categoryDictionary, function(category){
		if (_.contains(categories, category.id)){
			filteredCategories.push(category); //store list of currently selected categories, pass to filter when necessary
			//store list of table headers
			allHeaders.push(Ti.UI.createTableViewSection({
				title:category.id, 
				headerView: Alloy.createController('TableViewHeader', {text:category.name}).getView()
			}));
		}
	});
	filteredCounties = counties; //list of selected counties
	
	//send request to get all service providers that provide services for counties and categories
	Alloy.Globals.sendHttpRequest("GetServiceProviders?counties="+counties.join("&counties=")+"&categories=" 
	+ categories.join("&categories="), "GET", null, parseServiceProviders);
	
	return filteredCategories;
}

/**
 * Function that populates table data upon successful completion of GetServiceProviders
 * REST call. 
 */
function parseServiceProviders(){
	var json = JSON.parse(this.responseText);
	$.map.removeAllAnnotations(); //remove any previous map annotations
	//if no results are returned, let user know that there are no results
	if(json.length == 0){
		$.activityIndicator.hide();
		$.quickActivityIndicator.hide();
		$.noResults.visible = true;
		$.quickNoResults.visible = true;
	}
	else{
		var crisisHeaders = []; //reset list of crisis numbers
		//iterate through list of providers in JSON
		_.each(json, function(provider){
			var params = {
				orgName:provider.name,
				address:provider.address,
				description:provider.description,
				phone: provider.phoneNumber,
				email: provider.email,
				website: provider.website
			};
			addProviderToMap(params); //add provider location to the map
			//create table row with detail metadata
			var row = Alloy.createController('serviceProviderRow', params).getView();	
			
			//if provider has a crisis number, add it to crisis line table	
			if(provider.crisisNumber){
				crisisHeaders.push(Alloy.createController('serviceProviderRow', {
					orgName:provider.name,
					crisis: provider.crisisNumber
				}).getView());
			}
			//iterate through all of the categories that service provider specializes in
			_.each(provider.categories, function(category){
				//iterate through list of table headers and add service provider to header if category matches
				_.find(allHeaders, function(header){
					if(header.title === category){
						header.add(row);
						return true;
					}
				});	
			});
		});
		
		originalMapAnnotations = $.map.annotations; //store original map points
		//hide spinners
		$.activityIndicator.hide();
		$.quickActivityIndicator.hide();
		//make tables visible
		$.crisisMenu.visible = true;
		$.providerList.visible = true;
		//set table data
		$.providerList.setData(allHeaders);
		$.crisisMenu.setData(crisisHeaders);
	}
}

/**
 * Passes relevant detail info to provider detail view and opens view
 */    
function providerDetail(e){
	Alloy.createController('providerDetail',{
		orgName:e.row.orgName,
		address: e.row.address,
		description: e.row.description,
		phone: e.row.phone,
		email: e.row.email,
		website: e.row.website
	}).getView().open();
}

/**
 * Automatically opens phone app to call crisis line
 */
function callPhoneNumber(e){
    var cleanNumber = e.row.crisis.replace(/\s|-|\./g,'');
    Ti.Platform.openURL('tel:' + cleanNumber);
}

/**
 * Helper function for adding a service provider to the map
 */
function addProviderToMap(params){
	Alloy.Globals.Location.runCustomFwdGeocodeFunction(params.address, addAnnotation);
	function addAnnotation(e){
		var annotation = Map.createAnnotation({
	            latitude: e.places[0].latitude,
	   			longitude: e.places[0].longitude,
	            title: params.orgName,
	            row: params
           });
           $.map.addAnnotation(annotation);
	}
}

/**
 * Function that displays the distance between a user and a provider when 
 * an annotation is clicked and opens the provider detail page upon clicking 
 * the annotation popup box. 
 */
function mapClick(e){
	if(e.clicksource && e.clicksource != "pin"){
		providerDetail(e.annotation);
	}
	else if(e.clicksource && e.clicksource === "pin"){
		Alloy.Globals.Location.estimateDistance(Alloy.Globals.currentLocation, e.annotation.row.address + ", US", 
		function(distance){e.annotation.subtitle = distance + " • click for details";});
	}
}

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

//Initialize the search function for the crisis and service provider views
if(Alloy.Globals.isAndroid){
	var menu;
	$.tabGroup.addEventListener("open", function(e){
		//set each list search property to a new serach view
		$.providerList.search = Alloy.createController("searchView").getView();
		$.crisisMenu.search = Alloy.createController("searchView").getView();
		
		//add search capability to android action bar and grab menu value.
		//menu obj is used to change which table the search bar filters
		//when the tab changes (i.e., apply filter to "near by" tab or "quick call" tab)	
		Alloy.Globals.addActionBarButtons($.tabGroup, [{
				params:{
			        title: "search...",
		            icon: Ti.Android.R.drawable.ic_menu_search,
		            actionView: getActionView(),
		           	showAsAction : Ti.Android.SHOW_AS_ACTION_ALWAYS
	           	}
        	}], 
        	function(setMenu){menu = setMenu;});	
        
        //if provider list search changes, update annotations on the map. 
        var timeout = null;	
     	$.providerList.search.addEventListener("change", function(e){
     		if(timeout){
     			clearTimeout(timeout);//do not let previous timeouts run
     		}
     		//Using 1.2 second timeout to reduce amount of map redrawing.
     		timeout = setTimeout(function() {
     			if(e.source.value.length > 0){ //if search field contains a value
     				//find map annotations whose title contains the search field value
     				var filteredAnnotations = _.filter(originalMapAnnotations, function(annotation){return annotation.title.toLowerCase().indexOf(e.source.value.toLowerCase()) > -1;});
     				$.map.setAnnotations(filteredAnnotations);
     			}
     			else{
     				//if search is empty, put all annotations back on the map
     				$.map.setAnnotations(originalMapAnnotations);
     			}
     		},1200);
   		});
	});
	
	//listen for when tab changes
	$.tabGroup.addEventListener("focus", function(e) {
		//find the "search" menu item
		var item = menu == null ? null : _.findWhere(menu.getItems(), {title:"search..."});
		if (item){
			item.actionView = getActionView(); //set search filter to correspond to correct tab
		}
		else{
			$.tabGroup.getActivity().invalidateOptionsMenu(); //remake menu
		}
   });
   
   /**
    * helper function that returns the searchview associated with each tab
    */
	function getActionView(){
		if($.tabGroup.activeTab.title === "NEARBY"){
	        return $.providerList.search;
	    }
	    else if($.tabGroup.activeTab.title === "QUICK CALL"){
	    	return $.crisisMenu.search;
	    }
   	}
}
