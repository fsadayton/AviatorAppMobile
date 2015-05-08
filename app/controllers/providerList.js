function info(){
	
var alertDialog = Titanium.UI.createAlertDialog({
   // title: 'Organization Name',
    message: 'Connect with agencies to learn what programs are available for famalies and children in the comunity',
    buttonNames: ['Close', 'Connect'],
    cancel: 1
});
 
 
alertDialog.show();
};

function listProviders(){
	Alloy.createController('listOfProviders').getView().open();
}
