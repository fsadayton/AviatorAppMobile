var args = arguments[0] || {};

var Map = require('ti.map');
var geocoder = require('ti.geocoder');

var originalMapAnnotations = null;
$.activityIndicator.show();
$.quickActivityIndicator.show();



Alloy.Globals.sendHttpRequest("GetCategoryLookupIndex", "GET", null, storeCategoryLookup);
var allHeaders = [];
function storeCategoryLookup(){
	var categoryDictionary = JSON.parse(this.responseText);
	
	_.each(categoryDictionary, function(category){
		if (_.contains(args.categories, category.id)){
			allHeaders.push(Ti.UI.createTableViewSection({title:category.id, headerView: Alloy.createController('TableViewHeader', {text:category.name}).getView()}));
		}
	});
	
	Alloy.Globals.sendHttpRequest("GetServiceProviders?counties=57&categories=" 
	+ args.categories.join("&categories="), "GET", null, parseServiceProviders);
}

function parseServiceProviders(){
	var json = JSON.parse(this.responseText);
	if(json.length == 0){
		$.activityIndicator.hide();
		$.quickActivityIndicator.hide();
		$.noResults.visible = true;
		$.quickNoResults.visible = true;
	}
	else{
		var crisisHeaders = [];
		_.each(json, function(provider){
			addProviderToMap(provider.address, provider.name);
			var row = Alloy.createController('serviceProviderRow', {
					orgName:provider.name,
					address:provider.address,
					description:provider.description,
					phone: provider.phoneNumber,
					email: provider.email,
					website: provider.website
				}).getView();	
				
			if(provider.crisisNumber){
				crisisHeaders.push(Alloy.createController('serviceProviderRow', {
					orgName:provider.name,
					crisis: provider.crisisNumber
				}).getView());
			}
			_.each(provider.categories, function(category){
				_.find(allHeaders, function(header){
					if(header.title === category){
						header.add(row);
						return true;
					}
				});	
			});
		});
		originalMapAnnotations = $.map.annotations;
		$.activityIndicator.hide();
		$.quickActivityIndicator.hide();
		$.providerList.setData(allHeaders);
		$.crisisMenu.setData(crisisHeaders);
	}
}

    
function providerDetail(e){
	Alloy.createController('providerDetail',{
		orgName:e.row.name,
		address: e.row.address,
		description: e.row.description,
		phone: e.row.phone,
		email: e.row.email,
		website: e.row.website
	}).getView().open();
}

function callPhoneNumber(e){
    var cleanNumber = e.row.crisis.replace(/\s|-|\./g,'');
    Ti.Platform.openURL('tel:' + cleanNumber);
}

function addProviderToMap(address, providerName){
	geocoder.forwardGeocoder(address, function(e){
		if(e.success)
		{
			var annotation = Map.createAnnotation({
	            latitude: e.places[0].latitude,
	   			longitude: e.places[0].longitude,
	            title: providerName,
	            subtitle: address
           });
           $.map.addAnnotation(annotation);
		}
		else{
				Ti.API.info("error with " + address +": "+ e.error);
			}
		
	});	
}

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
		$.mapView.visible = !isMapVisible;
		
		$.providerList.visible = !isMapVisible;
		$.listView.visible = isMapVisible;
	}
}

function filterResults(){
	alert("This feature is coming soon!");
}


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


