var connect = require("../my_modules/connectDB");
var mysql = require("mysql");
var bodyParser = require("body-parser");

function insUser(username, id_room){
  var conn = connect();

  var response = new Promise(function(resolve, reject){
    if(username != ''){
      conn.connect(function(err){
        if(!err){
          conn.query("SELECT * FROM user WHERE username=?", [username], function(err, result){
            if(!err && result.length == 1 && result[0].username == username){
              var id_user = result[0].id;
              var risposta = result[0];
              conn.query("SELECT * FROM auth WHERE id_user=? AND id_room=?", [result[0].id, id_room], function(err, result){
                if(!err && result.length == 0){
                  conn.query("INSERT INTO auth (id_user, id_room) VALUES (?, ?)", [id_user, id_room], function(err, result){
                    if(!err){
                      conn.end();
                      resolve(risposta);
                    }
                    else{
                      conn.end();
                      resolve('error');
                    }
                  })
                }
                else{
                  conn.end();
                  resolve('presente');
                }
              })
            }
            else{
              conn.end();
              resolve('userNotFound');
            }
          })
        }
      })
    }
  })

  return response;
}

exports.insUser = insUser;
