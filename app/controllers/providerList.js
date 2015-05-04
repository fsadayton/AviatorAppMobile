var win = Ti.UI.createWindow({backgroundColor: '#999999', /*backgroundImage: '/global/background.png'*/});
var plainTemplate = {
    childTemplates: [
        {
            type: 'Ti.UI.Label', // Use a label
            bindId: 'rowtitle',  // Bind ID for this label
            properties: {        // Sets the Label.left property
                left: '5%',
                color: "#ffd400",
                backgroundColor: "#00a1ff",
                //width: '100%',
            }
        },
        {
            type: 'Ti.UI.ImageView',  // Use an image view
            bindId: 'pic',            // Bind ID for this image view
            properties: {             // Sets the ImageView.image property
            	image: '/global/info28.png',
            	width: '24dp',
            	right: '5%'
            }
        },                    
       /* 
        * 
        * This area adds a button with an event listner
        * 
        {
            type: 'Ti.UI.Button',   // Use a button
            bindId: 'button',       // Bind ID for this button
            properties: {           // Sets several button properties
                width: '80dp',
                height: '30dp',                        	
                right: '10dp',
                title: 'press me'
            },
            events: { click : report }  // Binds a callback to the button's click event
        }*/
    ]
};
function report(e) {
	Ti.API.info(e.type);
}
var listView = Ti.UI.createListView({
	top: '8%',
	separatorColor: "transparent",
	backgroundColor: "#00a1ff",
	opacity: 0.75,
 // Maps the plainTemplate object to the 'plain' style name
    templates: { 'plain': plainTemplate },
 // Use the plain template, that is, the plainTemplate object defined earlier
 // for all data list items in this list view
    defaultItemTemplate: 'plain' 
});
//Cycles through to generate i Number of rows
var data = [];
for (var i = 0; i < 15; i++) {
    data.push({
 // Maps to the rowtitle component in the template
 // Sets the text property of the Label component
        rowtitle : { text: 'Row ' + (i + 1) },
 // Sets the regular list data properties
        properties : {
            itemId: 'row' + (i + 1),
            accessoryType: Ti.UI.LIST_ACCESSORY_TYPE_NONE
        }
    });
}
var section = Ti.UI.createListSection({items: data});
listView.sections = [section];
listView.addEventListener('itemclick', function(e){
 // Only respond to clicks on the label (rowtitle) or image (pic)
 if (e.bindId == 'rowtitle' || e.bindId == 'pic') {
        var item = e.section.getItemAt(e.itemIndex);
 if (item.properties.accessoryType == Ti.UI.LIST_ACCESSORY_TYPE_NONE) {
            item.properties.accessoryType = Ti.UI.LIST_ACCESSORY_TYPE_CHECKMARK;
        }
 else {
            item.properties.accessoryType = Ti.UI.LIST_ACCESSORY_TYPE_NONE;
        }
        e.section.updateItemAt(e.itemIndex, item);
    }      
});

var headerView = 
/*require("header");
$.headerText.text= 'Test';*/
Titanium.UI.createView({
 	backgroundColor: "#00a1ff",
	opacity: 1,
	//opacity: 0.75,
	color: "#0e4bea",
	height: "8%",
	//height: "50dp",
	top: 0
});
var leftImage = Titanium.UI.createImageView({
	image: '/global/blind2.png',
	left: "6%",
	width: "11%"
});
var headText = Titanium.UI.createLabel({
	text: 'Service Providers',
	TitleId: 'headerText',
	color: "#ffd400",
	font:{
		fontSize: '24dp',
		fontWeight: 'bold'
	}
});
var rightImage = Titanium.UI.createImageView({
	image: '/global/add126.png',
	right: "6.5%",
	width: "11%"
});
headerView.add(leftImage);
headerView.add(headText);
headerView.add(rightImage);

win.add(headerView);
win.add(listView);
win.open();