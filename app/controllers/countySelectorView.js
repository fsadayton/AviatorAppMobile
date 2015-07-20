var args = arguments[0] || {};

var selectedCounty = null;
var selectable = require('countySelectorUtils');

$.init = function(obj){
	Ti.API.info("obj: " + JSON.stringify(obj));
	
	var countyKeys = Object.keys(obj.counties);
	_.each(countyKeys, function(key){
		//define county id, name, and callback function when clicked
		var params = {id:key, text:obj.counties[key], type:"county", callback:updateSelection};
		
		//if county is already being viewed by user, mark it as being selected
		/*if(countyKeys.length != args.currentCounties.length && _.contains(args.currentCounties, key)){
			params.isSelected = true;
		}*/
		
		//add bubble picker
		$.countiesPicker.add(Alloy.createController('categoryBubble', params).getView());
	});
	
	function updateSelection(countyId, countyName, isNew){
		if(isNew){
			selectable.setSelectedCounty({id:countyId, name:countyName});
			selectable.setCountySelectable(false);
		}
		else{
			selectable.setSelectedCounty(null);
			selectable.setCountySelectable(true);
		}
		Ti.API.info("selectable: "+ selectable.getCountySelectable());
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
	
};


//