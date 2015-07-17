exports.definition = {
	config: {
		columns: {
		    "name": "text",
		    "county": "text",
		    "emergency_message": "text",
		    "profile_pic" : "text",
		    "website" : "text"
		},
		"defaults":{
			"name":"Your Name",
			"county": "Montgomery",
			"emergency_message":"Edit the emergency message sent to your trusted contacts",
			"profile_pic":Ti.Utils.base64encode(Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, "global/user256.png").read()),
			"website":"http://weather.com"
		},
		adapter: {
			type: "sql",
			collection_name: "profileBasics"
		}
	},
	extendModel: function(Model) {
		_.extend(Model.prototype, {
			// extended functions and properties go here
		});

		return Model;
	},
	extendCollection: function(Collection) {
		_.extend(Collection.prototype, {
			// extended functions and properties go here

			// For Backbone v1.1.2, uncomment the following to override the
			// fetch method to account for a breaking change in Backbone.
			/*
			fetch: function(options) {
				options = options ? _.clone(options) : {};
				options.reset = true;
				return Backbone.Collection.prototype.fetch.call(this, options);
			}
			*/
		});

		return Collection;
	}
};
