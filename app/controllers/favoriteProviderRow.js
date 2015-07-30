var args = arguments[0] || {};

var favorites = Alloy.Collections.favorites;
var id;

if($model){
	id = $model.id;
}

function deleteFavorite(e){
	e.cancelBubble = true;
	
	Alloy.createController("alertDialog", {
		title: "Remove Favorite",
		message:"Remove " + favorites.get(id).get("name") + " from your favorites?",
		callback: function(){
			var favorite = favorites.get(id);
			favorite.destroy();
		}
	}).getView().show();
}

function openProviderDetails(e){
	Ti.API.info("event: " + JSON.stringify(e));
	var favorite = favorites.get(id);
	Alloy.createController('providerDetail',{
		orgName:favorite.get("name"),
		address: favorite.get("address"),
		description: favorite.get("description"),
		phone: favorite.get("phone_number"),
		email: favorite.get("email"),
		website: favorite.get("website")
	}).getView().open();
}