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
};
