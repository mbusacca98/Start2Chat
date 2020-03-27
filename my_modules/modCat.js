var connect = require("../my_modules/connectDB");
var mysql = require("mysql");
var bodyParser = require("body-parser");

function modName(id, name){
  if (name != '' && id != ''){
    var response = new Promise(function(resolve, reject){
      var conn = connect();

      conn.connect(function(err){
        if(!err){
          conn.query("UPDATE rooms SET nome=? WHERE id=?", [name.toLowerCase(), id], function(err, res){
            if(!err){
              resolve('ok');
            }
            else{
              resolve('err-mod');
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
}

function delRoom(id){
  if (id != ''){
    var response = new Promise(function(resolve, reject){
      var conn = connect();

      conn.connect(function(err){
        if(!err){
          console.log(id);
          conn.query("DELETE FROM rooms WHERE id=?", [id], function(err, res){
            if(!err){
              resolve('ok');
            }
            else{
              resolve('err-mod');
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
}

exports.modName = modName;
exports.delRoom = delRoom;
