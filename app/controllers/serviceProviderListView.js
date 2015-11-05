var args = arguments[0] || {};
var Map = require('ti.map');

var categoryDictionary;
var categoryNames;
var httpCall;

var filteredCategories;
var filteredCounties;
var originalMapAnnotations = [];

var crisisMenu;
var categorySubset;

var cats;

$.activityIndicator.show();

$.providerList.filterAttribute = Alloy.Globals.isAndroid ? "title" : "orgName";

/**
 * Determine type of provider list view and set the API call accordingly
 */
if(args.providerType === "general"){
	httpCall = Alloy.CFG.appData + "GetServiceProviders";
}
else if(args.providerType === "corrections"){
	httpCall = Alloy.CFG.lawEnforcementApi + "GetLawEnforcementProviders";
}
else if(args.providerType === "veterans"){
	httpCall = Alloy.CFG.veteransApi + "GetVeteranProviders";
}
else if(args.providerType === "compensation"){
	httpCall = Alloy.CFG.compensationApi + "GetCompensationProviders";
}

Alloy.Globals.sendHttpRequest(Alloy.CFG.appData + "GetCategoryLookupIndex", "GET", null, storeCategoryLookup);

function storeCategoryLookup(){
	categoryDictionary = JSON.parse(this.responseText);
	var profileBasics = Alloy.Models.profileBasics;
	profileBasics.fetch();
	
	if(args.providerType != null){
		var categories = categorySubset ? categorySubset : null;
		categoryNames = getTableData(categories, [profileBasics.get('countyId')]);
	}
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
	$.providerList.visible = false;
	$.noResults.visible = false;
	$.activityIndicator.show();
	
	if(filteredCounties == null || (filteredCounties != null && (filteredCounties.length != counties.length) 
		|| _.difference(filteredCounties, counties).length > 0)){
		
		//reset table headers and filtered counties
		allHeaders = [];
		filteredCategories = [];
		filteredCounties = counties; //list of selected counties
		
		if(args.providerType != "general"){
			categoryNames = [];
		}
		
		var apiUrl = httpCall + "?counties="+counties.join("&counties=");
		if(categories && args.providerType === "general"){
			//add categories to apiUrl
			var currentCategories = categorySubset ? categorySubset : categories;
			apiUrl += "&categories=" + currentCategories.join("&categories=");
			
			if(_.difference(categorySubset, categories).length > 0){
				cats = categories;
			}
			
			//iterate through list of all categories to create list of defined headers
			_.each(categoryDictionary, function(category){
				if (_.contains(currentCategories, category.id)){
					filteredCategories.push(category); //store list of currently selected categories, pass to filter when necessary
					//store list of table headers
					allHeaders.push(Ti.UI.createTableViewSection({
						title:category.id, 
						catName: category.name,
						headerView: Alloy.createController('TableViewHeader', {text:category.name}).getView()
					}));
				}
			});
		}
		else if(categories && args.providerType != "general"){
			cats = categories;
		}
	
		//send request to get all service providers that provide services for counties and categories
		Alloy.Globals.sendHttpRequest(apiUrl, "GET", null, parseResponse);
	}
	else{
		filterCategories(categories);
	}
	
	return filteredCategories;
}

/**
 * Function that only shows list of service providers associated with given categories.
 */
function filterCategories(categories){
	var localFilter = [];
	var localMap = [];
	filteredCategories = [];
	_.each(categories, function(category){
		filteredCategories.push({id:category});
		var header = _.find(allHeaders, function(header){
			return header.title === category;	
		});
		localFilter.push(header);
	});
	$.providerList.setData(localFilter);
	$.providerList.visible = true;
	$.activityIndicator.hide();
	
	_.each(originalMapAnnotations, 
    	function(annotation){
    		_.each(localFilter, function(header){
    			if(_.contains(annotation.row.categories, header.title)){
    				localMap.push(annotation);
    			}
    		});
     	}
	);
     $.map.setAnnotations(localMap);
}

/**
 * Function that populates table data upon successful completion of GetServiceProviders
 * REST call. 
 */
function parseResponse(){
	var json = JSON.parse(this.responseText);
	$.map.removeAllAnnotations(); //remove any previous map annotations
	$.providerList.visible = true;

	//if no results are returned, let user know that there are no results
	if(json.length === 0){
		$.providerList.setData([]);
		$.activityIndicator.hide();
		$.noResults.visible = true;
	}
	else{
		var sections = {};
		var crisisHeaders = []; //reset list of crisis numbers
		originalMapAnnotations = []; //TODO remove?
		//iterate through list of providers in JSON
		_.each(json, function(provider){
			var params = {
				orgName:provider.name,
				address:provider.address,
				orgDesc:provider.description,
				phone: provider.phoneNumber,
				email: provider.email,
				website: provider.website,
				categories: provider.categories
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
				if(args.providerType === "general"){
					addRowToDefinedSections(category, row);
				}
				else{
					addRowToDynamicSections(sections, category, row);
				}

			});
		});
		var keys = Object.keys(sections);
		allHeaders = allHeaders.length > 0 ?  allHeaders : keys.map(function(v){return sections[v];});
		
		//originalMapAnnotations = $.map.annotations; //store original map points
		
		//hide spinners
		$.activityIndicator.hide();
		//make tables visible
		$.providerList.visible = true;
		
		//set table data
		if(cats == null){
			$.providerList.setData(allHeaders);
		}
		else{
			filterCategories(cats);
		}
		
		if(crisisMenu){
			crisisMenu.setData(crisisHeaders);
		}
	}
}

