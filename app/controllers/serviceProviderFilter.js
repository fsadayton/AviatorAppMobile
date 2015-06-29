var args = arguments[0] || {};
var countyFilter = [];
var categoryFilter = [];

Ti.API.info("currentCounties: " + args.currentCounties);
Ti.API.info("categories: " + args.currentCategories);
_.each(args.categories, function(category){
	var params = {id:category.id, text:category.name, type:"category", callback:updateSummary};
	
	if(args.categories.length != args.currentCategories.length && _.find(args.currentCategories, function(cat){return cat.id == category.id;})){
		params.isSelected = true;
	}
	$.categoriesPicker.add(Alloy.createController('categoryBubble', params).getView());
});

for (var key in args.counties){
	var params = {id:key, text:args.counties[key], type:"county", callback:updateSummary};
	
	if(_.contains(args.currentCounties, key)){
		params.isSelected = true;
		Ti.API.info("current county matches: " + key);
	}
	$.countiesPicker.add(Alloy.createController('categoryBubble', params).getView());
}

function updateSummary(type, id, text, isNew){
	if(type === "county"){
		updateArray(countyFilter, $.countySummary);
		
	}
	else if(type === "category"){
		updateArray(categoryFilter, $.categorySummary);
	}
	
	function updateArray(array, textField){
		if(isNew){
			array.push({id:id, name:text.trim()});
		}
		else{
			var tmpArray = _.pluck(array, "id");
			array.splice(_.indexOf(tmpArray, id), 1);
		}
		textField.text = array.length > 0 ? _.pluck(array, "name").join(", ") : "all";
	}
}

function close(){
	$.win.close();
}

function submit(){
	
	var categories = categoryFilter.length > 0 ? _.pluck(categoryFilter, "id") : _.pluck(args.categories, "id");
	var counties = countyFilter.length > 0 ? _.pluck(countyFilter, "id") : Object.keys(args.counties);
	
	args.filterCallback(categories, counties);

	$.win.close();
}

function gotoNext(){
	$.scrollableView.moveNext();
}

function gotoPrevious(){
	$.scrollableView.movePrevious();
}

Alloy.Globals.addActionBarButtons($.win);


