var express = require('express');
var router = express.Router();

var login = require("../my_modules/login");
var load = require("../my_modules/load");
var reg = require("../my_modules/registrazione");
var addUser = require("../my_modules/insUser");
var loadUser = require("../my_modules/loadUser");
var del = require("../my_modules/del");
var modCat = require("../my_modules/modCat");
var mod_pass = require("../my_modules/mod_password");
var message = require("../my_modules/ins_message");

var bodyParser = require('body-parser');
var fs = require('fs');
var mysql = require("mysql");
var connect = require("../my_modules/connectDB");
var multer = require('multer');

global.access = new Array(); //inizializzo array access per impedire il doppio login su più dispositivi

/* GET home page. */
router.get('/', function(req, res, next) {
  if(typeof req.session.user != 'undefined' && typeof req.session.id_user != 'undefined') res.render('index', {user: req.session.user, counter: counterOnline});
  res.render('index', {counter: counterOnline});
});

router.get('/reg', function(req, res, next) {
  if(typeof req.session.user != 'undefined' && typeof req.session.id_user != 'undefined') res.render('redirect', {user: req.session.user});

  res.render('reg');
})

router.get('/logout', function(req, res, next) {
  req.session.destroy();
  res.redirect('/');
})

router.post('/add_cat', function(req, res, next) {
  if(typeof req.session.user != 'undefined' && typeof req.session.id_user != 'undefined'){
    var conn = connect();

    conn.connect(function(err){
      if(!err && req.body.nomeCat != ''){
        conn.query("INSERT INTO rooms (nome, private_flag, admin_id) VALUES (?, ?, ?)", [req.body.nomeCat.toLowerCase(), 1, req.session.id_user], function(err, result){
          if(!err){
            conn.query("INSERT INTO auth (id_user, id_room) VALUES (?, ?)", [req.session.id_user, result.insertId], function(err, result){
              if(!err){
                conn.end();
                res.redirect('rooms');
              }
            })
          }
          else{
            conn.end();
          }
        })
      }
    })
  }
  else{
    res.redirect('login');
  }
})

router.get('/login', function(req, res, next) {
  if(typeof req.session.user != 'undefined' && typeof req.session.id_user != 'undefined') res.render('redirect', {user: req.session.user});

  res.render('login');
})

router.get('/rooms', function(req, res, next) {
  if(typeof req.session.user != 'undefined' && typeof req.session.id_user != 'undefined'){
    res.render('rooms', {id: req.session.id_user, user: req.session.user});
  }
  res.render('error', {error: 401});
})

router.post('/ajax/login', function(req, res, next) {

    async function f1() {
      try{
        var loginDb = await login.login(req.body.username, req.body.password);

        var exist = 0;
        var index;

        function f2(){
          for(var i=0 ; i<access.length ; i++){
            if(access[i].username == req.body.username){
              exist++;
              index = i;
              break;
            }
          }
        }

        if(loginDb[0] == 'logged-in'){
          await f2();

          req.session.user = req.body.username;
          req.session.id_user = loginDb[1];

          if(exist == 0){
            var data = {
              username: req.body.username,
              count: 1
            }
            access.push(data);
            counterOnline++;
          }

          else{
            access[index].count = (access[index].count)+1;
          }
        }

        res.json({output: loginDb[0], username: req.session.user, id: req.session.id_user});
      } catch {
          console.log('error login');
        }
    }
    f1();


})

router.post('/ajax/registrati', function(req, res, next) {
    async function f1() {
      try{
        var items = JSON.parse(req.body.data);
        var regDb = await reg.reg(items);
        res.json({output: regDb});
      } catch {
          console.log('error reg');
        }
    }
    f1();
})

router.post('/ajax/modPassword', function(req, res, next) {
    async function f1() {
      try{
        var mod = await mod_pass.mod_password(req.body.id, req.body.vecchia, req.body.nuova);
        res.json({output: mod});
      } catch {
          console.log('error reg');
        }
    }
    f1();
})

