var args = arguments[0] || {};

var Map = require('ti.map');
var providerObj = {providers:[{
	name:"South Community Behavioral Health",
	address:"3095 Kettering Boulevard, Moraine, OH",
	description:"Provides mental health counseling",
	phone:"123.456.7890",
	email:"info@test.test",
	website:"www.google.com",
	categories:["Mental Health Counseling"]
},
{
	name:"Artemis Domestic Violence Ctr",
	address:"310 W Monument Ave, Dayton, OH",
	description:"Provides crisis intervention, safety planning, education, and support to victims of domestic violence and their children.",
	phone:"123.456.7890",
	email:"info@test.test",
	website:"www.google.com",
	categories:["Domestic Violence Support"],
	crisis:"937-222-7233"
},
{
	name:"Family Services Association",
	address:"2211 Arbor Boulevard, Moraine, OH",
	description:"Provides community mental health counseling, support services & services for the deaf",
	phone:"123.456.7890",
	email:"info@test.test",
	website:"www.google.com",
	categories:["Mental Health Counseling", "Services for the Disabled"]
}
]};
var allHeaders = [];
var crisisHeaders = [];
_.each(providerObj.providers, function(provider){
	addProviderToMap(provider.address + ", US", provider.name);
	var row = Alloy.createController('serviceProviderRow', {
			name:provider.name,
			address:provider.address,
			description:provider.description,
			phone: provider.phone,
			email: provider.email,
			website: provider.website,
		}).getView();	
	if(provider.crisis){
		crisisHeaders.push(Alloy.createController('serviceProviderRow', {
			name:provider.name,
			crisis: provider.crisis
		}).getView());
	}
		
	_.each(provider.categories, function(category){
		
		var headerIndex =  -1;
		
		_.find(allHeaders, function(header, index){
			if(header.title === category){
				headerIndex = index;
				return true;
			}
		});
		
		Ti.API.info("header index: " + headerIndex);
		if(headerIndex > -1){
			allHeaders[headerIndex].add(row);
			
		}
		else{
			
			var section = Ti.UI.createTableViewSection({title:category, headerView: Alloy.createController('TableViewHeader', {text:category}).getView()});
			section.add(row);
			allHeaders.push(section);
		}	
	});
});

$.menu.setData(allHeaders);
$.crisisMenu.setData(crisisHeaders);
    
function providerDetail(e){
	Alloy.createController('providerDetail',{
		name:e.row.name,
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
	Ti.Geolocation.forwardGeocoder(address, function(evt){
		if(evt.success && evt.latitude)
		{
			Ti.API.info("map success for " + providerName + evt.latitude);
			var annotation = Map.createAnnotation({
	            latitude: evt.latitude,
	   			longitude: evt.longitude,
	            title: providerName,
	            subtitle: address
           });
           $.map.addAnnotation(annotation);
		}
		else{
				Ti.API.info("error with " + address +": "+ evt.error);
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
		
		$.menu.visible = !isMapVisible;
		$.listView.visible = isMapVisible;
	}
}
