const electron = require("electron");
const ipc = electron.ipcRenderer;
const fct = require("./functions.js");

document.addEventListener("DOMContentLoaded", function() {

    ipc.send("init");
    ipc.once("reply_init", function(evt, arg){
        document.getElementById('username').innerHTML += arg.user_connected;
        document.getElementById('nb_passwords_span').innerHTML = arg.nb_passwords;
        // ici ajouter la boucle for qui crée la liste des mdp

        fct.display_liste(arg); //also adding the event listeners


    });
});

const clipboard = document.getElementById('clipboard');
clipboard.addEventListener("click", function(){
    const el = document.createElement('input');
    el.value = "test";
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
});


// pour l'affichage du select pour les couleurs
const default_color = document.getElementById('color_default_add');
default_color.addEventListener('click', () => {
    document.getElementById('choix_color').style.display = "none";
});
const custom_color = document.getElementById('color_custom_add');
custom_color.addEventListener('click', () => {
    document.getElementById('choix_color').style.display = "inline-block";
});


//pour valider l'ajout du password
const add_password = document.getElementById('add_password');
add_password.addEventListener('click', () => {
    add_password.classList.add("disabled");
    add_password.disabled = true;
    let plateform = document.getElementById('plateform_add').value;
    let url = document.getElementById('url_add').value;
    let email = document.getElementById('email_add').value;
    let username = document.getElementById('username_add').value;
    let password = document.getElementById('password_add').value;
    let type = document.getElementById('type_add').value;
    let color = "default";
    if(document.getElementById('color_custom_add').checked){
        color = document.getElementById('custom_select_add').value.toLowerCase();
    }
    let date_creation = Date.now();
    let last_use = "";
    let nb_use = 0;
    let favoris = 0;

    let add_new_password = [plateform, url, email, username, password, type, color, date_creation, last_use, nb_use, favoris];
    ipc.send('add_new_password', add_new_password);
    ipc.once('reply_add_new_password', (evt, arg) => {
        fct.display_liste(arg);
        document.getElementById('plateform_add').value = "";
        document.getElementById('url_add').value = "";
        document.getElementById('email_add').value = "";
        document.getElementById('username_add').value = "";
        document.getElementById('password_add').value = "";
        document.getElementById('type_add').value = "";
        document.getElementById('color_default_add').checked = true;
        document.getElementById('choix_color').style.display = "none";
        $('#exampleModalScrollable').modal('hide');
        add_password.classList.remove("disabled");
        add_password.disabled = false;
    })
});

ipc.on('reply_delete_field', function(evt, arg){
    fct.display_liste(arg);
});

ipc.on('reply_favoris_field', function(evt, arg){
    fct.display_liste(arg);
});

ipc.on('reply_modify_field', function(evt, arg){
    fct.display_liste(arg);
});


const button_synchronization = document.getElementById('synchronization');
button_synchronization.addEventListener('click', () => {
    ipc.send('synchro');
});

ipc.on('reply_synchro', (evt, arg) => {
    fct.display_liste(arg);
});


const button_search_mdp = document.getElementById('button_search_mdp');
button_search_mdp.addEventListener('click', () => {
    let search_mdp = document.getElementById('search_field').value;
    console.log(search_mdp);
});
