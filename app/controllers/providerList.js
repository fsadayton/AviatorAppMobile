

function info(){
	
var alertDialog = Titanium.UI.createAlertDialog({
   // title: 'Organization Name',
    message: 'Connect with agencies to learn what programs are available for famalies and children in the comunity',
    buttonNames: ['Close', 'Connect'],
    cancel: 1
});
 
alertDialog.addEventListener('click',function(e){
    if (e.index == 0) {
        //code to execute when the user clicked Close.
    }else{
        //code to execute when the user clicked Connect
    }
});
 
alertDialog.show();
};