router.post('/ajax/loadAdCat', function(req, res, next){
  if(typeof req.session.id_user != 'undefined'){
    async function f1(){
      try{
        var id = req.body.id;
        var response = await load.loadAdCat(id);
        res.json({output: response});
      } catch {
        console.log('error load admin categories');
      }
    }

    f1();
  }
})

router.post('/ajax/loadMyCat', function(req, res, next){

  if(typeof req.session.id_user != 'undefined'){
    async function f1(){
      try{
        var id = req.body.id;
        var response = await load.loadMyCat(id);
        res.json({output: response});
      } catch {
        console.log('error load admin categories');
      }
    }

    f1();
  }
})

router.post('/ajax/delUser', function(req, res, next){

  if(typeof req.session.id_user != 'undefined'){
    async function f1(){
      try{
        var id = req.body.id;
        var response = await del.delUserAuth(id);
        res.json({output: response});
      } catch {
        console.log('error load admin categories');
      }
    }

    f1();
  }
})

router.post('/ajax/addUser', function(req, res, next){
  if(typeof req.session.id_user != 'undefined' && req.body.username != ''){
    async function f1(){
      try{
        var username = req.body.username.toLowerCase();
        var id_room = req.body.id_room;

        var response = await addUser.insUser(username, id_room);

        res.json({output: response});
      } catch {
        console.log('error add user into rooms');
      }
    }

    f1();
  }
})

router.post('/ajax/loadUser', function(req, res, next){
  if(typeof req.session.id_user != 'undefined'){

      async function f1(){
        try{
          var id_room = req.body.roomID;

          var response = await loadUser.loadUser(id_room);

          res.json({output: response});
        } catch {
          console.log('error add user into rooms');
        }
      }

      f1();
  }
})

router.post('/ajax/modNameCat', function(req, res, next){

  if(typeof req.session.id_user != 'undefined' && req.body.name != ''){
    async function f1(){
      try{
        var id = req.body.id;
        var name = req.body.name;

        var response = await modCat.modName(id, name);

        res.json({output: response});
      } catch {
        console.log('error add user into rooms');
      }
    }

    f1();
  }
})

router.post('/ajax/delRoom', function(req, res, next){

  if(typeof req.session.id_user != 'undefined'){
    async function f1(){
      try{
        var idRoom = req.body.id;

        var response = await modCat.delRoom(idRoom);

        res.json({output: response});
      } catch {
        console.log('error del rooms');
      }
    }

    f1();
  }
})

router.get('/admin', function(req, res){
  if(typeof req.session.user != 'undefined' && typeof req.session.id_user != 'undefined'){

    var conn = connect();

    conn.connect(function(err){
      if(!err){
        conn.query("SELECT * FROM rooms WHERE id=? AND nome=? AND admin_id=?", [req.query.id, req.query.name.toLowerCase(), req.session.id_user], function(err, result){
          if(!err && result.length > 0){
            conn.end();
            res.render('adminRooms', {nameRoom: req.query.name, roomID: req.query.id, myId: req.session.id_user});
          }
          else{
            conn.end();
            res.render('error', {error: 401});
          }
        })
      }
      else{
        conn.end();
      }


    })
  }

  else{
    res.render('error', {error: 401});
  }
})

