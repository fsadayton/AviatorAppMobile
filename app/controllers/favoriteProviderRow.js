var args = arguments[0] || {};

var favorites = Alloy.Collections.favorites;
var id;

if($model){
	id = $model.id;
}

/**
 * Function that creates confirm dialog for deleting a favorite service.
 * @param {Object} e
 */
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

/**
 * Function for opening provider details page for a favorite service. 
 * @param {Object} e
 */
function openProviderDetails(e){
	var favorite = favorites.get(id);
	var args = {
		orgName:favorite.get("name"),
		address: favorite.get("address"),
		description: favorite.get("description"),
		phone: favorite.get("phone_number"),
		email: favorite.get("email"),
		website: favorite.get("website")
	};
	Alloy.Globals.open('providerDetail', args);
	/*Alloy.createController('providerDetail',{
		orgName:favorite.get("name"),
		address: favorite.get("address"),
		description: favorite.get("description"),
		phone: favorite.get("phone_number"),
		email: favorite.get("email"),
		website: favorite.get("website")
	}).getView().open();*/
}