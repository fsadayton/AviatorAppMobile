var args = arguments[0] || {};
var win = null;

function closeWindow(){
	Ti.API.info("closing window: " + win);
	if(win){
		win.close();
	}
}

exports.setWindow = function(window){
	win = window;
};
