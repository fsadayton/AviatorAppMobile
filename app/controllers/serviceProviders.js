var args = arguments[0] || {};

var providerObj = {providers:[{
	name:"South Community Behavioral Health",
	address:"3095 Kettering Blvd, Dayton, OH",
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
	address:"2211 Arbor Blvd, Dayton, OH",
	description:"Provides community mental health counseling, support services & services for the deaf",
	phone:"123.456.7890",
	email:"info@test.test",
	website:"www.google.com",
	categories:["Mental Health Counseling", "Services for the Disabled"]
}
]};
var allHeaders = [];
_.each(providerObj.providers, function(provider){
	var row = Alloy.createController('serviceProviderRow',{
			name:provider.name,
			address:provider.address,
			description:provider.description,
			phone: provider.phone,
			email: provider.email,
			website: provider.website
		}).getView();
		
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

var Map = require('ti.map');
var annotation = Map.createAnnotation({
            latitude: 39.766053,
   			longitude: -84.180840,
            title:"SSG",
            subtitle: "Dayton OH",
           });
           
           $.map.addAnnotation(annotation);
           
           annotation = Map.createAnnotation({
            latitude: 39.719704,
            longitude: -84.219832,
            title:"Family Services",
            subtitle: "Dayton OH",
           });
    $.map.addAnnotation(annotation);
    
   $.map.setRegion({latitude:39.719704, longitude:-84.219832, latitudeDelta:0.2, longitudeDelta:0.2});

    
function providerDetail(){
	Alloy.createController('providerDetail').getView().open();
}