/**
 * Function that either creates table header if it does not exist or retrieves
 * the table header and adds a table row to that header.
 * sections - dictionary of current table header objects
 * category - the current table header being retreived/created
 * row - the table row being added to the table header object
 */
function addRowToDynamicSections(sections, category, row){
	_.find(categoryDictionary, function(categoryDict){
		if(categoryDict.id === category){
			if(sections[categoryDict.id] == null){
				categoryNames.push(categoryDict);
				sections[categoryDict.id] = Ti.UI.createTableViewSection({
					title:categoryDict.id, 
					headerView: Alloy.createController('TableViewHeader', {text:categoryDict.name}).getView()
				});
			}
			sections[categoryDict.id].add(row);
			return true;
		}
	});
}

/**
 * Function that finds a header from a list of pre-defined table headers and adds
 * a table row to that header. 
 * category - the current table header being retrieved
 * row - the table row being added to the table header object
 */
function addRowToDefinedSections(category, row){
	_.find(allHeaders, function(header){
		if(header.title === category){
			header.add(row);
			return true;
		}
	});
}

/**
 * Function for opening provider detail page
 */
function providerDetail(e){
	Ti.API.info("provider detail desc: " + e.row.orgDesc);
	var args = {
		orgName:e.row.orgName,
		address: e.row.address,
		description: e.row.orgDesc,
		phone: e.row.phone,
		email: e.row.email,
		website: e.row.website
	};
	
	Alloy.Globals.open('providerDetail', args);
}

/**
 * Helper function for adding a service provider to the map
 */
function addProviderToMap(params){
	Alloy.Globals.Location.runCustomFwdGeocodeFunction(params.address, addAnnotation);
	function addAnnotation(e){
		var annotationParams = {
			latitude: e.places[0].latitude,
	   		longitude: e.places[0].longitude,
	        title: params.orgName,
	        row: params	
		};
		if(!Alloy.Globals.isAndroid){
			annotationParams.leftButton = Ti.UI.iPhone.SystemButton.INFO_DARK;
		}
		var annotation = Map.createAnnotation(annotationParams);
        $.map.addAnnotation(annotation);
        originalMapAnnotations.push(annotation);
           
	}
}

/**
 * Function that displays the distance between a user and a provider when 
 * an annotation is clicked and opens the provider detail page upon clicking 
 * the annotation popup box. 
 */
function mapClick(e){
	Ti.API.info("clicksource: " + e.clicksource);
	if(e.clicksource && e.clicksource != "pin" && e.clicksource != "map"){
		providerDetail(e.annotation);
	}
	else if(e.clicksource && e.clicksource === "pin"){
		Alloy.Globals.Location.estimateDistance(Alloy.Globals.currentLocation, e.annotation.row.address + ", US", 
			function(distance){
				e.annotation.subtitle = Alloy.Globals.isAndroid ? distance + " • click for details" : distance;
			}
		);
	}
}

/**
 * ************************************
 * ******** EXPORTED FUNCTIONS ********
 * ************************************
 */

/**
 * Function that returns an object used as part of the
 * provider filter.
 */
exports.getFilterParams = function(){
	var filterObj = {
		categories: categoryNames,
		filterCallback:getTableData,
		currentCategories: filteredCategories,
		currentCounties: filteredCounties
	};
	return filterObj;
};

/**
 * Returns an object containing the map module and the map view
 */
exports.getMapViews = function(){
	return {map:$.map, mapModule:$.mapModule};
};
/**
 * Returns the list of providers
 */
exports.getListView = function(){
	return $.providerList;
};

/**
 * Sets crisis menu which is to be used if service providers have crisis phone numbers
 */
exports.setCrisisMenu = function(crisisMenuObj){
	crisisMenu = crisisMenuObj;
};

/**
 * Sets subset of categories to appear in list view. Used when narrowing down
 * service providers from a selected family (e.g., health, food, safety, etc.) 
 */
exports.setCategories = function(categories){
	categorySubset = categories;
};

if(!Alloy.Globals.isAndroid){
	$.mapSearch.addEventListener('change', searchTimeout);
}
/**
 * Timeout function used for searching and setting the map annotations when typing
 * in search bar
 */
var timeout = null;
function searchTimeout(e){
	if(timeout){
    	clearTimeout(timeout);//do not let previous timeouts run
    }
    //Using 1.2 second timeout to reduce amount of map redrawing.
    timeout = setTimeout(function() {
    	Ti.API.info("RAWR: " + e.source.value);
    	if(e.source.value.length > 0){ //if search field contains a value
    		
    		Ti.API.info("in the if + orig map...: " + originalMapAnnotations);
     		//find map annotations whose title contains the search field value
     		var filteredAnnotations = _.filter(originalMapAnnotations, 
     				function(annotation){
     					Ti.API.info("ann title" + annotation.title);
     					return annotation.title.toLowerCase().indexOf(e.source.value.toLowerCase()) > -1;
     				}
     			);
     		$.map.setAnnotations(filteredAnnotations);
     	}
     	else{
     		Ti.API.info("in the else wtf");
     		//if search is empty, put all annotations back on the map
     		$.map.setAnnotations(originalMapAnnotations);
     	}
    },1200);
   		
}

exports.searchTimeout = searchTimeout;
