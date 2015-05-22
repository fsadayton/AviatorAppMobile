var Map = require('ti.map');
var annotation = Map.createAnnotation({
            latitude: 39.766053,
   			longitude: -84.180840,
            title:"SSG",
            subtitle: "Dayton OH",
           });
    $.map.addAnnotation(annotation);
    
function providerDetail(){
	Alloy.createController('providerDetail').getView().open();
};
