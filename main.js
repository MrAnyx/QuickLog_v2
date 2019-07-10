const { app, BrowserWindow, ipcMain, dialog } = require("electron")
const path = require('path')
const url = require('url')

// lowDB
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

//creation and selection of the right file
const dataJson = new FileSync('databases/data.json')
const authJson = new FileSync('databases/auth.json')
const data = low(dataJson)
const auth = low(authJson)

//my functions
const fct = require('./js/functions.js')

//ajouter une fonction lors la première connexion
//initialization of the json files for the first time (it doesn't affect the file once it exists)
fct.init(auth, 'auth')
fct.init(data, 'data')


app.on("ready", () => {
	let mainWindow = new BrowserWindow({
		width: 900,
		height: 600,
		resizable: false,
		center: true,
		icon: path.join(__dirname, './src/icon.png'),
		webPreferences: { nodeIntegration: true },
		show: false
	});

	mainWindow.loadURL(url.format({
		pathname: path.join(__dirname, './views/login.html'),
		protocol: 'file',
		slashes: true
	}));
	mainWindow.once("ready-to-show", () => { mainWindow.show() })


	// login listener
	ipcMain.on("auth", function(event, arg){
		let username = arg[0];
		let password = arg[1];
		let login = auth.get('users').find({ username: username, password: fct.crypt(password) }).value()
		if(login != null){
			auth.update('connected', el => username).write()
			event.reply("response", login);
		}else{
			let login_error = auth.get('users').find({ username: username }).value()
			if(login_error == null){
				dialog.showErrorBox("Authentification", "This account doesn't exists")
			}else{
				dialog.showErrorBox("Authentification", "Wrong password. Please try again")
			}
		}
	})


	//register section
	ipcMain.on("register", function(event, arg){
		let username = arg[0];
		let password = arg[1];
		let password_conf = arg[2];

		if(password != password_conf){
			dialog.showErrorBox("Registration", "The passwords don't match");
		}else if(username == ""){
			dialog.showErrorBox("Registration", "Your username is empty, please try again");
		}else if(password == "" || password_conf == ""){
			dialog.showErrorBox("Registration", "Your password is empty, please try again");
		}else{
			let id = auth.get('count').value()+1;
			auth.get('users').push({ id: id, username: username, password: fct.crypt(password)}).write()
			auth.update('count', n => n+1).write();
			event.reply("reply_register");
		}
	})

	//main pages (display username en bas a droite, recupération de tous les mdp)
	ipcMain.on("init", function(event){
		let variables_init = {
			user_connected: auth.get('connected').value(),
			liste_mdp: data.get('passwords').value(),
			nb_passwords: data.get('count').value()
		}
		event.reply("reply_init", variables_init);
	})

	ipcMain.on('add_new_password', function(event, arg){
		let plateform = arg[0];
		let url = arg[1];
		let email = arg[2];
		let username = arg[3];
		let password = arg[4];
		let type = arg[5];
		let color = arg[6];
		let date_creation = arg[7];
		let last_use = arg[8];
		let nb_use = arg[9];
		let favoris = arg[10];

		let id = data.get('count').value()+1;
		data.get('passwords').push({
			id: id,
			plateform: plateform,
			url: url,
			email: email,
			username: username,
			password: fct.crypt(password),
			type: type,
			color: color,
			date_creation: date_creation,
			last_use: last_use,
			nb_use: nb_use,
			favoris: favoris
		}).write()

		data.update('count', n => n+1).write();
		let refresh_mdp = {
			liste_mdp : data.get('passwords').value(),
			nb_passwords: data.get('count').value()
		}
		event.reply('reply_add_new_password', refresh_mdp);
	})

	ipcMain.on('delete_field', function(evt, arg){
		data.get('passwords').remove({ id: arg }).write();
		data.update('count', n => n-1).write();
		let refresh_mdp = {
			liste_mdp : data.get('passwords').value(),
			nb_passwords: data.get('count').value()
		}
		evt.reply('reply_delete_field', refresh_mdp);
	})

	ipcMain.on('favoris_field', function(evt, arg){
		let tmp_favoris = data.get('passwords').find({ id: arg }).value().favoris;
		if(tmp_favoris == 0){
			data.get('passwords').find({ id: arg }).assign({ favoris: 1}).write();
		}else{
			data.get('passwords').find({ id: arg }).assign({ favoris: 0}).write();
		}

		let refresh_mdp = {
			liste_mdp : data.get('passwords').value(),
			nb_passwords: data.get('count').value()
		}

		evt.reply('reply_favoris_field', refresh_mdp);
	})



	ipcMain.on('modify_field', function(evt, arg){

		let refresh_mdp = {
			liste_mdp : data.get('passwords').value(),
			nb_passwords: data.get('count').value()
		}
		evt.reply('reply_modify_field', refresh_mdp);
	})




});

app.on("window-all-closed", () => {
	auth.update('connected', el => "").write()
	app.quit()
});
