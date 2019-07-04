const electron = require("electron");
const ipc = electron.ipcRenderer;
const fct = require("./functions.js");

const register_btn = document.getElementById('register_btn');
register_btn.addEventListener("click", function(){
    let username = document.getElementById('username').value;
    let password = document.getElementById('psw').value;
    let password_conf = document.getElementById('psw_conf').value;

    let register = [username, password, password_conf];
    ipc.send("register", register);
    ipc.once("reply_register", function(evt){ //important le once pour eviter le doublage de l'envoie a chaque fois
        document.location.href = "./login.html"
    })
})
