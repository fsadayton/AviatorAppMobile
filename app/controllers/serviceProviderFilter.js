var args = arguments[0] || {};

function close(){
	$.win.close();
}

_.each(args.categories, function(category){
	$.categoriesPicker.add(Alloy.createController('categoryBubble', {id:category.id, text:category.name}).getView());
});

for (var key in args.counties){
	//$.countyList.appendRow(Alloy.createController('countyRow', {title:args.counties[key]}).getView());
	$.countiesPicker.add(Alloy.createController('categoryBubble', {id:key, text:args.counties[key]}).getView());

}

Alloy.Globals.addActionBarButtons($.win);


