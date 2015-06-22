var args = arguments[0] || {};

var Map = require('ti.map');
var geocoder = require('ti.geocoder');

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
	+ args.categories.join(), "GET", null, parseServiceProviders);
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
		$.providerList.search = Alloy.createController("searchView").getView();
		$.crisisMenu.search = Alloy.createController("searchView").getView();
			
		$.tabGroup.activity.onCreateOptionsMenu = function(e) {
			//e.menu.clear();
			menu = e.menu;
			Ti.API.info("creating opetion");
			var item = menu.findItem(0);
			if (item){
				Ti.API.info("item found!");
				item.actionView = getActionView();
			}
			else{
	           	menu.add({
		        	itemId: 0,
		        	title: "search...",
	            	icon: Ti.Android.R.drawable.ic_menu_search,
	            	actionView: getActionView(),
	           		showAsAction : Ti.Android.SHOW_AS_ACTION_ALWAYS
           		});
			}
	        
   		};
	});
	
	$.tabGroup.addEventListener("focus", function(e) {
		Ti.API.info("menu: " + menu);
        //$.tabGroup.getActivity().invalidateOptionsMenu();
   });
   
   function getActionView(){
   		if($.tabGroup.activeTab.title === "NEARBY"){
	        return $.providerList.search;
	    }
	    else if($.tabGroup.activeTab.title === "QUICK CALL"){
	    	return $.crisisMenu.search;
	    }
   }
}


