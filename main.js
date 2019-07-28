const { app, BrowserWindow, ipcMain, dialog } = require("electron")
const path = require('path')
const url = require('url')
const sha256 = require('sha256')


// lowDB
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

//creation and selection of the right file
const dataJson = new FileSync('databases/data.json')
const authJson = new FileSync('databases/auth.json')
const brandsJson = new FileSync('databases/brands.json')
const optionsJson = new FileSync('databases/options.json')

const data = low(dataJson)
const auth = low(authJson)
const brands = low(brandsJson)
const options = low(optionsJson)

//my functions
const fct = require('./js/functions.js')

//ajouter une fonction lors la première connexion
//initialization of the json files for the first time (it doesn't affect the file once it exists)
fct.init(auth, 'auth')
fct.init(data, 'data')
fct.init(options, 'options')


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
});


// login listener
ipcMain.on("auth", function(event, arg){
	let username = arg[0];
	let password = arg[1];
	let login = auth.get('users').find({ username: username, password: sha256(password) }).value()
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
		auth.get('users').push({ id: fct.uniqid(), username: username, password: sha256(password)}).write()
		auth.update('count', n => n+1).write();
		event.reply("reply_register");
	}
})

//main pages (display username en bas a droite, recupération de tous les mdp, le nombre de mdp en bas a gauche)
ipcMain.on("init", function(event){
	let variables_init = {
		user_connected: auth.get('connected').value(),
		liste_mdp: data.get('passwords').value(),
		nb_passwords: data.get('count').value()
	}
	event.reply("reply_init", variables_init);
})


