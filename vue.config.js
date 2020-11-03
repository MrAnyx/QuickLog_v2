module.exports = {
	transpileDependencies: ["vuetify"],
	pluginOptions: {
		electronBuilder: {
			preload: "src/preload.js",
			builderOptions: {
				win: {
					icon: "logo.ico",
					signingHashAlgorithms: ['sha256'],
					target: "nsis"
				},
				nsis: {
					oneClick: false,
					allowToChangeInstallationDirectory: true,
					installerIcon: "logo.ico",
					createDesktopShortcut: true,
					createStartMenuShortcut: true,
				},
				productName: "QuickLog",
				copyright: "Copyright © 2020 by MrAnyx"
			},
		},
	},
};
