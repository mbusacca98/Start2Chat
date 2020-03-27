var connect = require("../my_modules/connectDB");
var mysql = require("mysql");
var bodyParser = require("body-parser");
var md5 = require("md5");

function mod_password(id, vecchia, nuova){

  var pass_vecchia = md5(vecchia);
  var pass_nuova = md5(nuova);

  if (vecchia != nuova){
    var response = new Promise(function(resolve, reject){
      var conn = connect();

      conn.connect(function(err){
        if(!err){
          conn.query("SELECT * FROM user WHERE id = ?", [id], function(err, res){
            if(!err){
              if(res[0].password == pass_vecchia){
                conn.query("UPDATE user SET password=? WHERE id=?", [pass_nuova, id], function(err, res){
                  if(!err){
                    resolve("ok");
                  }
                  else{
                    resolve('error');
                  }
                })
              }
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
  else{
    return 'idem';
  }
}

exports.mod_password = mod_password;
