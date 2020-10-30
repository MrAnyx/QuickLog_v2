module.exports = {
	transpileDependencies: ["vuetify"],
	pluginOptions: {
		electronBuilder: {
			preload: "src/preload.js",
			win: {
				icon: "logo.ico",
				title: "QuickLog",
				msi: true
			},
			productName: "QuickLog",
		},
	},
};
