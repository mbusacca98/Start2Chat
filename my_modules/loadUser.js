var connect = require("../my_modules/connectDB");
var mysql = require("mysql");
var bodyParser = require("body-parser");

function loadUser(id_room){
  if(id_room != ''){
    var conn = connect();

    var response = new Promise(function(resolve, reject){
      conn.connect(function(err){
        if(!err){
          conn.query("SELECT auth.*, user.* FROM auth INNER JOIN user WHERE auth.id_room=? AND auth.id_user=user.id", [id_room], function(err, result){
            if(!err){
              if (result.length != 0) {
                conn.end();
                resolve(result);
              }
              else{
                conn.end();
                resolve('empty');
              }
            }
          })
        }
        else{
          conn.end();
          resolve('conn-err');
        }
      })
    })

    return response;
  }
}

exports.loadUser = loadUser;
