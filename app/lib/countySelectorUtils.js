var _selectable = true;
var _selectedCounty = null;

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

exports.selectable = _selectable;
