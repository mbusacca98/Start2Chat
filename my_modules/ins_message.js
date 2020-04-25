var connect = require("../my_modules/connectDB");
var mysql = require("mysql");
var bodyParser = require("body-parser");

function message(text, id_user, id_room){
    var response = new Promise(function(resolve, reject){
      var conn = connect();

      conn.connect(function(err){
        if(!err){
          conn.query("SELECT * FROM rooms WHERE id=?", [id_room], function(err, res){
            if(!err && res[0].private_flag == 0){
              conn.query("INSERT INTO messages (text, id_rooms, id_user) VALUES (?, ?, ?)", [text, id_room, id_user], function(err, res){
                if(!err){
                  resolve('ok');
                }
                else{
                  resolve('err-msg');
                }
              })
            } else if(!err && res[0].private_flag == 1) {
              conn.query("SELECT * FROM auth WHERE id_user=? AND id_room=?", [id_user, id_room], function(err, res){
                if(!err && res.length == 1){
                  conn.query("INSERT INTO messages (text, id_rooms, id_user) VALUES (?, ?, ?)", [text, id_room, id_user], function(err, res){
                    if(!err){
                      resolve('ok');
                    }
                    else{
                      resolve('err-msg');
                    }
                  })
                }
              })
            }
          })
        }
        else{
          resolve('err-db');
        }
      })
    })

    return response;
}

exports.message = message;
