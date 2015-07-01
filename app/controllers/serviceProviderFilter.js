var args = arguments[0] || {};

var countyFilter = []; //list of selected counties
var categoryFilter = []; //list of selected categories

//iterate through list of filter categories
_.each(args.categories, function(category){
	//define category id, name, and callback function when clicked
	var params = {id:category.id, text:category.name, type:"category", callback:updateSummary};
	
	//if category exists in currently selected categories, mark category as being selected
	if(args.categories.length != args.currentCategories.length 
		&& _.find(args.currentCategories, function(cat){return cat.id == category.id;})){
		params.isSelected = true;
	}
	//add bubble picker
	$.categoriesPicker.add(Alloy.createController('categoryBubble', params).getView());
});

var countyKeys = Object.keys(args.counties);
_.each(countyKeys, function(key){
	//define county id, name, and callback function when clicked
	var params = {id:key, text:args.counties[key], type:"county", callback:updateSummary};
	
	//if county is already being viewed by user, mark it as being selected
	if(countyKeys.length != args.currentCounties.length && _.contains(args.currentCounties, key)){
		params.isSelected = true;
	}
	//add bubble picker
	$.countiesPicker.add(Alloy.createController('categoryBubble', params).getView());
});

/**
 * Callback function that maintains list of categories and counties by which the user 
 * wants to filter his/her query. 
 * @param {string} type - filter type (county or category)
 * @param {int} id - ID of the county or category
 * @param {string} text - county or category name
 * @param {bool} isNew - flag for determining if selection is a new addition. isNew is true 
 * 				if value should be added to category/county list; false if value should be removed
 */
function updateSummary(type, id, text, isNew){
	if(type === "county"){ //update list of filtered counties
		updateArray(countyFilter, $.countySummary);
		
	}
	else if(type === "category"){ //update list of filtered categories
		updateArray(categoryFilter, $.categorySummary);
	}
	
	/**
	 * Helper method that updates the appropriate filter array based on
	 * what the user selects.
 	 * @param {array} array - array to update (category or county array)
 	 * @param {Object} textField - the text field summary to update
	 */
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

/**
 * closes the window
 */
function close(){
	$.win.close();
}

/**
 * Requery service providers based on selected filter values. 
 */
function submit(){
	
	//if no categories or counties are specifically selected, then query all counties and categories
	var categories = categoryFilter.length > 0 ? _.pluck(categoryFilter, "id") : _.pluck(args.categories, "id");
	var counties = countyFilter.length > 0 ? _.pluck(countyFilter, "id") : Object.keys(args.counties);
	
	args.filterCallback(categories, counties);
	
	$.win.close();
}
/**
 * function to move to next view in scrollable view
 */
function gotoNext(){
	$.scrollableView.moveNext();
}

/**
 * function to move to previous view in scrollable view
 */
function gotoPrevious(){
	$.scrollableView.movePrevious();
}

/**
 * logic for county search bar
 */
var timeout = null;
var allChildren = $.countiesPicker.getChildren();
$.searchBar.addEventListener("change", function(e){
	if(timeout){
		clearTimeout(timeout);//do not let previous timeouts run
	}
	//Using 1.2 second timeout to reduce amount of view refreshing.
	timeout = setTimeout(function() {
		if(e.source.value.length > 0){ //if search field contains a value
			_.each(allChildren, function(child){
	     		if(child.text.trim().toLowerCase().indexOf(e.source.value.toLowerCase()) == -1){
	     			$.countiesPicker.remove(child);
	     		}
	     		else{
	     			$.countiesPicker.add(child);
	     		}
	     	});
	     }
	     else{
	     	//if search is empty, put all bubbles back
	     	_.each(allChildren, function(child){
	     		$.countiesPicker.add(child);
	     	});
	     }
    },1200);
});

Alloy.Globals.addActionBarButtons($.win);
