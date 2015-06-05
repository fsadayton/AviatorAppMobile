// The contents of this file will be executed before any of
// your view controllers are ever executed, including the index.
// You have access to all functionality on the `Alloy` namespace.
//
// This is a great place to do any initialization for your app
// or create any global variables/functions that you'd like to
// make available throughout your app. You can easily make things
// accessible globally by attaching them to the `Alloy.Globals`
// object. For example:
//
// Alloy.Globals.someGlobalFunction = function(){};

// Loads the map module, which can be referenced by Alloy.Globals.Map
Alloy.Globals.Map = require('ti.map');

Alloy.Globals.addActionBarButtons = function(window){
    window.activity.onCreateOptionsMenu = function(e) { 
    var menu = e.menu; 
    var menuItem = menu.add({ 
        title : "Hide", 
        icon : "/global/blind2.png", 
        showAsAction : Ti.Android.SHOW_AS_ACTION_IF_ROOM 
    }); 
    
    menu.add({
        title : "Help",
        icon : "/global/add126.png", 
        showAsAction : Ti.Android.SHOW_AS_ACTION_IF_ROOM 
    });
    
    
    menuItem.addEventListener("click", function(e) { 
        hide(); 
    }); 
    };
    
};

function hide(){
    //Either line can be commented or un-commented to show the photo gallery or camera of the device
//Titanium.Media.openPhotoGallery({
Titanium.Media.showCamera({
    success:function(event) {
 // called when media returned from the camera
        Ti.API.debug('Our type was: '+event.mediaType);
 if(event.mediaType == Ti.Media.MEDIA_TYPE_PHOTO) {
            var imageView = Ti.UI.createImageView({
                width:win.width,
                height:win.height,
                image:event.media
            });
            win.add(imageView);
        } else {
            alert("got the wrong type back ="+event.mediaType);
        }
    },
    
    error:function(error) {
 // called when there's an error
        var a = Titanium.UI.createAlertDialog({title:'Camera'});
 if (error.code == Titanium.Media.NO_CAMERA) {
            a.setMessage('Please run this test on device');
        } else {
            a.setMessage('Unexpected error: ' + error.code);
        }
        a.show();
    },
    saveToPhotoGallery:true,
 // allowEditing and mediaTypes are iOS-only settings
    allowEditing:true,
    mediaTypes:[Ti.Media.MEDIA_TYPE_VIDEO,Ti.Media.MEDIA_TYPE_PHOTO]
});
};
