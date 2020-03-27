var connect = require("../my_modules/connectDB");
var mysql = require("mysql");
var bodyParser = require("body-parser");

function delUserAuth (id){
  var response = new Promise(function(resolve, reject){
    var conn = connect();

    conn.connect(function(err){
      if(!err){
        conn.query("DELETE FROM auth WHERE id_user=?", [id], function(err, res){
          if(!err){
            conn.end();
            resolve('ok');
          }
          else{
            conn.end();
            resolve('err-db');
          }
        })
      }
      else{
        conn.end();
        resolve('err-db')
      }
    })
  })

  return response;
}

exports.delUserAuth = delUserAuth;
