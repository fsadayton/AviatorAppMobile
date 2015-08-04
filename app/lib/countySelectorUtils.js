var _selectable = true;
var _selectedCounty = null;
var _counties = null;

exports.setCountySelectable = function(isSelectable){
	_selectable = isSelectable;
};

exports.getCountySelectable = function(){
	return _selectable;
};

exports.setSelectedCounty = function(county){
	_selectedCounty = county;
};

exports.getSelectedCounty = function(){
	return _selectedCounty;
};

exports.getCounties = function(callback){

	if (_counties == null){
		Alloy.Globals.sendHttpRequest("GetCounties", "GET", null, 
			function(){
				_counties = JSON.parse(this.responseText);
				callback(_counties);
			}
		);
	}
	else{
		callback(_counties);
	}
};

exports.selectable = _selectable;
