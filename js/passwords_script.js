const electron = require("electron");
const ipc = electron.ipcRenderer;
const fct = require("./functions.js");
const fs = require('fs');
const {dialog} = require('electron').remote;

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


    document.getElementById('loading_add').style.display = "inline-block";

    const input_form_modal = document.querySelectorAll(".input-form-modal");
    input_form_modal.forEach(function(el){
        el.classList.remove("is-invalid")
    })

    document.getElementById('button_generate').classList.add("btn-secondary")
    document.getElementById('button_generate').classList.remove("btn-danger")

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
    let last_use = Date.now();
    let nb_use = 0;
    let favoris = 0;

    liste_invalid = []

    // vérification des champs entrés
    if(plateform == ""){
        liste_invalid.push("plateform_add")
    }if(url == ""){
        liste_invalid.push("url_add")
    }if(email == ""){
        liste_invalid.push("email_add")
    }if(username == ""){
        liste_invalid.push("username_add")
    }if(password == ""){
        liste_invalid.push("password_add")
        document.getElementById('button_generate').classList.remove("btn-secondary")
        document.getElementById('button_generate').classList.add("btn-danger")

    }if(type == ""){
        liste_invalid.push("type_add")
    }

    if(liste_invalid.length != 0){
        liste_invalid.forEach(function(item){
            document.getElementById(item).classList.add("is-invalid")
        });
        add_password.classList.remove("disabled");
        add_password.disabled = false;
        document.getElementById('loading_add').style.display = "none";

    }else{

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
            document.getElementById('loading_add').style.display = "none";

        })
    }
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
    document.getElementById('search_field').value = "";
    fct.display_liste(arg);
});

// button search
const button_search_mdp = document.getElementById('button_search_mdp');
button_search_mdp.addEventListener('click', () => {
    let search_mdp = document.getElementById('search_field').value;
    ipc.send('search_mdp', search_mdp);
    ipc.on('reply_search_mdp', (evt, arg) => {
        fct.display_liste(arg);
        //console.log(arg);
    })
});

//event listener pour détécter la touche entrée lors de la recherche
const searchField = document.getElementById('search_field');
searchField.addEventListener('keyup', (event) => {
    if (event.keyCode == 13) {
        event.preventDefault();
        document.getElementById("button_search_mdp").click();
    }
});





// event listener pour la selection de la couleur pour afficher uniquement la couleur qu'on veut
const select_color_default = document.getElementById('select_color_default');
select_color_default.addEventListener('click', () => {
    ipc.send('select_color_default');
    ipc.on('reply_select_color_default', (evt, arg) => {
        fct.display_liste(arg);
    });
});


const select_color_red = document.getElementById('select_color_red');
select_color_red.addEventListener('click', () => {
    ipc.send('select_color_red');
    ipc.on('reply_select_color_red', (evt, arg) => {
        fct.display_liste(arg);
    });
});


const select_color_green = document.getElementById('select_color_green');
select_color_green.addEventListener('click', () => {
    ipc.send('select_color_green');
    ipc.on('reply_select_color_green', (evt, arg) => {
        fct.display_liste(arg);
    });
});


const select_color_blue = document.getElementById('select_color_blue');
select_color_blue.addEventListener('click', () => {
    ipc.send('select_color_blue');
    ipc.on('reply_select_color_blue', (evt, arg) => {
        fct.display_liste(arg);
    });
});




// event lors de l'export
const button_export = document.getElementById('button_export');
button_export.addEventListener('click', () => {
    ipc.send("export_csv");
    ipc.once("reply_export_csv", (evt, arg) => {

        let content = "id,plateform,url,email,username,password,icon,type,color,date_creation,last_use,nb_use,favoris\n";
        for(let i = 0; i<arg.length; i++){
            content+=`${arg[i].id},${arg[i].plateform},${arg[i].url},${arg[i].email},${arg[i].username},${arg[i].password},${arg[i].icon},${arg[i].type},${arg[i].color},${arg[i].date_creation},${arg[i].last_use},${arg[i].nb_use},${arg[i].favoris}\n`;
        }

        let option1 = {filters: [{ name: 'Fichier QuickLog', extensions: ['csvql'] }]}


        dialog.showSaveDialog(option1, (filename) => {
            if(filename === undefined){
                console.log("The user clicked the button but didn't create a file");
                return;
            }

            fs.writeFile(filename, content, (err) => {
                if (err){
                    console.log("An error occured with the creation of the file "+err.message);
                    return
                }
                let options2 = {
                    type: 'info',
                    buttons: ['Close'],
                    title: 'File saved',
                    message: 'The file has been saved successfully'
                };

                dialog.showMessageBox(options2);
            })
        })

    });


});

// event lors de l'import
const button_import = document.getElementById('button_import');
button_import.addEventListener('click', () => {
    let options = {

        properties: ['openFile'],
        filters: [{ name: 'Fichier QuickLog', extensions: ['csvql'] }]

    }
    dialog.showOpenDialog(options, function (file) {
        if (file !== undefined) {


            fs.readFile(file.toString(), 'utf8', function(err, contents) {
                liste = contents.split('\n');
                liste.pop();
                liste.shift();

                ipc.send("import_mdp", liste);
                ipc.once("reply_import_mdp", (evt, arg) => {
                    fct.display_liste(arg);
                    let options3 = {
                        type: 'info',
                        buttons: ['Close'],
                        title: 'File imported',
                        message: 'The file has been imported successfully'
                    };

                    dialog.showMessageBox(options3);

                })

            });
        }
    });
});

// button generate pour le mdp
const button_generate = document.getElementById('button_generate');
button_generate.addEventListener('click', () => {
    let generate_password = Math.random().toString(36).substring(2, 15);
    document.getElementById('password_add').value = generate_password;
    document.getElementById('password_add').type = "text"
    document.getElementById("password_add").select()
    document.execCommand('copy');
    document.getElementById('password_add').type = "password"
});


// detect when the modal is closed to reset the form
$('#exampleModalScrollable').on('hide.bs.modal', function (e) {
    document.getElementById('plateform_add').value = "";
    document.getElementById('url_add').value = "";
    document.getElementById('email_add').value = "";
    document.getElementById('username_add').value = "";
    document.getElementById('password_add').value = "";
    document.getElementById('type_add').value = "";
    document.getElementById('color_default_add').checked = true;
    document.getElementById('choix_color').style.display = "none";

    const input_form_modal = document.querySelectorAll(".input-form-modal");
    input_form_modal.forEach(function(el){
        el.classList.remove("is-invalid")
    })

    document.getElementById('button_generate').classList.add("btn-secondary")
    document.getElementById('button_generate').classList.remove("btn-danger")
})