router.get('/:id/chat', function(req, res){
  if(typeof req.session.id_user != 'undefined'){
    //Qui dentro faccio il router di accesso alle varie stanze della chat
    var conn = connect();
    conn.connect(function(err){
      if(!err){
        conn.query("SELECT * FROM rooms WHERE id=?", [req.params.id], function(err, result){
          if(!err){
            if(result.length > 0 && result[0].private_flag == 0){
              conn.query("SELECT messages.*, user.username FROM messages INNER JOIN user WHERE messages.id_rooms=? AND messages.id_user=user.id ORDER BY messages.id DESC LIMIT 30 ", [req.params.id], function(err, result){
                res.render('chat', {idRoom: req.params.id, userId: req.session.id_user, user: req.session.user, users: userOnline[req.params.id], messages: result});
              })
            }
            else if(result.length > 0 && result[0].private_flag != 0){
              conn.query("SELECT * FROM auth WHERE id_user = ? AND id_room = ?", [req.session.id_user, req.params.id], function(err, result){
                if(!err){
                  if(result.length > 0){
                    conn.query("SELECT messages.*, user.username FROM messages INNER JOIN user WHERE messages.id_rooms=? AND messages.id_user=user.id ORDER BY messages.id DESC LIMIT 30 ", [req.params.id], function(err, result){
                      res.render('chat', {idRoom: req.params.id, userId: req.session.id_user, user: req.session.user, users: userOnline[req.params.id], messages: result});
                    })
                  }
                  else{
                    res.redirect('../rooms');
                  }
                }
                else{
                  res.redirect('../rooms');
                }
              })
            }
            else{
              res.redirect('../rooms');
            }
          }
          else{
            res.redirect('../rooms');
          }
        })
      }
    })
  }
  else{
    res.redirect('login');
  }
})

//Caricamento con ajax dei message nel infinite loader
router.post('/ajax/loadMessage', function(req, res, next){

  if(typeof req.session.id_user != 'undefined'){
    async function f1(){
      try{
        var conn = connect();
        conn.connect(function(err){
          if(!err){
            conn.query("SELECT messages.*, user.username FROM messages INNER JOIN user WHERE messages.id_rooms=? AND messages.id<? AND messages.id_user=user.id ORDER BY messages.id DESC LIMIT 30 ", [req.body.room, req.body.index], function(err, result){
              if(!err){
                res.json({output: result});
              }
            })
          }
        })
      } catch {
        console.log('error del rooms');
      }
    }

    f1();
  }
})

router.post('/ajax/message', function(req, res){
  if(typeof req.session.id_user != 'undefined'){
    async function f1(){
      try{
        var text = req.body.message;
        var id_user = req.body.id_user;
        var id_room = req.body.id_room;

        var response = await message.message(text, id_user, id_room);

        res.json({output: response});
      } catch {

      }
    }

    f1();
  }
})

router.post('/ajax/loadMyProfile', function(req, res){
  if(typeof req.session.id_user != 'undefined'){
    var conn = connect();
    conn.connect(function(err){
      if(!err){
        conn.query("SELECT * FROM user WHERE id=?", [req.body.id], function(err, result){
          if(!err){
            res.json({output: result});
          }
        })
      }
    })
  }
})



router.post('/foto',function(req, res){
  var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/fotoUtenti/')
    },
    filename: function (req, file, cb) {
      cb(null, req.session.id_user+'.jpg')
    }
  })

  var upload =  multer({storage: storage}).single('foto');

  upload(req, res, function(err){
    if(!err){
      var url = "/fotoUtenti/"+req.session.id_user+".jpg";
      var conn = connect();

      conn.connect(function(err){
        if(!err){
          conn.query("UPDATE user SET photo=? WHERE id=?", [url, req.session.id_user], function(err){
            if(!err){
              conn.end();

              res.redirect('rooms');
            }
          })
        }
      })
    }
  })
})

router.post('/ajax/modProfile', function(req, res){
  if(typeof req.session.id_user != 'undefined'){
    var conn = connect();
    conn.connect(function(err){
      if(!err){
        conn.query("UPDATE user SET nome=?, cognome=?, mail=?, username=?, city=?, instagram=?, facebook=?, linkedin=? WHERE id=?", [req.body.nome, req.body.cognome, req.body.mail, req.body.username, req.body.city, req.body.instagram, req.body.facebook, req.body.linkedin, req.session.id_user], function(err, result){
          if(!err){
            res.json({output: 'ok'});
          }
        })
      }
    })
  }
})

router.get('/ajax/registrati', function(req, res, next) {
  res.render('error', {error: 401});
})

module.exports = router;
