var connect = require("../my_modules/connectDB");
var session = require('express-session');
var express = require('express');
var mysql = require("mysql");
var bodyParser = require("body-parser");
var md5 = require("md5");

var dataUser = require("../my_modules/login.js");

global.counterOnline = 0;
global.userOnline = new Array(); //array utenti loggati nelle stanze

function socket(io){
  io.on("connection", function(socket){
    //aumento il contatore degli online e popolo l'array degli utenti online
    socket.on('online', async function(idUser, idRoom, name){
      var exist = 0;

      function exists(){
        for (var i=0 ; i<userOnline[idRoom].length ; i++){
          if(userOnline[idRoom][i].id == idUser){
            exist = 1;
            break;
          }
        }
      }

      function insert(){
        dataUser.online(idUser).then(function(idUser){
          var data = idUser;
          data.password = '';
          data.status = 1;
          data.out = 'dentro';
          userOnline[idRoom].push(data);

          socket.to(idRoom).emit('online', data);
        })
      }

      async function controllo_access(){
        var f_exist = 0;

        function f(){
          for(var i=0 ; i<access.length ; i++){
            if(access[i].username == name){
              f_exist = 1;
            }
          }
        }

        await f();

        if(f_exist != 1){
          var data = {
            username: name,
            count: 1
          }
          access.push(data);
        }
      }

      if(typeof userOnline[idRoom] == 'undefined'){ //controllo se esiste la stanza nel array, se non esiste la inizializzo
        userOnline[idRoom] = new Array();
        await exists(); //controllo se ho già inserito l'utente
        if(exist == 0){
          await insert(); //inserisco l'utente nel array e incremente il counter degli online
          controllo_access();
        }
      }
      else{
        await exists();
        if(exist == 0){
          await insert();
          controllo_access();
        }
      }

    })

    function status(idRoom, id, stato){
      for (var i=0 ; i<userOnline[idRoom].length ; i++){
        if (userOnline[idRoom][i].id == id){
          userOnline[idRoom][i].status = stato;
        }
      }
    }

    socket.on('dentro', async function(idRoom, userId){
      socket.join(idRoom); //Entro nella stanza idRoom
      socket.to(idRoom).emit('dentro', userId);
      status(idRoom, userId, '1');

      for(var i=0 ; i<userOnline[idRoom].length ; i++){
        if(userOnline[idRoom][i].id == userId){
          userOnline[idRoom][i].out = 'dentro';
        }
      }
    })

    socket.on('fuori', async function(idRoom, userId){
      socket.to(idRoom).emit('fuori', userId);
      status(idRoom, userId, '0');
    })

    socket.on('close', async function(idRoom, userId, name){
      var datetime = new Date();
      socket.to(idRoom).emit('close', userId, datetime.getTime(), name);
      status(idRoom, userId, '0');

      for(var i=0 ; i<userOnline[idRoom].length ; i++){
        if(userOnline[idRoom][i].id == userId){
          userOnline[idRoom][i].out = datetime.getTime();
        }
      }
    })

    socket.on('changefoto', async function(idRoom, userId, url){
      var change = await function(){
        for(var i=0 ; i<userOnline[idRoom].length ; i++){
          if(userOnline[idRoom][i].id == userId){
            userOnline[idRoom][i].url = url;
          }
        }
      }

      socket.to(idRoom).emit("changefoto", userId, url);
    })

    socket.on('message', function(username, idRoom, text, ora){
      socket.to(idRoom).emit('sendMessage', username, text, ora);
    })

    //decremento il contatore e tolgo utente dall'array degli utenti online
    socket.on('offline', function(idUser, idRoom, username){

      for (var i=0 ; i<access.length ; i++){
        if(access[i].username == username){

          if(access[i].count > 1){
            access[i].count = (access[i].count)-1;
          }
          else{
            for (var i=0 ; i<userOnline[idRoom].length ; i++){
              if(userOnline[idRoom][i].id == idUser){
                username = userOnline[idRoom][i].username;
                userOnline[idRoom].splice(i, 1); //eliminino il record dal array useronline
                break;
              }
            }

            access.splice(i, 1); //elimino il record da access per permettere il login ad altri dispositivi
            if(counterOnline > 0){
              counterOnline--;
            }
          }

          socket.to(idRoom).emit('offline', idUser);
          break;
        }
      }
    })

    socket.on('writing', function(idRoom, userId, user){
      socket.to(idRoom).emit('writing', userId, user);
    })

    socket.on('stopWriting', function(idRoom, userId){
      socket.to(idRoom).emit('stopWriting', userId);
    })

    //Modifica del profilo
    socket.on('modProfile', function(data, id){
      for(var i=0 ; i<userOnline.length ; i++){
        try {
          for (var k=0; k<userOnline[i].length; k++) {
            if (userOnline[i][k].id == id) {
              userOnline[i][k].nome = data[0];
              userOnline[i][k].cognome = data[1];
              userOnline[i][k].mail = data[2];
              userOnline[i][k].username = data[3];
              userOnline[i][k].city = data[4];
              userOnline[i][k].instagram = data[5];
              userOnline[i][k].facebook = data[6];
              userOnline[i][k].linkedin = data[7];
            }
          }
        } catch (e) {
          //Lo uso soltanto per non fare crushare il server in caso di length = 0 e quindi gestisco l'eccezione
          //In caso di eccezione non effettuo nessuna operazione
        }
      }
    })

  })
}

module.exports = socket;
