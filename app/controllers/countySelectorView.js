var args = arguments[0] || {};

//init function for passing data to county selector view 
$.init = function(obj){
	var countyKeys = Object.keys(obj.counties);
	_.each(countyKeys, function(key){
		//define county id, name, and callback function when clicked
		var params = {id:key, text:obj.counties[key], type:"county", callback:obj.countyCallback};
		
		//if county is already being viewed by user, mark it as being selected
		if(obj.currentCounties && countyKeys.length != obj.currentCounties.length 
			&& _.contains(obj.currentCounties, key)){
			params.isSelected = true;
		}
		//add bubble picker
		$.countiesPicker.add(Alloy.createController('categoryBubble', params).getView());
	});
	
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
			$.countiesPicker.removeAllChildren(); //ensures that children will appear in alphabetical order when added to view
			if(e.source.value.length > 0){ //if search field contains a value
				_.each(allChildren, function(child){
					if(child.text.trim().toLowerCase().indexOf(e.source.value.toLowerCase()) > -1){
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
};
