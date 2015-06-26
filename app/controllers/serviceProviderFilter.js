var args = arguments[0] || {};

_.each(args.categories, function(category){
	$.categoriesPicker.add(Alloy.createController('categoryBubble', {id:category.id, text:category.name, type:"category", callback:updateSummary}).getView());
});

for (var key in args.counties){
	//$.countyList.appendRow(Alloy.createController('countyRow', {title:args.counties[key]}).getView());
	$.countiesPicker.add(Alloy.createController('categoryBubble', {id:key, text:args.counties[key], type:"county", callback:updateSummary}).getView());
}

var countyFilter = [];
var categoryFilter = [];

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

function gotoNext(){
	$.scrollableView.moveNext();
}

function gotoPrevious(){
	$.scrollableView.movePrevious();
}

Alloy.Globals.addActionBarButtons($.win);


