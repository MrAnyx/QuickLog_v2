"use strict";

import { app, protocol, BrowserWindow, ipcMain } from "electron";
import { isBuffer } from "util";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
// import installExtension, { VUEJS_DEVTOOLS } from "electron-devtools-installer";

const CryptoJS = require("crypto-js");
const os = require("os");
const isDevelopment = process.env.NODE_ENV !== "production";
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const Store = require("electron-store");
const bcrypt = require("bcrypt");

const store = new Store();

var Datastore = require("nedb");

fs.mkdir(path.join(os.tmpdir(), "quicklog", "storage"), { recursive: true }, (err) => {
	if (err) {
		return console.error(err);
	}
});

// sqs pour Secure QuickLog Storage
var data = new Datastore({ filename: path.join(os.tmpdir(), "quicklog", "storage", "data.sqs"), autoload: true });
var auth = new Datastore({ filename: path.join(os.tmpdir(), "quicklog", "storage", "auth.sqs"), autoload: true });
var options = new Datastore({ filename: path.join(os.tmpdir(), "quicklog", "storage", "options.sqs"), autoload: true });

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.

let win;

protocol.registerSchemesAsPrivileged([{ scheme: "app", privileges: { secure: true, standard: true } }]);

function createWindow() {
	win = new BrowserWindow({
		center: true,
		width: 1200,
		height: 800,
		minHeight: 600,
		minWidth: 1000,
		show: false,
		webPreferences: {
			nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
			preload: path.join(__dirname, "preload.js"),
		},
		icon: path.join(__static, "icon.png"),
	});

	// win.setMenu(null)

	if (process.env.WEBPACK_DEV_SERVER_URL) {
		// Load the url of the dev server if in development mode
		win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
		// if (!process.env.IS_TEST) win.webContents.openDevTools()
	} else {
		createProtocol("app");
		// Load the index.html when not in development
		win.loadURL("app://./index.html");
	}
	win.on("ready-to-show", () => {
		win.show();
	});

	win.on("closed", () => {
		win = null;
	});
}

// Quit when all windows are closed.
app.on("window-all-closed", () => {
	// On macOS it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q
	if (process.platform !== "darwin") {
		app.quit();
		store.clear();
	}
});

app.on("activate", () => {
	// On macOS it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (win === null) {
		createWindow();
	}
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", async () => {
	// if (isDevelopment && !process.env.IS_TEST) {
	// 	// Install Vue Devtools
	// 	try {
	// 		await installExtension(VUEJS_DEVTOOLS);
	// 	} catch (e) {
	// 		console.error("Vue Devtools failed to install:", e.toString());
	// 	}
	// }
	createWindow();
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
	if (process.platform === "win32") {
		process.on("message", (data) => {
			if (data === "graceful-exit") {
				app.quit();
				store.clear();
			}
		});
	} else {
		process.on("SIGTERM", () => {
			app.quit();
			store.clear();
		});
	}
}

// ? Registration event
ipcMain.on("POST_REGISTER", (event, arg) => {
	auth.find({ username: arg.username }, function(err, docs) {
		if (err) {
			event.reply("POST_REGISTER_REPLY", {
				status: "error",
				message: "An error occured during the registration",
			});
		} else {
			if (docs.length >= 1) {
				event.reply("POST_REGISTER_REPLY", {
					status: "error",
					message: "This username already exists",
				});
			} else {
				let salt = bcrypt.genSaltSync(10);
				let user = {
					_id: uuidv4(),
					username: arg.username,
					password: bcrypt.hashSync(arg.password, salt),
					salt: salt,
				};
				auth.insert(user, function(err, newDoc) {
					if (err) {
						event.reply("POST_REGISTER_REPLY", {
							status: "error",
							message: "An error occured during the registration",
						});
					} else {
						options.insert(
							{
								user: arg.username,
								uuid: newDoc._id,
								options: {
									passwords: {
										length: 25, // default length
										upper: true,
										lower: true,
										special: true,
										numeric: true,
									},
								},
							},
							function(err, newDoc) {
								if (err) {
									event.reply("POST_REGISTER_REPLY", {
										status: "error",
										message: "An error occured during the registration",
									});
								} else {
									event.reply("POST_REGISTER_REPLY", {
										status: "success",
										message: "You account has been created successfully. You will be automatically redirected to the login page",
									});
								}
							}
						);
					}
				});
			}
		}
	});
});

