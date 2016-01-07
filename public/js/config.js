// general config
var config = {
	display: {
		token: "token-display-table"
	}
};

// App config
var app = {
	// this allows for use of app.config or just config interchangeably
	config: config,
	paths:{
		history: [],
		current: "/usr/local/lib/softhsm/libsofthsm2.so"
	},

	login_method: "so",
	active_token: null,
	logged_tokens: [],
	keygen_type: "secret",
	keygen_sizes:{
		pair: [2048, 4096],
		secret: [128, 192, 256]
	}
};

