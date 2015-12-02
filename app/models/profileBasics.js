exports.definition = {
	config: {
		columns: {
		    "name": "text",
		    "countyName": "text",
		    "countyId":"text",
		    "emergency_message": "text",
		    "profile_pic" : "text",
		    "website" : "text"
		},
		"defaults":{
			"name":"Your Name",
			"countyName": "Montgomery",
			"countyId":"57",
			"emergency_message":"I need your help. Please contact me ASAP.",
			"profile_pic":"/global/user256.png",
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