// ? Login event
ipcMain.on("POST_LOGIN", (event, arg) => {
	auth.find({ username: arg.username }, function(err, docs) {
		if (err) {
			event.reply("POST_LOGIN_REPLY", {
				status: "error",
				message: "An error occured during the login",
			});
		} else {
			if (docs.length === 0) {
				event.reply("POST_LOGIN_REPLY", {
					status: "error",
					message: "This account doesn't exist",
				});
			} else {
				let userDB = docs[0];
				let passwordIsCorrect = bcrypt.compareSync(arg.password, userDB.password);
				if (passwordIsCorrect) {
					store.set("username", userDB.username);
					store.set("uuid", userDB._id);
					store.set("session", uuidv4());

					options.find({ uuid: userDB._id }, function(err, docs) {
						let option = docs[0];
						store.set("options", option.options);
					});

					let vaultKey = CryptoJS.PBKDF2(`${userDB.username}${arg.password}`, userDB.salt, { keySize: 8, iterations: 100000 }).toString();
					store.set("vaultKey", vaultKey);
					event.reply("POST_LOGIN_REPLY", {
						status: "success",
						message: "Successfully logged in. We will automatically redirect you to your vault",
					});
				} else {
					event.reply("POST_LOGIN_REPLY", {
						status: "error",
						message: "Wrong credentials. Try again",
					});
				}
			}
		}
	});
});

// ? Get data
ipcMain.on("GET_TABLE", (event, arg) => {
	data.find({ owner: { uuid: store.get("uuid"), username: store.get("username") } }, function(err, docs) {
		event.reply("GET_TABLE_REPLY", docs);
	});
});

// ? return true if the user is connected and false if not
ipcMain.on("IS_USER_CONNECTED", (event, arg) => {
	if (store.get("session") === undefined) {
		event.reply("IS_USER_CONNECTED_REPLY", {
			isConnected: false,
		});
	} else {
		event.reply("IS_USER_CONNECTED_REPLY", {
			isConnected: true,
		});
	}
});


// ? New account
ipcMain.on("POST_NEW_ACCOUNT", (event, arg) => {
	data.find({ uuid: CryptoJS.SHA3(`${arg.plateform}${arg.username}${arg.email}${arg.password}${store.get("uuid")}${store.get("username")}}`).toString() }, function(err, docs) {
		if (err) {
			event.reply("POST_NEW_ACCOUNT_REPLY", {
				status: "error",
				message: `An error occured, please try again`,
			});
		} else {
			if (docs.length === 0) {
				let account = {
					_id: uuidv4(),
					plateform: arg.plateform,
					username: arg.username,
					email: arg.email,
					password: CryptoJS.AES.encrypt(arg.password, store.get("vaultKey")).toString(),
					categories: arg.category,
					custom: arg.custom,
					uuid: CryptoJS.SHA3(`${arg.plateform}${arg.username}${arg.email}${arg.password}${store.get("uuid")}${store.get("username")}}`).toString(),
					owner: {
						uuid: store.get("uuid"),
						username: store.get("username"),
					},
				};
				data.insert(account, function(err, newDoc) {
					if (err) {
						event.reply("POST_NEW_ACCOUNT_REPLY", {
							status: "error",
							message: `An error occured, please try again`,
						});
					} else {
						event.reply("POST_NEW_ACCOUNT_REPLY", {
							status: "success",
							message: `${newDoc.plateform} account has been added successfully`,
						});
					}
				});
			} else {
				event.reply("POST_NEW_ACCOUNT_REPLY", {
					status: "error",
					message: `This account already exists`,
				});
			}
		}
	});
});

