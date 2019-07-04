const electron = require("electron");
const ipc = electron.ipcRenderer;
const fct = require("./functions.js");

//login listener
const login_button = document.getElementById('login_button');
login_button.addEventListener("click", function(){
    let username = document.getElementById('username').value;
    let password = document.getElementById('psw').value;
    let auth = [username, password];
    ipc.send("auth", auth);
    ipc.once("response", function(evt, arg){ //important le once pour eviter le doublage de l'envoie a chaque fois
        document.location.href = "./passwords.html"
    })
})
