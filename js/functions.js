// AES
const aesjs = require('aes-js')
const electron = require("electron");
const ipc = electron.ipcRenderer;


module.exports = {

    init: function(db, type){
        switch(type){
            case 'auth':
            db.defaults({ users: [], count: 0, connected: ""}).write()
            break;
            case 'data':
            db.defaults({ passwords: [], count: 0}).write()
            break;
        }
    },

    crypt: function(string){
        var key = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16 ];
        var text = string;
        var textBytes = aesjs.utils.utf8.toBytes(text);
        var aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5));
        var encryptedBytes = aesCtr.encrypt(textBytes);
        var encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes);
        return encryptedHex;
    },

    decrypt: function(string){
        var key = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16 ];
        var encryptedBytes = aesjs.utils.hex.toBytes(string);
        var aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5));
        var decryptedBytes = aesCtr.decrypt(encryptedBytes);
        var decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes);
        return decryptedText;
    },


    display_liste: function(arg){

        // const nb_tr = document.getElementsByClassName('liste_full_passwords_tr').length;
        // for(let i = 0; i<nb_tr; i++){
        //     document.getElementsByClassName('liste_full_passwords_tr')[i].remove();
        // }

        for(let i = 0; i<arg.length; i++){


            let tr = document.createElement('tr');
            tr.setAttribute('class','liste_full_passwords_tr');
            let tabBody = document.getElementById('liste_full_passwords');


            //premier td
            let td1 = document.createElement('td');
            let span1 = document.createElement('span');
            span1.setAttribute('class', 'uk-badge bg-secondary mr-3');
            let i1 = document.createElement('i');
            i1.setAttribute('class', 'fab fa-amazon');
            let plateform1 = document.createTextNode(arg[i].plateform);
            span1.appendChild(i1);
            td1.appendChild(span1);
            td1.appendChild(plateform1);
            tr.appendChild(td1);

            // deuxieme td
            let td2 = document.createElement('td');
            let appli = document.createTextNode(arg[i].type);
            td2.appendChild(appli);
            tr.appendChild(td2);



            //quatrieme td
            let td4 = document.createElement('td');
            td4.setAttribute('class', 'text-center');
            let div_option = document.createElement('div');
            div_option.setAttribute('class', 'btn-group ml-1');

            let button1 = document.createElement('button');
            button1.setAttribute('class', 'btn btn-default button-delete');
            button1.setAttribute('uk-tooltip', 'title: Delete; pos: bottom');
            button1.setAttribute('id-database', arg[i].id);
            let span_button1 = document.createElement('span');
            span_button1.setAttribute('class', 'icon icon-cancel text-danger');
            button1.appendChild(span_button1);

            let button2 = document.createElement('button');
            button2.setAttribute('class', 'btn btn-default button-favoris');
            button2.setAttribute('uk-tooltip', 'title: Favorite; pos: bottom');
            button2.setAttribute('id-database', arg[i].id);
            let span_button2 = document.createElement('span');
            if(arg[i].favoris == 0){
                span_button2.setAttribute('class', 'icon icon-heart text-dark');
            }else{
                span_button2.setAttribute('class', 'icon icon-heart text-danger');
            }
            button2.appendChild(span_button2);

            let button3 = document.createElement('button');
            button3.setAttribute('class', 'btn btn-default button-modify');
            button3.setAttribute('uk-tooltip', 'title: Modify; pos: bottom');
            button3.setAttribute('id-database', arg[i].id);
            let span_button3 = document.createElement('span');
            span_button3.setAttribute('class', 'icon icon-cog text-dark');
            button3.appendChild(span_button3);

            div_option.appendChild(button1);
            div_option.appendChild(button2);
            div_option.appendChild(button3);

            td4.appendChild(div_option);
            tr.appendChild(td4);

            tabBody.appendChild(tr);


            let buttons_delete = document.getElementsByClassName("button-delete");
            for(let i = 0; i<buttons_delete.length; i++){
                buttons_delete[i].addEventListener('click', function(){
                    ipc.send('delete_field', parseInt(buttons_delete[i].getAttribute('id-database')));
                    ipc.once('reply_delete_field', function(evt, arg){
                        console.log(arg);
                    })
                });
            }

            let buttons_favoris = document.getElementsByClassName("button-favoris");
            for(let i = 0; i<buttons_favoris.length; i++){
                buttons_favoris[i].addEventListener('click', function(){
                    ipc.send('favoris_field', parseInt(buttons_favoris[i].getAttribute('id-database')));
                    ipc.once('reply_favoris_field', function(evt, arg){
                        console.table(arg);
                    })
                });
            }

            let buttons_modify = document.getElementsByClassName("button-modify");
            for(let i = 0; i<buttons_modify.length; i++){
                buttons_modify[i].addEventListener('click', function(){
                    ipc.send('modify_field', parseInt(buttons_modify[i].getAttribute('id-database')));
                    ipc.once('reply_modify_field', function(evt, arg){
                        console.table(arg);
                    })
                });
            }
        }
    }









};