// ? Delete an account
ipcMain.on("DELETE_ACCOUNT", (event, arg) => {
	data.remove({ _id: arg.id }, {}, function(err, numRemoved) {
		if (err) {
			event.reply("DELETE_ACCOUNT_REPLY", {
				status: "error",
				message: "An error occured, please try again",
			});
		} else {
			event.reply("DELETE_ACCOUNT_REPLY", {
				status: "success",
				message: `${arg.plateform} has been deleted successfully`,
			});
		}
	});
});

// ? Get one account
ipcMain.on("GET_ACCOUNT", (event, id) => {
	data.find({ _id: id }, {}, function(err, docs) {
		if (err) {
			event.reply("GET_ACCOUNT_REPLY", {
				status: "error",
				message: "An error occured, please try again",
				password: "",
			});
		} else {
			event.reply("GET_ACCOUNT_REPLY", {
				status: "success",
				message: "OK",
				password: CryptoJS.AES.decrypt(docs[0].password, store.get("vaultKey")),
			});
		}
	});
});

ipcMain.on("POST_EDIT_ACCOUNT", (event, arg) => {
	data.update(
		{ _id: arg._id },
		{
			$set: {
				plateform: arg.plateform,
				username: arg.username,
				email: arg.email,
				password: CryptoJS.AES.encrypt(arg.password, store.get("vaultKey")).toString(),
				categories: arg.category,
				custom: arg.custom,
				uuid: CryptoJS.SHA3(`${arg.plateform}${arg.username}${arg.email}${arg.password}${store.get("uuid")}${store.get("username")}}`).toString(),
			},
		},
		{},
		function(err, numReplaced) {
			if (err) {
				event.reply("POST_EDIT_ACCOUNT_REPLY", {
					status: "error",
					message: "An error occured, please try again",
				});
			} else {
				event.reply("POST_EDIT_ACCOUNT_REPLY", {
					status: "success",
					message: `${arg.plateform} account updated successfully`,
				});
			}
		}
	);
});

ipcMain.on("GET_OPTIONS", (event, arg) => {
	event.reply("GET_OPTIONS_REPLY", store.get("options"));
});

ipcMain.on("IS_CONNECTED", (event, arg) => {
	event.reply("IS_CONNECTED_REPLY", store.get("session") === undefined ? false : true);
});

ipcMain.on("LOGOUT", (event, arg) => {
	try {
		store.clear();
	} catch (e) {
		event.reply("LOGOUT_REPLY", {
			status: "error",
			message: "An error occured during your disconnection",
		});
	}
	event.reply("LOGOUT_REPLY", {
		status: "success",
		message: "OK",
	});
});

ipcMain.on("IS_CONNECTED", (event, arg) => {
	event.reply("IS_CONNECTED_REPLY", store.get("session") === undefined ? false : true);
});

ipcMain.on("POST_CHANGES", (event, arg) => {
	options.update(
		{ uuid: store.get("uuid") },
		{
			$set: {
				options: {
					passwords: {
						length: arg["length"],
						upper: arg.cases.includes("upper"),
						lower: arg.cases.includes("lower"),
						special: arg.special,
						numeric: arg.cases.includes("numeric"),
					},
				},
			},
		},
		{},
		function(err, numReplaced) {
			if (err) {
				event.reply("POST_CHANGES_REPLY", {
					status: "error",
					message: "An error occured, please try again",
				});
			} else {
				options.find({ uuid: store.get("uuid") }, function(err, docs) {
					if (err) {
						event.reply("POST_CHANGES_REPLY", {
							status: "error",
							message: "An error occured, please try again",
						});
					} else {
						store.set("options", docs[0].options);
						event.reply("POST_CHANGES_REPLY", {
							status: "success",
							message: `Changes updated`,
						});
					}
				});
			}
		}
	);
});

ipcMain.on("GET_PASSWORD", (event, arg) => {
	data.find({ _id: arg }, function(err, docs) {
		if (err) {
			event.reply("GET_PASSWORD_REPLY", {
				status: "error",
				message: "An error occured, please try again",
			});
		} else {
			let bytes = CryptoJS.AES.decrypt(docs[0].password, store.get("vaultKey"));
			let password = bytes.toString(CryptoJS.enc.Utf8);
			event.reply("GET_PASSWORD_REPLY", {
				status: "success",
				message: password
			});
		}
	});
});
