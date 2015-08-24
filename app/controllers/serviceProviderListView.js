var args = arguments[0] || {};
var Map = require('ti.map');

var categoryNames;
var httpCall;

var filteredCategories;
var filteredCounties;
var originalMapAnnotations;

$.activityIndicator.show();
Ti.API.info("service provider list open");

if(args.providerType === "corrections"){
	Alloy.Globals.sendHttpRequest("GetCategoryLookupIndex", "GET", null, storeCategoryLookup);
	httpCall = "GetServiceProviders";
}

function storeCategoryLookup(){
	categoryDictionary = JSON.parse(this.responseText);
	var profileBasics = Alloy.Models.profileBasics;
	profileBasics.fetch();
	//TODO: establish way of getting categories
	categoryNames = getTableData([1,8,9], [profileBasics.get('countyId')]);
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
	Ti.API.info("cats: " + categories);
	Ti.API.info("counties: " + counties);
	//hide any data that may be visible and show activity indicators
	$.providerList.visible = false;
	$.noResults.visible = false;
	$.activityIndicator.show();
	
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
	Alloy.Globals.sendHttpRequest(httpCall + "?counties="+counties.join("&counties=")+"&categories=" 
	+ categories.join("&categories="), "GET", null, parseResponse);
	
	return filteredCategories;
}

/**
 * Function that populates table data upon successful completion of GetServiceProviders
 * REST call. 
 */
function parseResponse(){
	var json = JSON.parse(this.responseText);
	$.map.removeAllAnnotations(); //remove any previous map annotations

	//if no results are returned, let user know that there are no results
	if(json.length == 0){
		$.activityIndicator.hide();
		$.noResults.visible = true;
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
			/*if(provider.crisisNumber){
				crisisHeaders.push(Alloy.createController('serviceProviderRow', {
					orgName:provider.name,
					crisis: provider.crisisNumber
				}).getView());
			}*/
			
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
		//make tables visible
		$.providerList.visible = true;
		//set table data
		$.providerList.setData(allHeaders);
	}
}

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

exports.getFilterParams = function(){
	var filterObj = {
		categories: categoryNames,
		filterCallback:getTableData,
		currentCategories: filteredCategories,
		currentCounties: filteredCounties
	};
	return filterObj;
};

exports.getMapViews = function(){
	return {map:$.map, mapModule:$.mapModule};
};

exports.getListView = function(){
	return $.providerList;
};
var timeout = null;
exports.searchTimeout = function(e){
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
   		
};
