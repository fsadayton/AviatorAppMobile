var _selectable = true;

exports.setCountySelectable = function(isSelectable){
	_selectable = isSelectable;
};

exports.getCountySelectable = function(){
	return _selectable;
};

exports.selectable = _selectable;
