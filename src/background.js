"use strict";

import { app, protocol, BrowserWindow, ipcMain } from "electron";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
// import installExtension, { VUEJS_DEVTOOLS } from "electron-devtools-installer";
const isDevelopment = process.env.NODE_ENV !== "production";
const path = require("path");
const { v4: uuidv4 } = require('uuid');

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
			preload: path.join(__dirname, "preload.js"), // Ne marche qu'en développement, en prod, le lien n'est pas bon
		},
		icon: path.join(__static, 'icon.png')
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
			}
		});
	} else {
		process.on("SIGTERM", () => {
			app.quit();
		});
	}
}

ipcMain.on("ready", (event, arg) => {
	event.reply("ready-reply", "bonjour from main process");
});

ipcMain.on("GET_TABLE", (event, arg) => {
	event.reply("GET_TABLE_REPLY", [
		{
			uuid: uuidv4(),
			name: "Frozen Yogurt",
			calories: 159,
		},
		{
			uuid: uuidv4(),
			name: "Ice cream sandwich",
			calories: 237,
		},
		{
			uuid: uuidv4(),
			name: "Eclair",
			calories: 262,
		},
		{
			uuid: uuidv4(),
			name: "Cupcake",
			calories: 305,
		},
		{
			uuid: uuidv4(),
			name: "Gingerbread",
			calories: 356,
		},
		{
			uuid: uuidv4(),
			name: "Jelly bean",
			calories: 375,
		},
		{
			uuid: uuidv4(),
			uuid: uuidv4(),
			name: "Lollipop",
			calories: 392,
		},
		{
			uuid: uuidv4(),
			name: "Honeycomb",
			calories: 408,
		},
		{
			uuid: uuidv4(),
			name: "Donut",
			calories: 452,
		},
		{
			uuid: uuidv4(),
			name: "KitKat",
			calories: 518,
		},
		{
			uuid: uuidv4(),
			name: "KitKat",
			calories: 518,
		},
		{
			uuid: uuidv4(),
			name: "KitKat",
			calories: 518,
		},
		{
			uuid: uuidv4(),
			name: "KitKat",
			calories: 518,
		}]
	);
});