// ajout d'un nouveau mdp
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

	let tmp = brands.get('brands').find({name: plateform.toLowerCase()}).value();
	let icon;
	if(tmp == null){
		icon = "";
	}else{
		icon = tmp.icon;

	}

	let id = fct.uniqid();
	data.get('passwords').push({
		id: id,
		plateform: plateform,
		url: url,
		email: email,
		username: username,
		password: fct.crypt(password),
		icon: icon,
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
	let search = options.get('search').value()
	let liste_delete_pass = []
	if(search != ""){
		let delete_pass = data.get('passwords').value()

		for(let i = 0; i<delete_pass.length; i++){
			if(delete_pass[i].plateform.toUpperCase().includes(search.toUpperCase())){
				liste_delete_pass.push(delete_pass[i]);
			}
		}
	}else{
		liste_delete_pass = data.get('passwords').value()
	}

	let refresh_mdp = {
		liste_mdp : liste_delete_pass,
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
	let search = options.get('search').value()
	let liste_favoris_pass = []
	if(search != ""){
		let favoris_pass = data.get('passwords').value()

		for(let i = 0; i<favoris_pass.length; i++){
			if(favoris_pass[i].plateform.toUpperCase().includes(search.toUpperCase())){
				liste_favoris_pass.push(favoris_pass[i]);
			}
		}
	}else{
		liste_favoris_pass = data.get('passwords').value()
	}

	let refresh_mdp = {
		liste_mdp : liste_favoris_pass,
		nb_passwords: data.get('count').value()
	}

	evt.reply('reply_favoris_field', refresh_mdp);
})



ipcMain.on('modify_field', function(evt, arg){
	let get_mdp = data.get('passwords').find({ id: arg }).value();
	evt.reply('reply_modify_field', get_mdp);
});
ipcMain.on("update_password", (evt, arg) => {
	let tmp_icon = brands.get('brands').find({ name: arg.plateform.toLowerCase() }).value();
	let icon;
	if(tmp_icon == null){
		icon = "";
	}else{
		icon = tmp_icon.icon;
	}
	data.get('passwords').find({ id: arg.id }).assign({
		plateform: arg.plateform,
		url: arg.url,
		email: arg.email,
		username: arg.username,
		password: arg.password,
		type: arg.type,
		icon: icon,
		color: arg.color.toLowerCase()
	}).write();
	let search = options.get('search').value();
	let liste_modify_pass = [];
	if(search != ""){
		let modify_pass = data.get('passwords').value();
		for(let i = 0; i<modify_pass.length; i++){
			if(modify_pass[i].plateform.toUpperCase().includes(search.toUpperCase())){
				liste_modify_pass.push(modify_pass[i]);
			}
		}
	}else{
		liste_modify_pass = data.get('passwords').value()

	}

	let refresh_mdp = {
		liste_mdp : liste_modify_pass,
		nb_passwords: data.get('count').value()
	}

	evt.reply("reply_update_password", refresh_mdp);
});

ipcMain.on('synchro', (evt) => {
	options.update("search", n => "").write()
	let refresh_mdp = {
		liste_mdp : data.get('passwords').value(),
		nb_passwords: data.get('count').value()
	}
	evt.reply('reply_synchro', refresh_mdp);

})

ipcMain.on('search_mdp', (evt, arg) => {
	let liste_mdp = [];
	let tmp = data.get('passwords').value();
	if(arg == ""){
		options.update('search', n => '').write();
	}else{
		options.update('search', n => arg).write();
	}
	for(let i = 0; i<tmp.length; i++){
		if(tmp[i].plateform.toUpperCase().includes(arg.toUpperCase())){
			liste_mdp.push(tmp[i]);
		}
	}
	let search_mdp = {
		liste_mdp: liste_mdp,
		nb_passwords: data.get('count').value()
	}
	evt.reply('reply_search_mdp', search_mdp);
})

//
// ipcMain.on('select_color_default', (evt, arg) => {
// 	options.update("select", n => "default").write()
// 	let liste = [];
// 	let tmp = data.get('passwords').value();
// 	for(let i = 0; i<tmp.length; i++){
// 		if(tmp[i].color == "default"){
// 			liste.push(tmp[i]);
// 		}
// 	}
// 	let refresh_mdp = {
// 		liste_mdp: liste,
// 		nb_passwords: data.get('count').value()
// 	}
// 	evt.reply("reply_select_color_default", refresh_mdp);
// })
//
// ipcMain.on('select_color_red', (evt, arg) => {
// 	options.update("select", n => "red").write()
// 	let liste = [];
// 	let tmp = data.get('passwords').value();
// 	for(let i = 0; i<tmp.length; i++){
// 		if(tmp[i].color == "red"){
// 			liste.push(tmp[i]);
// 		}
// 	}
// 	let refresh_mdp = {
// 		liste_mdp: liste,
// 		nb_passwords: data.get('count').value()
// 	}
// 	evt.reply("reply_select_color_red", refresh_mdp);
// })
//
// ipcMain.on('select_color_green', (evt, arg) => {
// 	options.update("select", n => "green").write()
// 	let liste = [];
// 	let tmp = data.get('passwords').value();
// 	for(let i = 0; i<tmp.length; i++){
// 		if(tmp[i].color == "green"){
// 			liste.push(tmp[i]);
// 		}
// 	}
// 	let refresh_mdp = {
// 		liste_mdp: liste,
// 		nb_passwords: data.get('count').value()
// 	}
// 	evt.reply("reply_select_color_green", refresh_mdp);
// })
//
// ipcMain.on('select_color_blue', (evt, arg) => {
// 	options.update("select", n => "blue").write()
// 	let liste = [];
// 	let tmp = data.get('passwords').value();
// 	for(let i = 0; i<tmp.length; i++){
// 		if(tmp[i].color == "blue"){
// 			liste.push(tmp[i]);
// 		}
// 	}
// 	let refresh_mdp = {
// 		liste_mdp: liste,
// 		nb_passwords: data.get('count').value()
// 	}
// 	evt.reply("reply_select_color_blue", refresh_mdp);
// })




ipcMain.on("export_csv", (evt) => {
	let passwords = data.get('passwords').value();
	evt.reply("reply_export_csv", passwords);
})

ipcMain.on("import_mdp", (evt, arg) => {
	data.set('passwords', []).write();
	data.set('count', arg.length).write();
	let tmp;
	for(let i = 0; i<arg.length; i++){
		tmp = arg[i].split(",");
		data.get('passwords').push({
			id: parseInt(tmp[0]),
			plateform: tmp[1],
			url: tmp[2],
			email: tmp[3],
			username: tmp[4],
			password: tmp[5],
			icon: tmp[6],
			type: tmp[7],
			color: tmp[8],
			date_creation: parseInt(tmp[9]),
			last_use: parseInt(tmp[10]),
			nb_use: parseInt(tmp[11]),
			favoris: parseInt(tmp[12])
		}).write()
	}

	let import_mdp = {
		liste_mdp: data.get('passwords').value(),
		nb_passwords: data.get('count').value()
	}
	evt.reply("reply_import_mdp", import_mdp)
})

ipcMain.on("select_mdp", (evt, arg) => {
	let selected_mdp = data.get('passwords').find({ id: arg }).value()
	evt.reply("reply_select_mdp", selected_mdp)
})



app.on("window-all-closed", () => {
	auth.update('connected', el => "").write()
	options.update('search', n => "").write()
	app.quit()
});
